import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Status, Task, TaskFilters, ViewMode } from '../types'

const starterTasks: Task[] = [
  {
    id: 'welcome-task',
    title: 'Make this planner yours',
    description: 'Try changing the status, adding a checklist, or moving this task on the board.',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    priority: 'medium',
    category: 'Personal',
    status: 'todo',
    subtasks: [
      { id: 'welcome-subtask-1', title: 'Explore the list view', completed: true },
      { id: 'welcome-subtask-2', title: 'Try the Kanban board', completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
]

interface TaskStore {
  tasks: Task[]
  categories: string[]
  filters: TaskFilters
  view: ViewMode
  theme: 'light' | 'dark'
  editingTaskId: string | null
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  setStatus: (id: string, status: Status) => void
  setFilters: (filters: Partial<TaskFilters>) => void
  setView: (view: ViewMode) => void
  setTheme: (theme: 'light' | 'dark') => void
  setEditingTaskId: (id: string | null) => void
  addCategory: (category: string) => void
  replaceTasks: (tasks: Task[]) => void
}

const defaultFilters: TaskFilters = {
  search: '',
  priority: 'all',
  status: 'all',
  category: 'all',
  overdue: false,
  sort: 'dueDate',
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: starterTasks,
      categories: ['Study', 'Assignment', 'Personal', 'Exam'],
      filters: defaultFilters,
      view: 'list',
      theme: 'light',
      editingTaskId: null,
      addTask: (task) => set((state) => ({
        tasks: [{ ...task, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...state.tasks],
        categories: task.category && !state.categories.includes(task.category)
          ? [...state.categories, task.category]
          : state.categories,
      })),
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map((task) => task.id === id ? { ...task, ...updates } : task),
        categories: updates.category && !state.categories.includes(updates.category)
          ? [...state.categories, updates.category]
          : state.categories,
      })),
      deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
      setStatus: (id, status) => set((state) => ({
        tasks: state.tasks.map((task) => task.id === id
          ? { ...task, status, completedAt: status === 'done' ? new Date().toISOString() : undefined }
          : task),
      })),
      setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
      setView: (view) => set({ view }),
      setTheme: (theme) => set({ theme }),
      setEditingTaskId: (editingTaskId) => set({ editingTaskId }),
      addCategory: (category) => set((state) => state.categories.includes(category)
        ? state
        : { categories: [...state.categories, category] }),
      replaceTasks: (tasks) => set({ tasks }),
    }),
    {
      name: 'taskflow-storage',
      partialize: (state) => ({ tasks: state.tasks, categories: state.categories, filters: state.filters, theme: state.theme }),
    },
  ),
)
