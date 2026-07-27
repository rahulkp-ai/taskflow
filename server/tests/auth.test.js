import request from "supertest";
import app from "../index.js";
import User from "../models/userModel.js";
import { clearDatabase, closeDatabase, connect } from "./setup.js";

// Set JWT secret for tests
process.env.JWT_SECRET = "test_jwt_secret_key_for_testing_only";

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

// ─── UNIT TESTS: User Model ───────────────────────────────────────────────────
describe("User Model", () => {
  test("should create a user with hashed password", async () => {
    const user = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      title: "Developer",
      role: "Engineer",
    });

    expect(user.name).toBe("Test User");
    expect(user.email).toBe("test@example.com");
    expect(user.password).not.toBe("password123"); // should be hashed
    expect(user.isActive).toBe(true);
    expect(user.isAdmin).toBe(false);
  });

  test("should correctly match password", async () => {
    const user = await User.create({
      name: "Test User",
      email: "test2@example.com",
      password: "mypassword",
      title: "Developer",
      role: "Engineer",
    });

    const isMatch = await user.matchPassword("mypassword");
    const isWrong = await user.matchPassword("wrongpassword");

    expect(isMatch).toBe(true);
    expect(isWrong).toBe(false);
  });

  test("should reject user without required fields", async () => {
    await expect(
      User.create({ name: "No Email User" })
    ).rejects.toThrow();
  });
});

// ─── INTEGRATION TESTS: Auth API ─────────────────────────────────────────────
describe("POST /api/user/register", () => {
  test("should register a new admin user", async () => {
    const res = await request(app).post("/api/user/register").send({
      name: "Admin User",
      email: "admin@test.com",
      password: "password123",
      isAdmin: true,
      title: "Manager",
      role: "Admin",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe("admin@test.com");
    expect(res.body.password).toBeUndefined();
  });

  test("should not register duplicate email", async () => {
    await request(app).post("/api/user/register").send({
      name: "User One",
      email: "dup@test.com",
      password: "password123",
      title: "Developer",
      role: "Engineer",
    });

    const res = await request(app).post("/api/user/register").send({
      name: "User Two",
      email: "dup@test.com",
      password: "password456",
      title: "Designer",
      role: "Designer",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
  });

  test("should reject missing required fields", async () => {
    const res = await request(app).post("/api/user/register").send({
      name: "Incomplete User",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
  });
});

describe("POST /api/user/login", () => {
  beforeEach(async () => {
    await request(app).post("/api/user/register").send({
      name: "Login Test",
      email: "login@test.com",
      password: "testpass123",
      isAdmin: true,
      title: "Tester",
      role: "QA",
    });
  });

  test("should login with valid credentials", async () => {
    const res = await request(app).post("/api/user/login").send({
      email: "login@test.com",
      password: "testpass123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("login@test.com");
    expect(res.body.password).toBeUndefined();
    expect(res.headers["set-cookie"]).toBeDefined(); // JWT cookie set
  });

  test("should reject invalid password", async () => {
    const res = await request(app).post("/api/user/login").send({
      email: "login@test.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe(false);
  });

  test("should reject non-existent email", async () => {
    const res = await request(app).post("/api/user/login").send({
      email: "nobody@test.com",
      password: "somepassword",
    });

    expect(res.statusCode).toBe(401);
  });
});

describe("POST /api/user/logout", () => {
  test("should logout and clear cookie", async () => {
    const res = await request(app).post("/api/user/logout");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
  });
});

describe("Health Check", () => {
  test("GET /health should return ok", async () => {
    const res = await request(app).get("/health");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});
