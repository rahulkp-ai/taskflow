import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { errorHandler, routeNotFound } from "./middleware/errorMiddleware.js";
import routes from "./routes/index.js";
import dbConnection from "./utils/connectDB.js";

dotenv.config();

// Only connect to real DB if NOT in test mode
if (process.env.NODE_ENV !== "test") {
  dbConnection();
}

const port = process.env.PORT || 5001;
const app = express();

// CLIENT_ORIGIN supports a single URL or a comma-separated list, e.g.
// CLIENT_ORIGIN=https://taskflow.vercel.app,http://localhost:3000
const allowedOrigins = (
  process.env.CLIENT_ORIGIN || "http://localhost:3000"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, server-to-server, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);

// Basic rate limiting on the API surface to slow down brute-force/abuse.
// Skipped in test mode so the Jest/Supertest suite isn't throttled.
if (process.env.NODE_ENV !== "test") {
  app.use(
    "/api",
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 300, // requests per window per IP
      standardHeaders: true,
      legacyHeaders: false,
    })
  );
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", routes);

app.use(routeNotFound);
app.use(errorHandler);

// Only start the server if this file is run directly (not imported by tests)
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () =>
    console.log(`🚀 Server running on http://localhost:${port}`)
  );
}

export default app;
