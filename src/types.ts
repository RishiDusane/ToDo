export type Priority = 'low' | 'medium' | 'high'
export type Status = 'todo' | 'progress' | 'done'
export type ViewMode = 'list' | 'board' | 'calendar'

export interface Subtask {
  id: string
  title: string
  completed: boolean
}

export interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  priority: Priority
  category: string
  status: Status
  subtasks: Subtask[]
  createdAt: string
  completedAt?: string
}

export interface TaskFilters {
  search: string
  priority: Priority | 'all'
  status: Status | 'all'
  category: string
  overdue: boolean
  sort: 'dueDate' | 'priority' | 'createdAt'
}
