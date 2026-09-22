# TaskFlow Planner

TaskFlow is a full-stack Todo Task Planner for an academic project. The React interface keeps the calm list, Kanban, and calendar workflows from the earlier version, while an Express API and MySQL database now provide authenticated, durable persistence.

## Architecture

```text
React + Vite + TypeScript
        |
        | Bearer JWT / JSON REST
        v
Node.js + Express + validation middleware
        |
        | Sequelize ORM + migrations
        v
MySQL 8 (Docker Compose volume)
```

The frontend is in the repository root. The backend is in `server/`. Users, categories, tasks, and subtasks are stored in MySQL and scoped to the authenticated user.

## Features

- Email/password registration, login, JWT session restoration, and logout
- Task CRUD with title, description, due date/time, priority, category, status, and subtasks
- List view grouped by due date
- Kanban board with drag-and-drop status updates
- Monthly calendar with priority dots
- Search, category/priority/status filters, overdue filtering, and sorting
- Completion progress and overdue highlighting
- Light/dark mode and responsive layout
- JSON export and API-backed import
- Sequelize migrations and demo seed data

## Tech Stack

- React 18, Vite, TypeScript, Tailwind CSS
- Zustand for frontend UI state and API-backed task state
- React Hook Form + Zod for task validation
- Express, TypeScript, Morgan, CORS, Zod
- Sequelize ORM with MySQL 8 and tracked migrations
- JWT sessions and bcrypt password hashing
- Framer Motion, @dnd-kit/core, date-fns, and lucide-react

## Setup

### Requirements

- Node.js 18+
- Docker Desktop with Docker Compose

### Install dependencies

From the repository root:

```bash
npm install
cd server
npm install
cd ..
```

Create the backend environment file:

```bash
copy server\\.env.example server\\.env
```

On macOS/Linux, use `cp server/.env.example server/.env` instead. The Docker Compose defaults already match the example values. For a real deployment, replace `JWT_SECRET` with a long random value.

The frontend reads `VITE_API_URL` when provided and otherwise uses `http://localhost:4000/api`.

### Start MySQL and migrate

```bash
docker compose up -d
npm run server:migrate
npm run server:seed
```

The seed creates this demo account:

- Email: `demo@taskflow.local`
- Password: `password123`

### Run development servers

Use two terminals:

```bash
npm run server:dev
npm run dev
```

Open the Vite URL printed by the frontend command, normally `http://localhost:5173`.

### Production builds

```bash
npm run build
npm run server:build
```

### Stop MySQL

```bash
docker compose down
```

The named `taskflow_mysql_data` volume keeps data across container restarts. To remove the database volume too, run `docker compose down -v`.

## API Reference

All task and category routes require `Authorization: Bearer <token>`. Auth routes return a JWT after successful registration or login.

| Method | Route | Description | Auth |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Create an account | No |
| POST | `/api/auth/login` | Log in and receive a JWT | No |
| GET | `/api/auth/me` | Restore the current session | Yes |
| GET | `/api/tasks` | List tasks with filters and sorting | Yes |
| GET | `/api/tasks/:id` | Get one owned task | Yes |
| POST | `/api/tasks` | Create a task and subtasks | Yes |
| PUT | `/api/tasks/:id` | Update a task and replace its checklist | Yes |
| DELETE | `/api/tasks/:id` | Delete a task and its subtasks | Yes |
| PATCH | `/api/tasks/:id/status` | Quick Kanban status update | Yes |
| POST | `/api/tasks/:id/subtasks` | Add a subtask | Yes |
| PUT | `/api/tasks/:id/subtasks/:subtaskId` | Update a subtask | Yes |
| DELETE | `/api/tasks/:id/subtasks/:subtaskId` | Delete a subtask | Yes |
| GET | `/api/categories` | List owned categories | Yes |
| POST | `/api/categories` | Create a category | Yes |
| PUT | `/api/categories/:id` | Rename/recolor a category | Yes |
| DELETE | `/api/categories/:id` | Delete a category | Yes |
| GET | `/health` | API health check | No |

`GET /api/tasks` accepts `status`, `priority`, `category`, `search`, and `sortBy=dueDate|priority|createdAt` query parameters.

## How the App Works

### Authentication flow

The login/register screen calls the public auth routes. The server hashes passwords with bcrypt and signs a JWT. The frontend stores the token in localStorage for this academic project, then the API client attaches it as a Bearer token on every protected request. This is simple to demonstrate, but an httpOnly secure cookie would reduce token exposure for a production deployment. `GET /api/auth/me` validates the token on refresh and restores the user.

### Task data flow

A task action starts in an existing React component such as `TaskForm`, `TaskCard`, or `KanbanBoard`. The Zustand task store calls the small `src/api/client.ts` wrapper. Express validates the request with Zod, the auth middleware identifies the user, the route checks ownership, and Sequelize writes through the model into MySQL. The response is serialized back into the frontend's stable `Task` shape. The MySQL volume means data survives API restarts.

### Schema and relationships

Users own categories and tasks. Tasks optionally belong to a category and own subtasks. Foreign keys use cascading deletes for user-to-task/category and task-to-subtask relationships; deleting a category leaves its tasks intact by setting `category_id` to null. Migrations in `server/src/database/migrations` are the source of truth for schema changes; the server never calls `sequelize.sync()`.

### Folder structure

```text
src/
  api/       Typed frontend REST client
  components/ Auth, task editor/cards, sidebar, board, calendar, loading UI
  store/     Auth and API-backed Zustand stores
  utils/     Date grouping and formatting
  types.ts   Shared frontend task types
server/
  src/config/ Database and environment setup
  src/middleware/ Auth and centralized errors
  src/models/ Sequelize models and associations
  src/routes/ Auth, task, and category REST routes
  src/database/ Reversible migrations and seeders
  src/utils/ Validation and response serializers
docker-compose.yml  MySQL 8 with a persisted named volume
```

## What Changed From the Local Version

The earlier version persisted the task collection in browser localStorage. The UI and task workflows remain familiar, but task mutations now go through authenticated REST endpoints and are persisted in MySQL. Theme and view preferences remain client-side UI concerns, while task data, categories, and subtasks are server-owned.

## Validation Checklist

1. Run Docker Compose, migrations, and the seed commands.
2. Register or log in.
3. Create a task, edit it, mark it complete, and drag it between Kanban columns.
4. Refresh the browser and confirm the task remains.
5. Restart the API process and confirm the task still remains.

## Future Improvements

- httpOnly secure cookie sessions and CSRF protection
- Automated API and component tests
- Reminders, recurring tasks, and notifications
- Production deployment configuration and database backups

## License

MIT
