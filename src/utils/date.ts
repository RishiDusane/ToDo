import { format, isToday, isTomorrow, isThisWeek, isValid, parseISO, startOfDay } from 'date-fns'
import type { Task } from '../types'

export function toDate(value: string): Date | null {
  if (!value) return null
  const date = parseISO(value)
  return isValid(date) ? date : null
}

export function formatDueDate(value: string): string {
  const date = toDate(value)
  if (!date) return 'No date'
  if (isToday(date)) return `Today, ${format(date, 'h:mm a')}`
  if (isTomorrow(date)) return `Tomorrow, ${format(date, 'h:mm a')}`
  return format(date, 'EEE, MMM d, h:mm a')
}

export function dueGroup(task: Task): string {
  const date = toDate(task.dueDate)
  if (!date) return 'No Date'
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  if (isThisWeek(date, { weekStartsOn: 1 })) return 'This Week'
  return 'Later'
}

export function isOverdue(task: Task): boolean {
  const date = toDate(task.dueDate)
  return Boolean(date && startOfDay(date) < startOfDay(new Date()) && task.status !== 'done')
}

export function toInputDate(value: string): string {
  const date = toDate(value)
  return date ? format(date, "yyyy-MM-dd'T'HH:mm") : ''
}
