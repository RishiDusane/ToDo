import type { Category, Subtask, Task } from '../models/index.js'

export function serializeCategory(category: Category) {
  return { id: category.id, name: category.name, color: category.color }
}

export function serializeTask(task: Task & { Category?: Category; Subtasks?: Subtask[] }) {
  const date = task.dueDate
  const time = task.dueTime && task.dueTime !== '00:00:00' ? task.dueTime : ''
  const dueDate = date ? `${date}T${time || '00:00:00'}.000Z` : ''
  return {
    id: String(task.id),
    title: task.title,
    description: task.description,
    dueDate,
    priority: task.priority,
    category: task.Category?.name || 'Personal',
    categoryId: task.categoryId,
    status: task.status === 'in_progress' ? 'progress' : task.status,
    subtasks: (task.Subtasks || []).sort((a, b) => a.position - b.position).map((subtask) => ({ id: String(subtask.id), title: subtask.title, completed: subtask.isComplete })),
    createdAt: task.createdAt?.toISOString() || new Date().toISOString(),
  }
}
