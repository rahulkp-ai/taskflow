// import request from "supertest";
// import app from "../index.js";
// import { clearDatabase, closeDatabase, connect } from "./setup.js";

// process.env.JWT_SECRET = "test_jwt_secret_key_for_testing_only";

// let adminCookie;
// let regularCookie;
// let taskId;

// beforeAll(async () => {
//   await connect();

//   // Register and login admin
//   await request(app).post("/api/user/register").send({
//     name: "Admin",
//     email: "admin@tasks.com",
//     password: "admin123",
//     isAdmin: true,
//     title: "Manager",
//     role: "Admin",
//   });

//   const adminLogin = await request(app).post("/api/user/login").send({
//     email: "admin@tasks.com",
//     password: "admin123",
//   });
//   adminCookie = adminLogin.headers["set-cookie"];

//   // Register regular user
//   await request(app).post("/api/user/register").send({
//     name: "Regular User",
//     email: "user@tasks.com",
//     password: "user123",
//     isAdmin: false,
//     title: "Developer",
//     role: "Engineer",
//   });

//   const userLogin = await request(app).post("/api/user/login").send({
//     email: "user@tasks.com",
//     password: "user123",
//   });
//   regularCookie = userLogin.headers["set-cookie"];
// });

// afterAll(async () => {
//   await clearDatabase();
//   await closeDatabase();
// });

// // ─── SYSTEM TESTS: Full Task Workflow ────────────────────────────────────────
// describe("Full Task Workflow", () => {
//   test("1. Admin can create a task", async () => {
//     const res = await request(app)
//       .post("/api/task/create")
//       .set("Cookie", adminCookie)
//       .send({
//         title: "Test Task",
//         team: [],
//         stage: "todo",
//         date: new Date().toISOString(),
//         priority: "normal",
//         description: "Test task description",
//       });

//     expect(res.statusCode).toBe(201);
//     expect(res.body.status).toBe(true);
//     expect(res.body.task.title).toBe("Test Task");
//     taskId = res.body.task._id;
//   });

//   test("2. Can fetch all tasks", async () => {
//     const res = await request(app)
//       .get("/api/task")
//       .set("Cookie", adminCookie);

//     expect(res.statusCode).toBe(200);
//     expect(res.body.status).toBe(true);
//     expect(Array.isArray(res.body.tasks)).toBe(true);
//     expect(res.body.tasks.length).toBeGreaterThan(0);
//   });

//   test("3. Can fetch single task by ID", async () => {
//     const res = await request(app)
//       .get(`/api/task/${taskId}`)
//       .set("Cookie", adminCookie);

//     expect(res.statusCode).toBe(200);
//     expect(res.body.task._id).toBe(taskId);
//     expect(res.body.task.title).toBe("Test Task");
//   });

//   test("4. Admin can update a task", async () => {
//     const res = await request(app)
//       .put(`/api/task/update/${taskId}`)
//       .set("Cookie", adminCookie)
//       .send({
//         title: "Updated Task",
//         team: [],
//         stage: "in progress",
//         date: new Date().toISOString(),
//         priority: "high",
//         description: "Updated description",
//       });

//     expect(res.statusCode).toBe(200);
//     expect(res.body.status).toBe(true);
//   });

//   test("5. Can change task stage", async () => {
//     const res = await request(app)
//       .put(`/api/task/change-stage/${taskId}`)
//       .set("Cookie", adminCookie)
//       .send({ stage: "completed" });

//     expect(res.statusCode).toBe(200);
//     expect(res.body.status).toBe(true);
//   });

//   test("6. Can add a subtask", async () => {
//     const res = await request(app)
//       .put(`/api/task/create-subtask/${taskId}`)
//       .set("Cookie", adminCookie)
//       .send({
//         title: "My Subtask",
//         tag: "urgent",
//         date: new Date().toISOString(),
//       });

//     expect(res.statusCode).toBe(201);
//     expect(res.body.status).toBe(true);
//   });

//   test("7. Can post activity on task", async () => {
//     const res = await request(app)
//       .post(`/api/task/activity/${taskId}`)
//       .set("Cookie", adminCookie)
//       .send({ type: "commented", activity: "This looks good!" });

//     expect(res.statusCode).toBe(200);
//     expect(res.body.status).toBe(true);
//   });

//   test("8. Admin can trash a task", async () => {
//     const res = await request(app)
//       .put(`/api/task/trash/${taskId}`)
//       .set("Cookie", adminCookie);

//     expect(res.statusCode).toBe(200);
//     expect(res.body.status).toBe(true);
//   });

//   test("9. Admin can restore a trashed task", async () => {
//     const res = await request(app)
//       .delete(`/api/task/delete-restore/${taskId}?actionType=restore`)
//       .set("Cookie", adminCookie);

//     expect(res.statusCode).toBe(200);
//     expect(res.body.status).toBe(true);
//   });

//   test("10. Admin can permanently delete a task", async () => {
//     // First trash it
//     await request(app)
//       .put(`/api/task/trash/${taskId}`)
//       .set("Cookie", adminCookie);

//     const res = await request(app)
//       .delete(`/api/task/delete-restore/${taskId}?actionType=delete`)
//       .set("Cookie", adminCookie);

//     expect(res.statusCode).toBe(200);
//     expect(res.body.status).toBe(true);
//   });
// });

// describe("Task Authorization", () => {
//   test("should reject unauthenticated request", async () => {
//     const res = await request(app).get("/api/task");
//     expect(res.statusCode).toBe(401);
//   });

//   test("regular user cannot create task", async () => {
//     const res = await request(app)
//       .post("/api/task/create")
//       .set("Cookie", regularCookie)
//       .send({
//         title: "Unauthorized Task",
//         team: [],
//         stage: "todo",
//         date: new Date().toISOString(),
//         priority: "low",
//       });

//     expect(res.statusCode).toBe(403);
//   });
// });

// describe("Dashboard Statistics", () => {
//   test("admin can fetch dashboard stats", async () => {
//     const res = await request(app)
//       .get("/api/task/dashboard")
//       .set("Cookie", adminCookie);

//     expect(res.statusCode).toBe(200);
//     expect(res.body.status).toBe(true);
//     expect(res.body).toHaveProperty("totalTasks");
//     expect(res.body).toHaveProperty("tasks");
//     expect(res.body).toHaveProperty("graphData");
//   });
// });

import request from "supertest";
import app from "../index.js";
import { clearDatabase, closeDatabase, connect } from "./setup.js";

process.env.JWT_SECRET = "test_jwt_secret_key_for_testing_only";

let adminCookie;
let regularCookie;
let taskId;

// Increased timeout to 10s for setup/teardown
beforeAll(async () => {
  await connect();

  // Register and login admin
  await request(app).post("/api/user/register").send({
    name: "Admin",
    email: "admin@tasks.com",
    password: "admin123",
    isAdmin: true,
    title: "Manager",
    role: "Admin",
  });

  const adminLogin = await request(app).post("/api/user/login").send({
    email: "admin@tasks.com",
    password: "admin123",
  });
  adminCookie = adminLogin.headers["set-cookie"];

  // Register regular user
  await request(app).post("/api/user/register").send({
    name: "Regular User",
    email: "user@tasks.com",
    password: "user123",
    isAdmin: false,
    title: "Developer",
    role: "Engineer",
  });

  const userLogin = await request(app).post("/api/user/login").send({
    email: "user@tasks.com",
    password: "user123",
  });
  regularCookie = userLogin.headers["set-cookie"];
}, 10000); 

afterAll(async () => {
  await clearDatabase();
  await closeDatabase();
}, 10000);

// Rest of your describes...
describe("Full Task Workflow", () => {
    // Keep your tests exactly as they were
    test("1. Admin can create a task", async () => {
        const res = await request(app)
          .post("/api/task/create")
          .set("Cookie", adminCookie)
          .send({
            title: "Test Task",
            team: [],
            stage: "todo",
            date: new Date().toISOString(),
            priority: "normal",
            description: "Test task description",
          });
    
        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe(true);
        expect(res.body.task.title).toBe("Test Task");
        taskId = res.body.task._id;
      });
    
      test("2. Can fetch all tasks", async () => {
        const res = await request(app)
          .get("/api/task")
          .set("Cookie", adminCookie);
    
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(Array.isArray(res.body.tasks)).toBe(true);
        expect(res.body.tasks.length).toBeGreaterThan(0);
      });
    
      test("3. Can fetch single task by ID", async () => {
        const res = await request(app)
          .get(`/api/task/${taskId}`)
          .set("Cookie", adminCookie);
    
        expect(res.statusCode).toBe(200);
        expect(res.body.task._id).toBe(taskId);
        expect(res.body.task.title).toBe("Test Task");
      });
    
      test("4. Admin can update a task", async () => {
        const res = await request(app)
          .put(`/api/task/update/${taskId}`)
          .set("Cookie", adminCookie)
          .send({
            title: "Updated Task",
            team: [],
            stage: "in progress",
            date: new Date().toISOString(),
            priority: "high",
            description: "Updated description",
          });
    
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
      });
    
      test("5. Can change task stage", async () => {
        const res = await request(app)
          .put(`/api/task/change-stage/${taskId}`)
          .set("Cookie", adminCookie)
          .send({ stage: "completed" });
    
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
      });
    
      test("6. Can add a subtask", async () => {
        const res = await request(app)
          .put(`/api/task/create-subtask/${taskId}`)
          .set("Cookie", adminCookie)
          .send({
            title: "My Subtask",
            tag: "urgent",
            date: new Date().toISOString(),
          });
    
        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe(true);
      });
    
      test("7. Can post activity on task", async () => {
        const res = await request(app)
          .post(`/api/task/activity/${taskId}`)
          .set("Cookie", adminCookie)
          .send({ type: "commented", activity: "This looks good!" });
    
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
      });
    
      test("8. Admin can trash a task", async () => {
        const res = await request(app)
          .put(`/api/task/trash/${taskId}`)
          .set("Cookie", adminCookie);
    
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
      });
    
      test("9. Admin can restore a trashed task", async () => {
        const res = await request(app)
          .delete(`/api/task/delete-restore/${taskId}?actionType=restore`)
          .set("Cookie", adminCookie);
    
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
      });
    
      test("10. Admin can permanently delete a task", async () => {
        await request(app)
          .put(`/api/task/trash/${taskId}`)
          .set("Cookie", adminCookie);
    
        const res = await request(app)
          .delete(`/api/task/delete-restore/${taskId}?actionType=delete`)
          .set("Cookie", adminCookie);
    
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
      });
});

describe("Task Authorization", () => {
  test("should reject unauthenticated request", async () => {
    const res = await request(app).get("/api/task");
    expect(res.statusCode).toBe(401);
  });

  test("regular user cannot create task", async () => {
    const res = await request(app)
      .post("/api/task/create")
      .set("Cookie", regularCookie)
      .send({
        title: "Unauthorized Task",
        team: [],
        stage: "todo",
        date: new Date().toISOString(),
        priority: "low",
      });

    expect(res.statusCode).toBe(403);
  });
});

describe("Dashboard Statistics", () => {
  test("admin can fetch dashboard stats", async () => {
    const res = await request(app)
      .get("/api/task/dashboard")
      .set("Cookie", adminCookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body).toHaveProperty("totalTasks");
    expect(res.body).toHaveProperty("tasks");
    expect(res.body).toHaveProperty("graphData");
  });
});