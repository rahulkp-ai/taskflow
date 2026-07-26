import asyncHandler from "express-async-handler";
import Notice from "../models/notis.js";
import Task from "../models/taskModel.js";
import User from "../models/userModel.js";

// POST - Create a new task
const createTask = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { title, team, stage, date, priority, assets, links, description } =
    req.body;

  if (!title) {
    return res
      .status(400)
      .json({ status: false, message: "Task title is required." });
  }

  let text = "New task has been assigned to you";
  if (team?.length > 1) {
    text += ` and ${team.length - 1} others.`;
  }
  text += ` Priority: ${priority}. Due date: ${new Date(date).toDateString()}.`;

  const activity = { type: "assigned", activity: text, by: userId };
  const newLinks = links ? links.split(",").map((l) => l.trim()) : [];

  const task = await Task.create({
    title,
    team,
    stage: stage?.toLowerCase() || "todo",
    date,
    priority: priority?.toLowerCase() || "normal",
    assets: assets || [],
    activities: [activity],
    links: newLinks,
    description: description || "",
  });

  await Notice.create({ team, text, task: task._id });

  // Add task to each team member
  if (team?.length > 0) {
    await User.updateMany(
      { _id: { $in: team } },
      { $push: { tasks: task._id } }
    );
  }

  res
    .status(201)
    .json({ status: true, task, message: "Task created successfully." });
});

// POST - Duplicate a task (FIXED: was referencing undefined 'team' variable)
const duplicateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const task = await Task.findById(id);

  if (!task) {
    return res
      .status(404)
      .json({ status: false, message: "Task not found." });
  }

  let text = "New task has been assigned to you";
  if (task.team?.length > 1) {
    text += ` and ${task.team.length - 1} others.`;
  }
  text += ` Priority: ${task.priority}. Due date: ${new Date(task.date).toDateString()}.`;

  const activity = { type: "assigned", activity: text, by: userId };

  const newTask = await Task.create({
    title: "Duplicate - " + task.title,
    team: task.team,
    stage: task.stage,
    date: task.date,
    priority: task.priority,
    assets: task.assets,
    links: task.links,
    description: task.description,
    subTasks: task.subTasks,
    activities: [activity],
  });

  await Notice.create({ team: newTask.team, text, task: newTask._id });

  res
    .status(201)
    .json({ status: true, message: "Task duplicated successfully." });
});

// PUT - Update task
const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, date, team, stage, priority, assets, links, description } =
    req.body;

  const task = await Task.findById(id);

  if (!task) {
    return res.status(404).json({ status: false, message: "Task not found." });
  }

  const newLinks = links
    ? links.split(",").map((l) => l.trim())
    : task.links;

  task.title = title || task.title;
  task.date = date || task.date;
  task.priority = priority?.toLowerCase() || task.priority;
  task.assets = assets || task.assets;
  task.stage = stage?.toLowerCase() || task.stage;
  task.team = team || task.team;
  task.links = newLinks;
  task.description = description ?? task.description;

  await task.save();

  res
    .status(200)
    .json({ status: true, message: "Task updated successfully." });
});

// PUT - Update task stage only
const updateTaskStage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { stage } = req.body;

  const task = await Task.findById(id);

  if (!task) {
    return res.status(404).json({ status: false, message: "Task not found." });
  }

  task.stage = stage.toLowerCase();
  await task.save();

  res
    .status(200)
    .json({ status: true, message: "Task stage updated successfully." });
});

// PUT - Update subtask completion status
const updateSubTaskStage = asyncHandler(async (req, res) => {
  const { taskId, subTaskId } = req.params;
  const { status } = req.body;

  const updated = await Task.findOneAndUpdate(
    { _id: taskId, "subTasks._id": subTaskId },
    { $set: { "subTasks.$.isCompleted": status } },
    { new: true }
  );

  if (!updated) {
    return res
      .status(404)
      .json({ status: false, message: "Task or subtask not found." });
  }

  res.status(200).json({
    status: true,
    message: status
      ? "Subtask marked as completed."
      : "Subtask marked as incomplete.",
  });
});

// POST - Create a subtask
const createSubTask = asyncHandler(async (req, res) => {
  const { title, tag, date } = req.body;
  const { id } = req.params;

  if (!title) {
    return res
      .status(400)
      .json({ status: false, message: "Subtask title is required." });
  }

  const task = await Task.findById(id);

  if (!task) {
    return res.status(404).json({ status: false, message: "Task not found." });
  }

  task.subTasks.push({ title, date, tag, isCompleted: false });
  await task.save();

  res
    .status(201)
    .json({ status: true, message: "Subtask added successfully." });
});

// GET - Get all tasks
const getTasks = asyncHandler(async (req, res) => {
  const { userId, isAdmin } = req.user;
  const { stage, isTrashed, search } = req.query;

  let query = { isTrashed: isTrashed === "true" };

  if (!isAdmin) {
    query.team = { $all: [userId] };
  }
  if (stage) {
    query.stage = stage;
  }
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { stage: { $regex: search, $options: "i" } },
      { priority: { $regex: search, $options: "i" } },
    ];
  }

  const tasks = await Task.find(query)
    .populate({ path: "team", select: "name title email" })
    .sort({ _id: -1 });

  res.status(200).json({ status: true, tasks });
});

// GET - Get single task
const getTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id)
    .populate({ path: "team", select: "name title role email" })
    .populate({ path: "activities.by", select: "name" });

  if (!task) {
    return res.status(404).json({ status: false, message: "Task not found." });
  }

  res.status(200).json({ status: true, task });
});

// POST - Post activity on a task
const postTaskActivity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  const { type, activity } = req.body;

  const task = await Task.findById(id);

  if (!task) {
    return res.status(404).json({ status: false, message: "Task not found." });
  }

  task.activities.push({ type, activity, by: userId });
  await task.save();

  res
    .status(200)
    .json({ status: true, message: "Activity posted successfully." });
});

// PUT - Soft-delete (trash) a task
const trashTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id);

  if (!task) {
    return res.status(404).json({ status: false, message: "Task not found." });
  }

  task.isTrashed = true;
  await task.save();

  res
    .status(200)
    .json({ status: true, message: "Task moved to trash successfully." });
});

// DELETE/PUT - Delete or restore task(s)
const deleteRestoreTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { actionType } = req.query;

  const validActions = ["delete", "deleteAll", "restore", "restoreAll"];
  if (!validActions.includes(actionType)) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid action type." });
  }

  if (actionType === "delete") {
    await Task.findByIdAndDelete(id);
  } else if (actionType === "deleteAll") {
    await Task.deleteMany({ isTrashed: true });
  } else if (actionType === "restore") {
    await Task.findByIdAndUpdate(id, { isTrashed: false });
  } else if (actionType === "restoreAll") {
    await Task.updateMany({ isTrashed: true }, { $set: { isTrashed: false } });
  }

  res
    .status(200)
    .json({ status: true, message: "Operation performed successfully." });
});

// GET - Dashboard statistics
const dashboardStatistics = asyncHandler(async (req, res) => {
  const { userId, isAdmin } = req.user;

  const taskFilter = isAdmin
    ? { isTrashed: false }
    : { isTrashed: false, team: { $all: [userId] } };

  const allTasks = await Task.find(taskFilter)
    .populate({ path: "team", select: "name role title email" })
    .sort({ _id: -1 });

  const users = await User.find({ isActive: true })
    .select("name title role isActive createdAt")
    .limit(10)
    .sort({ _id: -1 });

  const groupedTasks = allTasks.reduce((result, task) => {
    result[task.stage] = (result[task.stage] || 0) + 1;
    return result;
  }, {});

  const graphData = Object.entries(
    allTasks.reduce((result, task) => {
      result[task.priority] = (result[task.priority] || 0) + 1;
      return result;
    }, {})
  ).map(([name, total]) => ({ name, total }));

  res.status(200).json({
    status: true,
    totalTasks: allTasks.length,
    last10Task: allTasks.slice(0, 10),
    users: isAdmin ? users : [],
    tasks: groupedTasks,
    graphData,
    message: "Dashboard data fetched successfully.",
  });
});

export {
  createSubTask,
  createTask,
  dashboardStatistics,
  deleteRestoreTask,
  duplicateTask,
  getTask,
  getTasks,
  postTaskActivity,
  trashTask,
  updateSubTaskStage,
  updateTask,
  updateTaskStage,
};
