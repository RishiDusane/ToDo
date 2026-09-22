# TaskFlow Planner

TaskFlow is a calm, responsive Todo Task Planner built as an academic React project. It helps turn a loose list of intentions into scheduled work with clear priorities, progress states, and checklists.

## Features

- Full task CRUD with title, description, due date/time, priority, category, status, and subtasks
- List view grouped by Today, Tomorrow, This Week, Later, and No Date
- Kanban board with drag-and-drop status changes
- Monthly calendar with priority dots
- Search, category/priority/status filters, overdue filter, and sorting
- Completion progress, overdue highlighting, and checklist progress
- Light/dark mode persisted locally
- JSON export/import for backups
- Responsive desktop and mobile layout

## Tech Stack

- **React 18 + Vite + TypeScript:** fast, typed frontend foundation
- **Tailwind CSS:** utility-first styling configuration alongside focused component CSS
- **Zustand:** small, predictable global task store with persistence middleware
- **React Hook Form + Zod:** typed form state and validation
- **date-fns:** readable date grouping and calendar calculations
- **Framer Motion:** task entry and checklist transitions
- **@dnd-kit/core:** accessible Kanban drag-and-drop primitives
- **lucide-react:** consistent interface icons
- **localStorage:** no-backend persistence for this academic project

## Screenshots

_Add screenshots here after running the app._

![Task list view](./screenshots/list-view.png)
![Kanban board view](./screenshots/kanban-view.png)

## Setup

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
npm run preview
```

## How the App Works

### Architecture and state flow

`src/main.tsx` mounts the React application. `App.tsx` owns view composition and derives filtered tasks from the Zustand store. Reusable components render the sidebar, task editor, task cards, Kanban board, and calendar. User actions call typed store methods, which update the shared task collection and cause subscribed views to re-render.

### Persistence flow

The Zustand `persist` middleware stores tasks, categories, filters, and theme under the `taskflow-storage` localStorage key. Creating, editing, completing, moving, or deleting a task updates the store; the middleware serializes the new state automatically. Export creates a JSON backup, and import validates the basic task shape before replacing the current task list.

### Filtering, sorting, and views

The list view filters by search text, priority, status, category, and overdue state, then sorts by due date, priority, or creation time. Tasks are grouped with date-fns helpers. The Kanban view reuses the same filtered collection and changes status through @dnd-kit drop targets. The calendar maps scheduled tasks to a month grid and colors each task dot by priority.

### Folder structure

```text
src/
  components/  Reusable task editor, cards, sidebar, board, and calendar
  store/       Persisted Zustand task store
  utils/       Date parsing, formatting, grouping, and overdue helpers
  types.ts     Shared TypeScript domain types
  App.tsx      Page composition and filter derivation
  main.tsx     React entry point
  index.css    Tailwind layers and application styling
```

## Future Improvements

- Backend synchronization and user authentication
- Browser reminders, notifications, and recurring tasks
- Unit tests with Vitest and React Testing Library
- Collaborative projects and shared categories
- Richer calendar interactions and keyboard drag-and-drop shortcuts

## License

MIT
