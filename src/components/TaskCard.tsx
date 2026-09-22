import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, Check, Circle, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTaskStore } from '../store/useTaskStore'
import { formatDueDate, isOverdue } from '../utils/date'
import type { Status, Task } from '../types'

const priorityLabels = { low: 'Low', medium: 'Medium', high: 'High' }
const statusLabels: Record<Status, string> = { todo: 'To Do', progress: 'In Progress', done: 'Done' }

interface TaskCardProps {
  task: Task
  compact?: boolean
}

export default function TaskCard({ task, compact = false }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false)
  const updateTask = useTaskStore((state) => state.updateTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const setEditingTaskId = useTaskStore((state) => state.setEditingTaskId)
  const overdue = isOverdue(task)
  const completedSubtasks = task.subtasks.filter((subtask) => subtask.completed).length

  function toggleComplete() {
    const nextStatus: Status = task.status === 'done' ? 'todo' : 'done'
    updateTask(task.id, { status: nextStatus, completedAt: nextStatus === 'done' ? new Date().toISOString() : undefined })
  }

  function toggleSubtask(subtaskId: string) {
    updateTask(task.id, { subtasks: task.subtasks.map((subtask) => subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask) })
  }

  return (
    <motion.article layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`task-card ${task.status === 'done' ? 'is-done' : ''} ${overdue ? 'is-overdue' : ''}`}>
      <div className="task-card-main">
        <button className={`complete-button ${task.status === 'done' ? 'checked' : ''}`} onClick={toggleComplete} aria-label={task.status === 'done' ? 'Mark as not done' : 'Mark as complete'}>{task.status === 'done' ? <Check size={16} /> : <Circle size={18} />}</button>
        <div className="task-card-copy">
          <div className="task-title-row"><h3>{task.title}</h3><span className={`priority-dot ${task.priority}`} title={`${priorityLabels[task.priority]} priority`} /></div>
          {!compact && task.description && <p>{task.description}</p>}
          <div className="task-meta"><span className={overdue ? 'overdue-text' : ''}><CalendarDays size={14} />{formatDueDate(task.dueDate)}</span><span className="category-chip">{task.category}</span>{task.subtasks.length > 0 && <span>{completedSubtasks}/{task.subtasks.length} checked</span>}</div>
        </div>
        <div className="task-card-actions"><button className="icon-button" onClick={() => setEditingTaskId(task.id)} aria-label="Edit task"><Pencil size={16} /></button><button className="icon-button danger-button" onClick={() => deleteTask(task.id)} aria-label="Delete task"><Trash2 size={16} /></button><button className="icon-button" onClick={() => setExpanded(!expanded)} aria-label="Show task options"><MoreHorizontal size={17} /></button></div>
      </div>
      <AnimatePresence>{expanded && task.subtasks.length > 0 && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="subtask-list">{task.subtasks.map((subtask) => <label key={subtask.id}><input type="checkbox" checked={subtask.completed} onChange={() => toggleSubtask(subtask.id)} /><span className={subtask.completed ? 'subtask-done' : ''}>{subtask.title}</span></label>)}</motion.div>}</AnimatePresence>
      <div className="task-status-row"><span className={`status-label ${task.status}`}>{statusLabels[task.status]}</span>{task.status !== 'done' && <select value={task.status} onChange={(event) => updateTask(task.id, { status: event.target.value as Status })} aria-label="Change task status"><option value="todo">To Do</option><option value="progress">In Progress</option><option value="done">Done</option></select>}</div>
    </motion.article>
  )
}
