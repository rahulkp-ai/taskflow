<a name="top"></a>

<!-- ─── Badges ──────────────────────────────────────────────────── -->

![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-blue?logo=react&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-blue?logo=docker&logoColor=white)
![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)
[![CI](https://github.com/rahulkp-ai/TaskFlow/actions/workflows/ci.yml/badge.svg)](https://github.com/rahulkp-ai/TaskFlow/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-taskflow--rahul--kp.vercel.app-6366f1?logo=vercel&logoColor=white)](https://taskflow-rahul-kp.vercel.app)

<!-- Update the org/repo path above if you push this under a different repository name. -->

---

# TaskFlow

**A full-stack task management platform** that lets teams plan, track, and collaborate on work through a Kanban-style interface with role-based access, real-time notifications, and dashboard analytics. Built on the MERN stack and fully containerized with Docker for one-command local deployment.

---

## Table of Contents

- [Live Demo](#live-demo)
- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [Architecture Overview](#architecture-overview)
- [Environment Setup](#environment-setup)
- [API Endpoints](#api-endpoints)
- [Usage Examples](#usage-examples)
- [Deployment](#deployment)

---

## Live Demo

|                  |                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------- |
| **Frontend**     | [taskflow-rahul-kp.vercel.app](https://taskflow-rahul-kp.vercel.app)                   |
| **Backend API**  | [taskflow-api-39g8.onrender.com](https://taskflow-api-39g8.onrender.com)               |
| **Health check** | [taskflow-api-39g8.onrender.com/health](https://taskflow-api-39g8.onrender.com/health) |

Sign in with any of the seed accounts below (full list under [Seed Credentials](#seed-credentials-auto-seeded)):

```
Email:    admin@taskflow.com
Password: Admin@123
```

> **Note:** the API runs on Render's free tier, which spins down after inactivity. The first request after idle time can take 30–60s to wake up — subsequent requests are fast. This is expected on a $0 deployment, not a bug.

<p align="right"><a href="#top">back to top</a></p>

---

## Tech Stack

| Category           | Technology                                                                                                                        |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**       | React 18, Vite, Tailwind CSS, Redux Toolkit (RTK Query), React Router v6, Recharts, Headless UI, Sonner (toasts), react-hook-form |
| **Backend**        | Node.js 20, Express 4, Mongoose 8, bcryptjs, jsonwebtoken, cookie-parser, morgan                                                  |
| **Database**       | MongoDB 7.0 (local via Docker or Atlas cloud)                                                                                     |
| **Authentication** | JWT stored in HttpOnly cookies, bcrypt (12-round salt), role-based middleware (`protectRoute`, `isAdminRoute`)                    |
| **Security**       | `helmet` (secure HTTP headers), `express-rate-limit` (300 req / 15 min per IP on `/api`), env-driven CORS allow-list              |
| **File Storage**   | Firebase SDK (client-side, optional)                                                                                              |
| **Testing**        | Jest + Supertest + mongodb-memory-server (server), Vitest + React Testing Library + jsdom (client)                                |
| **DevOps**         | Docker, Docker Compose (3 services: client, server, MongoDB), hot-reload volume mounts, health checks                             |
| **Linting**        | ESLint (React, React Hooks, React Refresh plugins)                                                                                |

<p align="right"><a href="#top">back to top</a></p>

---

## Key Features

- **Kanban Board & List Views** — Switch between board (columns: Todo / In Progress / Completed) and table list views
- **Role-Based Access Control** — Admin users manage tasks and team members; regular users view and interact with assigned tasks
- **Task Lifecycle** — Create, duplicate, update, change stage, soft-delete (trash), restore, and permanently delete tasks
- **Subtasks** — Add subtasks with completion toggles and tags
- **Activity Feed** — Post comments and track activity history per task (assigned, started, in progress, bug, completed, commented)
- **Notifications** — Unread notification panel for task assignments; mark individual or all as read
- **Dashboard Analytics** — Aggregate stats by stage, priority distribution chart (Recharts), recent tasks, and active users
- **Dark Mode** — Toggle via navbar; persisted to localStorage
- **Search & Filtering** — Filter tasks by stage, trash status, and free-text search across title/stage/priority
- **User Management** — Admin can activate/deactivate accounts, change passwords, and delete users
- **Data Seeding** — Automated seed pipeline with 6 demo users, 12 tasks, subtasks, and notifications on first startup
- **Containerized Development** — Single `docker-compose up` command spins up all services with hot-reload

<p align="right"><a href="#top">back to top</a></p>

---

## Architecture Overview

```mermaid
flowchart LR
    subgraph Client["Client — Vite + React :3000"]
        UI[React Components]
        RTK[Redux Toolkit / RTK Query]
        UI --> RTK
    end

    subgraph Server["Server — Express :5000"]
        MW[helmet · CORS · rate limit · cookie-parser]
        AUTH[protectRoute / isAdminRoute]
        CTRL[Controllers]
        ERR[errorMiddleware]
        MW --> AUTH --> CTRL
        CTRL --> ERR
    end

    subgraph DB["MongoDB 7.0"]
        USERS[(users)]
        TASKS[(tasks)]
        NOTICES[(notices)]
    end

    RTK -- "HTTPS + HttpOnly JWT cookie" --> MW
    CTRL -- Mongoose ODM --> USERS
    CTRL -- Mongoose ODM --> TASKS
    CTRL -- Mongoose ODM --> NOTICES

    SEED[seed/seeder.js] -- "entrypoint.sh, idempotent" --> DB
```

**Data flow:**

1. The **React client** uses RTK Query to send authenticated HTTP requests (cookies attached automatically via `credentials: "include"`) to the Express API.
2. The **Express server** applies `protectRoute` middleware to verify the JWT from the HttpOnly cookie, then delegates to controller functions in an MVC pattern.
3. **Mongoose** ODM maps controllers to MongoDB operations on three collections: `users`, `tasks`, and `notices`.
4. On Docker startup, `entrypoint.sh` runs `seed/seeder.js` to populate the database with demo data (idempotent — skips if data already exists).
5. Error handling is centralized via `errorMiddleware.js` which catches Mongoose validation errors, duplicate key errors, and cast errors.

**Key server directories:**

| Directory      | Purpose                                                                |
| -------------- | ---------------------------------------------------------------------- |
| `controllers/` | Business logic for users and tasks                                     |
| `middleware/`  | JWT auth (`protectRoute`), admin guard (`isAdminRoute`), error handler |
| `models/`      | Mongoose schemas (User, Task, Notice) with pre-save hooks              |
| `routes/`      | Express routers mounted at `/api/user` and `/api/task`                 |
| `utils/`       | JWT creation helper, MongoDB connection                                |
| `seed/`        | Demo data and idempotent seeder script                                 |

**Key client directories:**

| Directory       | Purpose                                                              |
| --------------- | -------------------------------------------------------------------- |
| `pages/`        | Route-level components (Dashboard, Tasks, Login, Users, etc.)        |
| `components/`   | Reusable UI (Sidebar, Navbar, Table, ModalWrapper, task cards)       |
| `redux/slices/` | Redux state (auth slice) and RTK Query API slices (auth, user, task) |
| `utils/`        | Firebase config, helper functions                                    |

<p align="right"><a href="#top">back to top</a></p>

---

## Environment Setup

> **Shortcut:** if you have `make` installed, `make env` creates both `.env` files from the templates below, and `make up` / `make down` / `make test` wrap the Docker and test commands throughout this section. Run `make help` to see everything available.

### Prerequisites

| Tool                    | Version | Required                      |
| ----------------------- | ------- | ----------------------------- |
| Docker & Docker Compose | Latest  | Yes (for containerized setup) |
| Node.js                 | >= 18   | Yes (for local setup)         |
| MongoDB                 | 7.0+    | Only if not using Docker      |

### Option A: Docker (Recommended)

```bash
# 1. Clone the repository
git clone <repo-url> TaskFlow && cd TaskFlow

# 2. Environment files are pre-configured for Docker.
#    Edit server/.env only if switching to MongoDB Atlas.

# 3. Start all services
docker-compose up --build
# or: make up
```

Services will be available at:

| Service      | URL                          |
| ------------ | ---------------------------- |
| Frontend     | http://localhost:3000        |
| Backend API  | http://localhost:5001        |
| Health Check | http://localhost:5001/health |

The entrypoint script automatically seeds the database on first run.

### Option B: Local Development

```bash
# 1. Install server dependencies
cd server && npm install

# 2. Install client dependencies
cd ../client && npm install

# 3. Configure environment variables (see below)

# 4. Start servers in separate terminals
cd server && npm run dev    # Terminal 1
cd client && npm run dev    # Terminal 2
```

### Environment Variables

Copy `server/.env.example` → `server/.env` and `client/.env.example` → `client/.env`, then fill in real values. The examples below mirror those files.

**`server/.env`**

```env
PORT=5000
NODE_ENV=development

# Local MongoDB (Docker)
MONGODB_URI=mongodb://admin:adminpassword123@mongodb:27017/taskmanager?authSource=admin

# OR Local MongoDB (no Docker)
# MONGODB_URI=mongodb://localhost:27017/taskmanager

# OR MongoDB Atlas
# MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/taskmanager?retryWrites=true&w=majority

JWT_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
CLIENT_ORIGIN=http://localhost:3000
```

**`client/.env`**

```env
VITE_API_URL=http://localhost:5001

# Optional — Firebase (for file uploads)
VITE_FIREBASE_API_KEY=<your_key>
VITE_FIREBASE_AUTH_DOMAIN=<your_domain>
VITE_FIREBASE_PROJECT_ID=<your_project_id>
VITE_FIREBASE_STORAGE_BUCKET=<your_bucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<your_sender_id>
VITE_FIREBASE_APP_ID=<your_app_id>
```

### Seed Credentials (Auto-Seeded)

| User   | Email               | Password   | Role              |
| ------ | ------------------- | ---------- | ----------------- |
| Admin  | admin@taskflow.com  | Admin@123  | Admin             |
| Sarah  | sarah@taskflow.com  | Sarah@123  | Frontend Engineer |
| James  | james@taskflow.com  | James@123  | Backend Engineer  |
| Priya  | priya@taskflow.com  | Priya@123  | Designer          |
| Carlos | carlos@taskflow.com | Carlos@123 | QA Engineer       |
| Emma   | emma@taskflow.com   | Emma@123   | DevOps (inactive) |

<p align="right"><a href="#top">back to top</a></p>

---

## API Endpoints

All routes are prefixed with `/api`. Protected routes require a valid JWT cookie.

### Health Check

| Method | Path      | Auth | Description          |
| ------ | --------- | ---- | -------------------- |
| `GET`  | `/health` | No   | Server health status |

### Authentication

| Method | Path                 | Auth | Description                         |
| ------ | -------------------- | ---- | ----------------------------------- |
| `POST` | `/api/user/register` | No   | Register a new user                 |
| `POST` | `/api/user/login`    | No   | Authenticate and receive JWT cookie |
| `POST` | `/api/user/logout`   | No   | Clear JWT cookie                    |

### Users (Protected)

| Method   | Path                        | Admin | Description                                                        |
| -------- | --------------------------- | ----- | ------------------------------------------------------------------ |
| `GET`    | `/api/user/get-team`        | No    | List all team members (supports `?search=`)                        |
| `GET`    | `/api/user/notifications`   | No    | Get unread notifications for current user                          |
| `GET`    | `/api/user/task-status`     | No    | Get all users with their task statuses                             |
| `PUT`    | `/api/user/profile`         | No    | Update user profile (name, title, role)                            |
| `PUT`    | `/api/user/read-noti`       | No    | Mark notification(s) as read (`?isReadType=all` or `?id=<notiId>`) |
| `PUT`    | `/api/user/change-password` | No    | Change current user password                                       |
| `PUT`    | `/api/user/:id`             | Yes   | Activate or deactivate a user account                              |
| `DELETE` | `/api/user/:id`             | Yes   | Permanently delete a user                                          |

### Tasks (Protected)

| Method   | Path                                   | Admin | Description                                                                    |
| -------- | -------------------------------------- | ----- | ------------------------------------------------------------------------------ |
| `GET`    | `/api/task/dashboard`                  | No    | Dashboard statistics (totals, grouped by stage, graph data, recent tasks)      |
| `GET`    | `/api/task`                            | No    | List tasks with filters (`?stage=`, `?isTrashed=`, `?search=`)                 |
| `GET`    | `/api/task/:id`                        | No    | Get single task with populated team and activity authors                       |
| `POST`   | `/api/task/create`                     | Yes   | Create a new task with team assignment and notification                        |
| `POST`   | `/api/task/duplicate/:id`              | Yes   | Duplicate an existing task                                                     |
| `POST`   | `/api/task/activity/:id`               | No    | Post an activity/comment on a task                                             |
| `PUT`    | `/api/task/create-subtask/:id`         | No    | Add a subtask to a task                                                        |
| `PUT`    | `/api/task/update/:id`                 | Yes   | Update task fields (title, date, priority, stage, team, etc.)                  |
| `PUT`    | `/api/task/change-stage/:id`           | No    | Move task to a different stage (todo / in progress / completed)                |
| `PUT`    | `/api/task/:taskId/subtask/:subTaskId` | No    | Toggle subtask completion status                                               |
| `PUT`    | `/api/task/trash/:id`                  | Yes   | Soft-delete (move to trash)                                                    |
| `DELETE` | `/api/task/delete-restore/:id?`        | Yes   | Delete or restore tasks (`?actionType=delete\|deleteAll\|restore\|restoreAll`) |

<p align="right"><a href="#top">back to top</a></p>

---

## Usage Examples

### Start the Server

```bash
# Development (with auto-reload)
cd server && npm run dev

# Production
cd server && npm start
```

### Run Tests

```bash
# Server — Jest + Supertest (uses in-memory MongoDB)
cd server && npm test

# Server — with HTML report
cd server && npm run test:report

# Client — Vitest
cd client && npm test

# Client — with coverage
cd client && npm run coverage
```

### Seed the Database

```bash
# Idempotent seed (skips if data exists)
cd server && npm run seed

# Force reseed (wipes all data first)
cd server && npm run seed:fresh
```

### Make an API Request

```bash
# Login and save cookie
curl -X POST http://localhost:5001/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@taskflow.com","password":"Admin@123"}' \
  -c cookies.txt

# List all tasks (authenticated)
curl http://localhost:5001/api/task \
  -b cookies.txt

# Create a task (admin only)
curl -X POST http://localhost:5001/api/task/create \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Write unit tests for auth module",
    "priority": "high",
    "stage": "todo",
    "date": "2026-04-15",
    "team": ["<user_id_1>", "<user_id_2>"]
  }'

# Dashboard stats
curl http://localhost:5001/api/task/dashboard -b cookies.txt
```

<p align="right"><a href="#top">back to top</a></p>

---

## Deployment

### Docker Compose (Local / VPS)

The project ships with a `docker-compose.yml` that orchestrates three services:

| Service   | Container    | Port      | Description                         |
| --------- | ------------ | --------- | ----------------------------------- |
| `mongodb` | `tm_mongodb` | 27017     | MongoDB 7.0 with authentication     |
| `server`  | `tm_server`  | 5001→5000 | Express API (auto-seeds on startup) |
| `client`  | `tm_client`  | 3000      | Vite dev server with hot-reload     |

```bash
# Start all services
docker-compose up --build

# Start in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f server

# Stop and remove containers
docker-compose down

# Stop and remove containers + database volume
docker-compose down -v
```

### Production Deployment

The [live demo](#live-demo) above runs on this exact zero-cost stack:

| Tier         | Service                                                   | Notes                                                                                                                                                                                                                                                 |
| ------------ | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | [Vercel](https://vercel.com) (free Hobby tier)            | Root directory `client`, build command `npm run build`, output `dist`. `client/vercel.json` adds a SPA fallback rewrite so client-side routes (`react-router-dom`) don't 404 on refresh.                                                              |
| **Backend**  | [Render](https://render.com) (free Web Service)           | Root directory `server`, build command `npm install`, start command `npm start`. `npm start` runs the seeder before booting the server (idempotent — safe on every restart) so the database is populated without relying on Docker's `entrypoint.sh`. |
| **Database** | [MongoDB Atlas](https://cloud.mongodb.com) (M0 free tier) | Network access set to allow all IPs (`0.0.0.0/0`), since Render's free-tier egress IPs aren't static.                                                                                                                                                 |

To deploy your own copy, replicate this exactly:

1. **Frontend** — Import the repo into Vercel with Root Directory `client`. Set `VITE_API_URL` to your backend's URL.
2. **Backend** — Create a Render Web Service with Root Directory `server`, build command `npm install`, start command `npm start`. Set `MONGODB_URI`, `JWT_SECRET`, `CLIENT_ORIGIN` (your Vercel URL), and `NODE_ENV=production`.
3. **Database** — Create a free M0 cluster on MongoDB Atlas, add a database user, and allow network access from anywhere.

If you'd rather self-host on a VPS or another platform, Railway, Fly.io, and Docker Compose on any host all work too — the environment variables are the same regardless of host.

**Production environment checklist:**

- [ ] Generate a strong `JWT_SECRET` (64+ chars)
- [ ] Set `NODE_ENV=production` (enforces `secure: true` cookies and hides stack traces)
- [ ] Configure `CLIENT_ORIGIN` to your deployed frontend URL exactly (no trailing slash) — a mismatch here causes CORS-rejected logins
- [ ] Use MongoDB Atlas instead of local MongoDB
- [ ] Enable HTTPS for both frontend and API (automatic on Vercel/Render)
- [ ] If deploying to a native Node host (Render, Railway) rather than Docker, confirm your start command actually runs the seeder — `entrypoint.sh` only executes inside the Docker container

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for local setup, test commands, and PR expectations.

## Migration Log

Pre-release hardening changes (security headers, env-driven CORS, CI, `.env.example` files, dead code removal) are documented in [MIGRATION_LOG.md](MIGRATION_LOG.md).

## License

ISC — see [LICENSE](LICENSE).

## Contact

**RAHUL KP KURUP**

<p align="right"><a href="#top">back to top</a></p>
