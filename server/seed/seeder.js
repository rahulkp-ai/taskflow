import dotenv from "dotenv";
import mongoose from "mongoose";
import Notice from "../models/notis.js";
import Task from "../models/taskModel.js";
import User from "../models/userModel.js";
import { getTasks, USERS } from "./data.js";

dotenv.config();

const log = {
  info: (msg) => console.log(`  i  ${msg}`),
  ok: (msg) => console.log(`  OK ${msg}`),
  warn: (msg) => console.log(`  ~  ${msg}`),
  error: (msg) => console.error(`  !! ${msg}`),
  section: (msg) =>
    console.log(`\n${"─".repeat(50)}\n  ${msg}\n${"─".repeat(50)}`),
};

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    log.error("MONGODB_URI is not set.");
    process.exit(1);
  }
  await mongoose.connect(uri);
  log.ok(`Connected to MongoDB: ${mongoose.connection.host}`);
}

async function isAlreadySeeded() {
  const adminCount = await User.countDocuments({ isAdmin: true });
  const taskCount = await Task.countDocuments();
  return adminCount > 0 && taskCount > 0;
}

async function seedUsers() {
  log.section("STEP 1 — Seeding Users");
  const created = [];

  for (const userData of USERS) {
    const existing = await User.findOne({ email: userData.email });
    if (existing) {
      log.warn(`User already exists: ${userData.email} — skipping`);
      created.push(existing);
      continue;
    }

    // FIX: Use new User() + save() so the Mongoose pre-save bcrypt hook
    // runs exactly ONCE on the plain-text password.
    // NEVER pre-hash manually then call User.create() — that causes
    // double-hashing: hook hashes the already-hashed string a second time,
    // making bcrypt.compare() always return false at login.
    const user = new User(userData);
    await user.save();

    log.ok(`Created ${user.isAdmin ? "ADMIN" : "user"}: ${user.name} <${user.email}>`);
    created.push(user);
  }

  return created;
}

async function seedTasks(userDocs) {
  log.section("STEP 2 — Seeding Tasks, Subtasks & Activities");

  const [adminDoc, sarahDoc, jamesDoc, priyaDoc, carlosDoc, emmaDoc] = userDocs;
  const userMap = {
    admin: adminDoc._id,
    sarah: sarahDoc._id,
    james: jamesDoc._id,
    priya: priyaDoc._id,
    carlos: carlosDoc._id,
    emma: emmaDoc._id,
  };

  const taskDefs = getTasks(userMap);
  const createdTasks = [];

  for (const taskDef of taskDefs) {
    const existing = await Task.findOne({ title: taskDef.title });
    if (existing) {
      log.warn(`Task already exists: "${taskDef.title}" — skipping`);
      createdTasks.push(existing);
      continue;
    }

    const task = await Task.create(taskDef);
    log.ok(`Created task [${task.stage.toUpperCase()}]: "${task.title}" — ${task.subTasks.length} subtasks`);
    createdTasks.push(task);
  }

  return createdTasks;
}

async function linkTasksToUsers(userDocs, taskDocs) {
  log.section("STEP 3 — Linking Tasks to User profiles");
  let linked = 0;

  for (const user of userDocs) {
    const userTasks = taskDocs.filter((t) =>
      t.team.some((id) => id.toString() === user._id.toString())
    );
    if (userTasks.length === 0) continue;

    const newTaskIds = userTasks
      .map((t) => t._id)
      .filter((id) => !user.tasks.some((ex) => ex.toString() === id.toString()));

    if (newTaskIds.length > 0) {
      await User.findByIdAndUpdate(user._id, {
        $addToSet: { tasks: { $each: newTaskIds } },
      });
      log.ok(`Linked ${newTaskIds.length} task(s) to ${user.name}`);
      linked += newTaskIds.length;
    }
  }

  log.ok(`Total task-user links: ${linked}`);
}

async function seedNotifications(userDocs, taskDocs) {
  log.section("STEP 4 — Seeding Notifications");
  const [adminDoc] = userDocs;
  let created = 0;

  for (const task of taskDocs) {
    if (task.team.length === 0) continue;
    const existing = await Notice.findOne({ task: task._id });
    if (existing) {
      log.warn(`Notice already exists for "${task.title}" — skipping`);
      continue;
    }

    let text = "New task has been assigned to you";
    if (task.team.length > 1) text += ` and ${task.team.length - 1} other${task.team.length > 2 ? "s" : ""}`;
    text += `. "${task.title}" — Priority: ${task.priority}. Due: ${task.date.toDateString()}.`;

    await Notice.create({
      team: task.team,
      text,
      task: task._id,
      notiType: "alert",
      isRead: [adminDoc._id],
    });
    log.ok(`Created notice for "${task.title}"`);
    created++;
  }

  log.ok(`Total notifications: ${created}`);
}

async function printSummary(userDocs) {
  log.section("SEED COMPLETE — Summary");
  const totalUsers = await User.countDocuments();
  const totalTasks = await Task.countDocuments();
  const totalNotices = await Notice.countDocuments();
  const completedTasks = await Task.countDocuments({ stage: "completed" });
  const inProgressTasks = await Task.countDocuments({ stage: "in progress" });
  const todoTasks = await Task.countDocuments({ stage: "todo" });

  console.log(`
  Users        : ${totalUsers} (${userDocs.filter((u) => u.isAdmin).length} admin, ${userDocs.filter((u) => !u.isAdmin && u.isActive).length} active, ${userDocs.filter((u) => !u.isActive).length} inactive)
  Tasks        : ${totalTasks} (${completedTasks} done, ${inProgressTasks} in-progress, ${todoTasks} todo)
  Notifications: ${totalNotices}

  LOGIN CREDENTIALS
  -------------------------------------------------
  Admin       : admin@taskflow.com  / Admin@123
  Developer   : sarah@taskflow.com  / Sarah@123
  Developer   : james@taskflow.com  / James@123
  Designer    : priya@taskflow.com  / Priya@123
  QA Engineer : carlos@taskflow.com / Carlos@123
  DevOps*     : emma@taskflow.com   / Emma@123  (INACTIVE account)
  -------------------------------------------------
  App: http://localhost:3000
  `);
}

async function runSeed() {
  console.log("\nTaskFlow — Data Seed Pipeline\n" + "=".repeat(50));

  try {
    await connectDB();

    if (await isAlreadySeeded()) {
      log.warn("Database already seeded.");
      if (process.env.FORCE_RESEED !== "true") {
        log.ok("Skipping — data already exists. Set FORCE_RESEED=true to reset.");
        await mongoose.disconnect();
        return;
      }
      log.warn("FORCE_RESEED=true — wiping all data...");
      await Promise.all([User.deleteMany({}), Task.deleteMany({}), Notice.deleteMany({})]);
      log.ok("Collections cleared.");
    }

    const userDocs = await seedUsers();
    const taskDocs = await seedTasks(userDocs);
    await linkTasksToUsers(userDocs, taskDocs);
    await seedNotifications(userDocs, taskDocs);
    await printSummary(userDocs);

    await mongoose.disconnect();
    log.ok("Seed complete!");
    process.exit(0);
  } catch (err) {
    log.error(`Seed failed: ${err.message}`);
    console.error(err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

runSeed();
