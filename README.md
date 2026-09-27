<div align="center">

# 📋 TaskFlow Planner

**A full-stack task management app with authenticated, persistent multi-user data.**

List view · Kanban board · Calendar — backed by a real REST API and MySQL database.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-black?logo=express)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#license)

</div>

---

## Why this project

Most todo-app clones stop at the frontend and a `localStorage` array. TaskFlow doesn't: it's a complete client-server application with real authentication, a normalized relational schema, tracked database migrations, and a documented REST API — the same architectural shape you'd find in a small production service.

It started as a purely client-side React app and was deliberately re-architected into a full stack system, which meant working through problems like token-based auth, ownership checks on every route, cascading deletes, and reversible migrations instead of `sequelize.sync()` shortcuts.

## ✨ Features

| | |
|---|---|
| 🔐 **Auth** | Email/password registration & login, JWT sessions, bcrypt password hashing |
| ✅ **Tasks** | Full CRUD — title, description, due date/time, priority, category, status, subtasks |
| 📋 **List view** | Tasks grouped by due date |
| 🗂️ **Kanban board** | Drag-and-drop status updates |
| 📅 **Calendar** | Monthly view with priority indicators |
| 🔎 **Filtering** | Search, category/priority/status filters, overdue detection, multi-field sorting |
| 📊 **Progress** | Completion tracking and overdue highlighting |
| 🌗 **Theming** | Light/dark mode, fully responsive layout |
| 📤 **Data portability** | JSON export and API-backed import |

## 🖼️ Screenshots

<table>
<tr>
<td align="center"><b>Sign Up</b></td>
<td align="center"><b>Login</b></td>
</tr>
<tr>
<td><img src="https://github.com/user-attachments/assets/0800a9d6-0705-4187-b363-3c8a158a41ad" width="400"/></td>
<td><img src="https://github.com/user-attachments/assets/de6b7447-7db1-4a82-9310-e82b0b83e43d" width="400"/></td>
</tr>
<tr>
<td align="center"><b>Homepage</b></td>
<td align="center"><b>Add Task</b></td>
</tr>
<tr>
<td><img src="https://github.com/user-attachments/assets/e2d06b27-89f3-4a62-b8e2-9f4c6bdb48f2" width="400"/></td>
<td><img src="https://github.com/user-attachments/assets/31b75935-bfe8-4705-beba-46d6fed11c32" width="400"/></td>
</tr>
<tr>
<td align="center"><b>Kanban Board</b></td>
<td align="center"><b>Calendar</b></td>
</tr>
<tr>
<td><img src="https://github.com/user-attachments/assets/063c070b-329e-43f5-b331-7cd130f933e8" width="400"/></td>
<td><img src="https://github.com/user-attachments/assets/f333d30e-ff67-4a16-97ed-ea0a18e7e672" width="400"/></td>
</tr>
<tr>
<td align="center" colspan="2"><b>Dark Mode</b></td>
</tr>
<tr>
<td colspan="2" align="center"><img src="https://github.com/user-attachments/assets/df38fd13-2ffd-4964-9f3c-5ad098e4bff3" width="500"/></td>
</tr>
</table>

## 🏗️ Architecture

```
React + Vite + JavaScript
        │
        │  Bearer JWT / JSON REST
        ▼
Node.js + Express + validation middleware
        │
        │  Sequelize ORM + migrations
        ▼
MySQL 8 (Docker Compose volume)
```

The frontend lives at the repository root; the backend lives in `server/`. Users, categories, tasks, and subtasks are stored in MySQL and scoped to the authenticated user — every query is filtered by ownership, not just by the frontend hiding data.

## 🛠️ Tech Stack

**Frontend** — React 18, Vite, Tailwind CSS, Zustand, React Hook Form + Zod, Framer Motion, @dnd-kit/core, date-fns, lucide-react

**Backend** — Node.js, Express, Morgan, CORS, Zod, Sequelize ORM, JWT, bcrypt

**Database & Infra** — MySQL 8, Docker Compose, tracked Sequelize migrations & seeders

## 🚀 Getting Started

### Requirements
- Node.js 18+
- MySQL 8 (local install or Docker Compose)

### 1. Install dependencies
```bash
npm install
npm --prefix server install
```

### 2. Configure environment
```bash
cp server/.env.example server/.env   # Windows: copy server\.env.example server\.env
```
Edit `server/.env`:
```env
PORT=4000
FRONTEND_ORIGIN=http://localhost:5173
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=taskflow
JWT_SECRET=development-taskflow-secret-super-safe-key-32chars
```

### 3. Create the database & run migrations
**Local MySQL:**
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS taskflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
npm run server:migrate
npm run server:seed
```
**Or with Docker Compose:**
```bash
docker compose up -d
npm run server:migrate
npm run server:seed
```

Seed creates a demo account — `demo@taskflow.local` / `password123`.

### 4. Run it
```bash
npm start
# or, in separate terminals:
npm run server:dev
npm run dev
```
Open the printed Vite URL (typically `http://localhost:5173`).

### Production build
```bash
npm run build
npm run server:build
```

## 📡 API Reference

All task/category routes require `Authorization: Bearer <token>`.

| Method | Route | Description | Auth |
|---|---|---|:---:|
| POST | `/api/auth/register` | Create an account | — |
| POST | `/api/auth/login` | Log in, receive a JWT | — |
| GET | `/api/auth/me` | Restore current session | ✅ |
| GET | `/api/tasks` | List tasks (filters + sorting) | ✅ |
| GET | `/api/tasks/:id` | Get one owned task | ✅ |
| POST | `/api/tasks` | Create a task + subtasks | ✅ |
| PUT | `/api/tasks/:id` | Update task, replace checklist | ✅ |
| DELETE | `/api/tasks/:id` | Delete task + subtasks | ✅ |
| PATCH | `/api/tasks/:id/status` | Quick Kanban status update | ✅ |
| POST | `/api/tasks/:id/subtasks` | Add a subtask | ✅ |
| PUT | `/api/tasks/:id/subtasks/:subtaskId` | Update a subtask | ✅ |
| DELETE | `/api/tasks/:id/subtasks/:subtaskId` | Delete a subtask | ✅ |
| GET | `/api/categories` | List owned categories | ✅ |
| POST | `/api/categories` | Create a category | ✅ |
| PUT | `/api/categories/:id` | Rename/recolor a category | ✅ |
| DELETE | `/api/categories/:id` | Delete a category | ✅ |
| GET | `/health` | API health check | — |

`GET /api/tasks` supports `status`, `priority`, `category`, `search`, and `sortBy=dueDate|priority|createdAt`.

## 🔍 How It Works

**Authentication flow** — The login/register screen hits the public auth routes. The server hashes passwords with bcrypt and signs a JWT. The frontend attaches it as a Bearer token on every protected request, and `GET /api/auth/me` validates and restores the session on refresh. *(Note: token is currently stored in localStorage for demo simplicity — see Roadmap for the production-grade alternative.)*

**Task data flow** — A UI action in `TaskForm`, `TaskCard`, or `KanbanBoard` calls the Zustand task store, which goes through `src/api/client.js`. Express validates with Zod, auth middleware identifies the user, the route enforces ownership, and Sequelize writes through the model into MySQL. Data survives both browser refreshes and API restarts.

**Schema & relationships** — Users own categories and tasks; tasks optionally belong to a category and own subtasks. Foreign keys cascade on delete for user→task/category and task→subtask; deleting a category nulls out `category_id` on its tasks rather than deleting them. All schema changes live in `server/src/database/migrations` — the server never calls `sequelize.sync()`.

## 📁 Project Structure

```
src/
├─ api/          # Frontend REST client
├─ components/   # Auth, task editor/cards, sidebar, board, calendar, loading UI
├─ store/        # Auth & API-backed Zustand stores
└─ utils/        # Date grouping and formatting

server/
├─ src/config/       # Database & environment setup
├─ src/middleware/   # Auth and centralized error handling
├─ src/models/       # Sequelize models & associations
├─ src/routes/       # Auth, task, category REST routes
├─ src/database/     # Reversible migrations & seeders
└─ src/utils/        # Validation and response serializers

docker-compose.yml    # MySQL 8 with a persisted named volume
```

## 🗺️ Roadmap

- [ ] httpOnly secure cookie sessions + CSRF protection
- [ ] Automated API and component tests
- [ ] Reminders, recurring tasks, and notifications
- [ ] Production deployment config and database backups

## ✅ Validation Checklist

1. Run Docker Compose, migrations, and the seed command
2. Register or log in
3. Create a task, edit it, mark it complete, drag it across Kanban columns
4. Refresh the browser → task persists
5. Restart the API process → task still persists

## 📄 License

MIT

---

<div align="center">

Built by <a href="https://github.com/RishiDusane">Rishi Dusane</a> — open to feedback, issues, and PRs.

</div>
