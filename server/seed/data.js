// =============================================================
// SEED DATA — TaskFlow Demo Dataset
// =============================================================
// 1 Admin + 5 Team Members + 12 Tasks + Subtasks + Activities + Notices

export const USERS = [
  {
    name: "RONI",
    email: "admin@taskflow.com",
    password: "Admin@123",
    title: "Engineering Manager",
    role: "Admin",
    isAdmin: true,
    isActive: true,
  },
  {
    name: "Sarah",
    email: "sarah@taskflow.com",
    password: "Sarah@123",
    title: "Senior Frontend Developer",
    role: "Frontend Engineer",
    isAdmin: false,
    isActive: true,
  },
  {
    name: "James Oka",
    email: "james@taskflow.com",
    password: "James@123",
    title: "Backend Developer",
    role: "Backend Engineer",
    isAdmin: false,
    isActive: true,
  },
  {
    name: "Priya Patel",
    email: "priya@taskflow.com",
    password: "Priya@123",
    title: "UI/UX Designer",
    role: "Designer",
    isAdmin: false,
    isActive: true,
  },
  {
    name: "Carlos Riva",
    email: "carlos@taskflow.com",
    password: "Carlos@123",
    title: "QA Engineer",
    role: "Quality Assurance",
    isAdmin: false,
    isActive: true,
  },
  {
    name: "Emma Wilson",
    email: "emma@taskflow.com",
    password: "Emma@123",
    title: "DevOps Engineer",
    role: "Infrastructure",
    isAdmin: false,
    isActive: false, // inactive user to test that feature
  },
];

// Task factory — receives resolved user IDs
export const getTasks = (users) => {
  const { admin, sarah, james, priya, carlos, emma } = users;

  return [
    // ─── COMPLETED TASKS ──────────────────────────────────────
    {
      title: "Design system setup & component library",
      description:
        "Establish the base design tokens (colors, typography, spacing), configure Tailwind, and build the initial reusable component library including Button, Input, Modal, and Card.",
      priority: "high",
      stage: "completed",
      date: daysAgo(20),
      team: [sarah, priya],
      links: ["https://tailwindcss.com/docs", "https://storybook.js.org"],
      assets: [],
      subTasks: [
        {
          title: "Configure Tailwind with custom design tokens",
          date: daysAgo(20),
          tag: "frontend",
          isCompleted: true,
        },
        {
          title: "Build Button component with variants",
          date: daysAgo(18),
          tag: "component",
          isCompleted: true,
        },
        {
          title: "Build Input & Textbox components",
          date: daysAgo(17),
          tag: "component",
          isCompleted: true,
        },
        {
          title: "Build Modal & ConfirmationDialog",
          date: daysAgo(15),
          tag: "component",
          isCompleted: true,
        },
        {
          title: "Document all components in Storybook",
          date: daysAgo(14),
          tag: "docs",
          isCompleted: true,
        },
      ],
      activities: [
        {
          type: "assigned",
          activity:
            "Design system task assigned. Sarah will lead implementation, Priya to provide design specs.",
          by: admin,
          date: daysAgo(20),
        },
        {
          type: "started",
          activity: "Kicked off Tailwind configuration and token setup.",
          by: sarah,
          date: daysAgo(19),
        },
        {
          type: "in progress",
          activity:
            "All base components built. Moving to Storybook documentation.",
          by: sarah,
          date: daysAgo(15),
        },
        {
          type: "completed",
          activity:
            "Design system fully documented and reviewed. Ready for use across the app.",
          by: sarah,
          date: daysAgo(14),
        },
      ],
    },

    {
      title: "User authentication — JWT + cookie sessions",
      description:
        "Implement secure login and registration with bcrypt password hashing, JWT tokens stored in HttpOnly cookies, and protected route middleware.",
      priority: "high",
      stage: "completed",
      date: daysAgo(18),
      team: [james, admin],
      links: ["https://jwt.io", "https://github.com/auth0/node-jsonwebtoken"],
      assets: [],
      subTasks: [
        {
          title: "User model with bcrypt pre-save hook",
          date: daysAgo(18),
          tag: "backend",
          isCompleted: true,
        },
        {
          title: "Login & register API endpoints",
          date: daysAgo(17),
          tag: "api",
          isCompleted: true,
        },
        {
          title: "JWT creation and cookie storage utility",
          date: daysAgo(16),
          tag: "security",
          isCompleted: true,
        },
        {
          title: "protectRoute and isAdminRoute middleware",
          date: daysAgo(15),
          tag: "middleware",
          isCompleted: true,
        },
        {
          title: "Frontend Redux auth slice + API integration",
          date: daysAgo(14),
          tag: "frontend",
          isCompleted: true,
        },
      ],
      activities: [
        {
          type: "assigned",
          activity: "James to handle all backend auth. Alex will review.",
          by: admin,
          date: daysAgo(18),
        },
        {
          type: "in progress",
          activity: "Backend auth endpoints done. Testing with Postman.",
          by: james,
          date: daysAgo(16),
        },
        {
          type: "commented",
          activity:
            "Make sure sameSite cookie is set to lax in development to avoid CORS issues with Vite proxy.",
          by: admin,
          date: daysAgo(15),
        },
        {
          type: "completed",
          activity:
            "Auth fully working end-to-end. Login, logout, token refresh all tested.",
          by: james,
          date: daysAgo(14),
        },
      ],
    },

    {
      title: "MongoDB schema design & model validation",
      description:
        "Design and implement Mongoose schemas for User, Task, and Notice models with proper validation, indexes, and population paths.",
      priority: "medium",
      stage: "completed",
      date: daysAgo(22),
      team: [james],
      links: ["https://mongoosejs.com/docs/guide.html"],
      assets: [],
      subTasks: [
        {
          title: "User schema with isAdmin and isActive flags",
          date: daysAgo(22),
          tag: "database",
          isCompleted: true,
        },
        {
          title: "Task schema with activities and subTasks arrays",
          date: daysAgo(21),
          tag: "database",
          isCompleted: true,
        },
        {
          title: "Notice/Notification schema with isRead array",
          date: daysAgo(20),
          tag: "database",
          isCompleted: true,
        },
      ],
      activities: [
        {
          type: "assigned",
          activity: "James to design all Mongoose schemas.",
          by: admin,
          date: daysAgo(22),
        },
        {
          type: "completed",
          activity:
            "All three schemas implemented with validation and population paths.",
          by: james,
          date: daysAgo(20),
        },
      ],
    },

    // ─── IN PROGRESS TASKS ────────────────────────────────────
    {
      title: "Kanban board with drag & drop support",
      description:
        "Build the Kanban board view with three columns (Todo, In Progress, Completed). Add drag-and-drop to move cards between columns using react-beautiful-dnd or @dnd-kit/core.",
      priority: "high",
      stage: "in progress",
      date: daysFromNow(5),
      team: [sarah, priya],
      links: [
        "https://dndkit.com",
        "https://github.com/atlassian/react-beautiful-dnd",
      ],
      assets: [],
      subTasks: [
        {
          title: "Static 3-column board layout",
          date: daysAgo(3),
          tag: "frontend",
          isCompleted: true,
        },
        {
          title: "Task card component with priority & team avatars",
          date: daysAgo(2),
          tag: "component",
          isCompleted: true,
        },
        {
          title: "Integrate @dnd-kit/core for drag and drop",
          date: daysFromNow(2),
          tag: "feature",
          isCompleted: false,
        },
        {
          title: "Optimistic UI update on drop + API sync",
          date: daysFromNow(4),
          tag: "api",
          isCompleted: false,
        },
        {
          title: "Mobile touch support testing",
          date: daysFromNow(5),
          tag: "testing",
          isCompleted: false,
        },
      ],
      activities: [
        {
          type: "assigned",
          activity:
            "Sarah leading frontend, Priya to deliver card design specs.",
          by: admin,
          date: daysAgo(5),
        },
        {
          type: "started",
          activity: "Started with static column layout and task card component.",
          by: sarah,
          date: daysAgo(4),
        },
        {
          type: "in progress",
          activity:
            "Static board done. Task cards look great. Starting DnD integration now.",
          by: sarah,
          date: daysAgo(1),
        },
        {
          type: "commented",
          activity:
            "Consider @dnd-kit over react-beautiful-dnd — it has better React 18 support and no findDOMNode warnings.",
          by: james,
          date: daysAgo(1),
        },
      ],
    },

    {
      title: "REST API — Task CRUD endpoints",
      description:
        "Implement all task-related API routes: create, read (list + single), update, update stage, trash, restore, delete, duplicate, add subtask, post activity.",
      priority: "high",
      stage: "in progress",
      date: daysFromNow(3),
      team: [james, admin],
      links: [],
      assets: [],
      subTasks: [
        {
          title: "GET /api/task — list with filters (stage, isTrashed, search)",
          date: daysAgo(4),
          tag: "api",
          isCompleted: true,
        },
        {
          title: "POST /api/task/create — with team notification",
          date: daysAgo(3),
          tag: "api",
          isCompleted: true,
        },
        {
          title: "PUT /api/task/update/:id",
          date: daysAgo(2),
          tag: "api",
          isCompleted: true,
        },
        {
          title: "PUT /api/task/change-stage/:id",
          date: daysAgo(1),
          tag: "api",
          isCompleted: true,
        },
        {
          title: "PUT /api/task/trash/:id + DELETE restore endpoint",
          date: daysFromNow(1),
          tag: "api",
          isCompleted: false,
        },
        {
          title: "POST /api/task/duplicate/:id",
          date: daysFromNow(2),
          tag: "api",
          isCompleted: false,
        },
        {
          title: "POST /api/task/activity/:id",
          date: daysFromNow(3),
          tag: "api",
          isCompleted: false,
        },
      ],
      activities: [
        {
          type: "assigned",
          activity: "James to build all task endpoints. Alex reviewing.",
          by: admin,
          date: daysAgo(5),
        },
        {
          type: "in progress",
          activity: "Core CRUD done. Working on trash/restore and duplicate.",
          by: james,
          date: daysAgo(1),
        },
        {
          type: "bug",
          activity:
            "Bug: duplicateTask was referencing undefined `team` variable. Fixed to use `task.team`.",
          by: james,
          date: daysAgo(1),
        },
      ],
    },

    {
      title: "Dashboard analytics & statistics endpoint",
      description:
        "Build the /api/task/dashboard endpoint returning total tasks, grouped by stage, grouped by priority (for chart), last 10 tasks, and active users.",
      priority: "medium",
      stage: "in progress",
      date: daysFromNow(4),
      team: [james, sarah],
      links: ["https://recharts.org/en-US"],
      assets: [],
      subTasks: [
        {
          title: "Backend /dashboard endpoint with aggregation",
          date: daysAgo(2),
          tag: "backend",
          isCompleted: true,
        },
        {
          title: "Frontend RTK Query getDashboardStats hook",
          date: daysAgo(1),
          tag: "frontend",
          isCompleted: true,
        },
        {
          title: "Recharts BarChart for priority distribution",
          date: daysFromNow(1),
          tag: "chart",
          isCompleted: false,
        },
        {
          title: "Stat cards with real-time counts",
          date: daysFromNow(2),
          tag: "ui",
          isCompleted: false,
        },
        {
          title: "Recent tasks table + team members list",
          date: daysFromNow(3),
          tag: "ui",
          isCompleted: false,
        },
      ],
      activities: [
        {
          type: "started",
          activity: "Backend aggregation query drafted.",
          by: james,
          date: daysAgo(3),
        },
        {
          type: "in progress",
          activity:
            "API and frontend hooks working. Now wiring up the Recharts component.",
          by: sarah,
          date: daysAgo(1),
        },
      ],
    },

    {
      title: "Docker containerisation & compose setup",
      description:
        "Containerize the client, server, and MongoDB using Docker. Set up docker-compose with health checks, networking, volume mounts for hot reload, and environment variable configuration.",
      priority: "high",
      stage: "in progress",
      date: daysFromNow(2),
      team: [emma, admin],
      links: [
        "https://docs.docker.com/compose",
        "https://hub.docker.com/_/mongo",
      ],
      assets: [],
      subTasks: [
        {
          title: "Dockerfile for server (Node 20 Alpine)",
          date: daysAgo(3),
          tag: "devops",
          isCompleted: true,
        },
        {
          title: "Dockerfile for client (Vite + hot reload)",
          date: daysAgo(3),
          tag: "devops",
          isCompleted: true,
        },
        {
          title: "docker-compose with MongoDB health check",
          date: daysAgo(2),
          tag: "devops",
          isCompleted: true,
        },
        {
          title: "Volume mounts for live code reload",
          date: daysAgo(1),
          tag: "devops",
          isCompleted: true,
        },
        {
          title: "Seed data pipeline on container startup",
          date: daysFromNow(1),
          tag: "devops",
          isCompleted: false,
        },
        {
          title: "CI/CD pipeline with GitHub Actions",
          date: daysFromNow(2),
          tag: "ci-cd",
          isCompleted: false,
        },
      ],
      activities: [
        {
          type: "assigned",
          activity: "Emma leads Docker setup, Alex reviewing configs.",
          by: admin,
          date: daysAgo(4),
        },
        {
          type: "in progress",
          activity:
            "Dockerfiles and compose working. All 3 services start cleanly.",
          by: emma,
          date: daysAgo(1),
        },
        {
          type: "commented",
          activity:
            "Remove the obsolete `version: 3.9` from docker-compose.yml — newer Docker CLI ignores it but shows a warning.",
          by: admin,
          date: daysAgo(1),
        },
      ],
    },

    // ─── TODO TASKS ───────────────────────────────────────────
    {
      title: "End-to-end testing with Playwright",
      description:
        "Write Playwright E2E tests covering the critical user journeys: login, create task, update stage, add subtask, post activity, trash, restore, and logout.",
      priority: "medium",
      stage: "todo",
      date: daysFromNow(10),
      team: [carlos],
      links: ["https://playwright.dev/docs/intro"],
      assets: [],
      subTasks: [
        {
          title: "Install Playwright and configure project",
          date: daysFromNow(7),
          tag: "testing",
          isCompleted: false,
        },
        {
          title: "Auth flow test (login + logout)",
          date: daysFromNow(8),
          tag: "testing",
          isCompleted: false,
        },
        {
          title: "Full task CRUD E2E test",
          date: daysFromNow(9),
          tag: "testing",
          isCompleted: false,
        },
        {
          title: "Role-based access E2E test",
          date: daysFromNow(10),
          tag: "testing",
          isCompleted: false,
        },
      ],
      activities: [
        {
          type: "assigned",
          activity:
            "Carlos to handle all E2E testing with Playwright. Start after API endpoints are stable.",
          by: admin,
          date: daysAgo(1),
        },
      ],
    },

    {
      title: "Real-time notifications with Socket.IO",
      description:
        "Upgrade the notification system from polling to real-time using Socket.IO. Emit events when tasks are assigned, updated, or commented on.",
      priority: "medium",
      stage: "todo",
      date: daysFromNow(14),
      team: [james, sarah],
      links: ["https://socket.io/docs/v4"],
      assets: [],
      subTasks: [
        {
          title: "Install and configure Socket.IO on Express server",
          date: daysFromNow(11),
          tag: "backend",
          isCompleted: false,
        },
        {
          title: "Socket.IO client setup in React",
          date: daysFromNow(12),
          tag: "frontend",
          isCompleted: false,
        },
        {
          title: "Emit task:assigned event on task creation",
          date: daysFromNow(13),
          tag: "feature",
          isCompleted: false,
        },
        {
          title: "Toast notification on incoming socket event",
          date: daysFromNow(14),
          tag: "ui",
          isCompleted: false,
        },
      ],
      activities: [
        {
          type: "assigned",
          activity:
            "Planned for next sprint. James backend, Sarah frontend integration.",
          by: admin,
          date: daysAgo(1),
        },
      ],
    },

    {
      title: "File uploads with Firebase Storage",
      description:
        "Allow users to attach files and images to tasks using Firebase Storage. Show upload progress, preview images, and store download URLs in task assets array.",
      priority: "low",
      stage: "todo",
      date: daysFromNow(18),
      team: [sarah, priya],
      links: [
        "https://firebase.google.com/docs/storage",
        "https://firebase.google.com/docs/storage/web/upload-files",
      ],
      assets: [],
      subTasks: [
        {
          title: "Firebase project setup and config",
          date: daysFromNow(15),
          tag: "setup",
          isCompleted: false,
        },
        {
          title: "File upload component with progress bar",
          date: daysFromNow(16),
          tag: "component",
          isCompleted: false,
        },
        {
          title: "Image preview and file list in task detail",
          date: daysFromNow(17),
          tag: "ui",
          isCompleted: false,
        },
        {
          title: "Delete file from Storage on task delete",
          date: daysFromNow(18),
          tag: "backend",
          isCompleted: false,
        },
      ],
      activities: [
        {
          type: "assigned",
          activity:
            "Low priority — schedule for after Socket.IO feature is shipped.",
          by: admin,
          date: daysAgo(1),
        },
      ],
    },

    {
      title: "Mobile responsive UI audit & fixes",
      description:
        "Audit all pages on mobile viewport (375px). Fix sidebar overlay, task card layout, modal sizing, table horizontal scroll, and touch targets.",
      priority: "normal",
      stage: "todo",
      date: daysFromNow(8),
      team: [priya, sarah],
      links: [],
      assets: [],
      subTasks: [
        {
          title: "Audit all pages at 375px viewport",
          date: daysFromNow(6),
          tag: "ux",
          isCompleted: false,
        },
        {
          title: "Fix mobile sidebar transition",
          date: daysFromNow(7),
          tag: "frontend",
          isCompleted: false,
        },
        {
          title: "Fix table overflow on Tasks and Team pages",
          date: daysFromNow(7),
          tag: "css",
          isCompleted: false,
        },
        {
          title: "Ensure all touch targets are 44px minimum",
          date: daysFromNow(8),
          tag: "a11y",
          isCompleted: false,
        },
      ],
      activities: [
        {
          type: "assigned",
          activity: "Priya to audit, Sarah to implement fixes.",
          by: admin,
          date: daysAgo(1),
        },
      ],
    },

    {
      title: "Performance optimisation & code splitting",
      description:
        "Implement React lazy loading for route-level code splitting, memoize expensive selectors with reselect, add loading skeletons, and audit bundle size with vite-bundle-visualizer.",
      priority: "low",
      stage: "todo",
      date: daysFromNow(21),
      team: [sarah],
      links: [
        "https://react.dev/reference/react/lazy",
        "https://github.com/btd/rollup-plugin-visualizer",
      ],
      assets: [],
      subTasks: [
        {
          title: "Lazy-load all route-level page components",
          date: daysFromNow(18),
          tag: "performance",
          isCompleted: false,
        },
        {
          title: "Add Suspense fallback with skeleton screens",
          date: daysFromNow(19),
          tag: "ux",
          isCompleted: false,
        },
        {
          title: "Bundle analysis with visualizer plugin",
          date: daysFromNow(20),
          tag: "tooling",
          isCompleted: false,
        },
        {
          title: "Memoize heavy dashboard selectors",
          date: daysFromNow(21),
          tag: "performance",
          isCompleted: false,
        },
      ],
      activities: [
        {
          type: "assigned",
          activity:
            "Sarah to handle this solo in the backlog sprint. Low urgency.",
          by: admin,
          date: daysAgo(1),
        },
      ],
    },
  ];
};

// ─── DATE HELPERS ─────────────────────────────────────────────
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}
