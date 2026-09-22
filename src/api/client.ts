import type { Status, Task } from '../types'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/$/, '')
const TOKEN_KEY = 'taskflow-token'

export interface AuthUser { id: number; name: string; email: string }
interface ApiEnvelope<T> { data: T }

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: 'Request failed' })) as { message?: string }
    throw new Error(body.message || `Request failed with status ${response.status}`)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const authApi = {
  register: (input: { name: string; email: string; password: string }) => request<{ token: string; user: AuthUser }>('/auth/register', { method: 'POST', body: JSON.stringify(input) }),
  login: (input: { email: string; password: string }) => request<{ token: string; user: AuthUser }>('/auth/login', { method: 'POST', body: JSON.stringify(input) }),
  me: () => request<{ user: AuthUser }>('/auth/me'),
}

function toPayload(task: Partial<Task>) {
  return {
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    priority: task.priority,
    category: task.category,
    status: task.status,
    subtasks: task.subtasks?.map((subtask) => ({ title: subtask.title, completed: subtask.completed })),
  }
}

export const taskApi = {
  list: () => request<{ tasks: Task[] }>('/tasks'),
  create: (task: Omit<Task, 'id' | 'createdAt'>) => request<{ task: Task }>('/tasks', { method: 'POST', body: JSON.stringify(toPayload(task)) }),
  update: (id: string, updates: Partial<Task>) => request<{ task: Task }>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(toPayload(updates)) }),
  remove: (id: string) => request<void>(`/tasks/${id}`, { method: 'DELETE' }),
  status: (id: string, status: Status) => request<{ task: Task }>(`/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
}

export const categoryApi = {
  list: () => request<{ categories: Array<{ id: number; name: string; color: string }> }>('/categories'),
}

export { API_URL, TOKEN_KEY }
