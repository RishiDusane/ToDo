import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarClock, Check, X } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useTaskStore } from '../store/useTaskStore'
import { toInputDate } from '../utils/date'
import type { Priority, Status, Task } from '../types'

const taskSchema = z.object({
  title: z.string().trim().min(1, 'A task title is required').max(100, 'Keep the title under 100 characters'),
  description: z.string().max(500, 'Keep the description under 500 characters'),
  dueDate: z.string(),
  priority: z.enum(['low', 'medium', 'high']),
  category: z.string().trim().max(30, 'Keep the category short'),
  status: z.enum(['todo', 'progress', 'done']),
  subtasks: z.string(),
})

type TaskFormValues = z.infer<typeof taskSchema>

interface TaskFormProps {
  task?: Task
  onClose: () => void
}

export default function TaskForm({ task, onClose }: TaskFormProps) {
  const addTask = useTaskStore((state) => state.addTask)
  const updateTask = useTaskStore((state) => state.updateTask)
  const categories = useTaskStore((state) => state.categories)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? '',
      description: task?.description ?? '',
      dueDate: task ? toInputDate(task.dueDate) : '',
      priority: task?.priority ?? 'medium',
      category: task?.category ?? 'Personal',
      status: task?.status ?? 'todo',
      subtasks: task?.subtasks.map((subtask) => subtask.title).join('\n') ?? '',
    },
  })

  useEffect(() => {
    reset({
      title: task?.title ?? '',
      description: task?.description ?? '',
      dueDate: task ? toInputDate(task.dueDate) : '',
      priority: task?.priority ?? 'medium',
      category: task?.category ?? 'Personal',
      status: task?.status ?? 'todo',
      subtasks: task?.subtasks.map((subtask) => subtask.title).join('\n') ?? '',
    })
  }, [reset, task])

  function onSubmit(values: TaskFormValues) {
    const subtasks = values.subtasks.split('\n').map((title) => title.trim()).filter(Boolean).map((title, index) => ({
      id: task?.subtasks[index]?.id ?? crypto.randomUUID(),
      title,
      completed: task?.subtasks[index]?.completed ?? false,
    }))
    const payload = {
      title: values.title,
      description: values.description,
      dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : '',
      priority: values.priority as Priority,
      category: values.category || 'Personal',
      status: values.status as Status,
      subtasks,
    }

    if (task) updateTask(task.id, payload)
    else addTask(payload)
    onClose()
  }

  return (
    <div className="drawer-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="drawer" aria-labelledby="task-editor-title">
        <div className="drawer-header">
          <div>
            <p className="eyebrow">Task details</p>
            <h2 id="task-editor-title">{task ? 'Edit task' : 'Plan something new'}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close editor"><X size={20} /></button>
        </div>
        <form className="task-editor" onSubmit={handleSubmit(onSubmit)}>
          <label>Title<input {...register('title')} placeholder="e.g. Finish research notes" autoFocus />{errors.title && <small className="field-error">{errors.title.message}</small>}</label>
          <label>Description<textarea {...register('description')} placeholder="Add context or a next step..." rows={4} />{errors.description && <small className="field-error">{errors.description.message}</small>}</label>
          <div className="form-grid">
            <label>Due date and time<div className="input-with-icon"><CalendarClock size={17} /><input type="datetime-local" {...register('dueDate')} /></div></label>
            <label>Priority<select {...register('priority')}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
          </div>
          <div className="form-grid">
            <label>Category<input list="category-options" {...register('category')} placeholder="Study" /><datalist id="category-options">{categories.map((category) => <option key={category} value={category} />)}</datalist></label>
            <label>Status<select {...register('status')}><option value="todo">To Do</option><option value="progress">In Progress</option><option value="done">Done</option></select></label>
          </div>
          <label>Checklist <span className="label-hint">one item per line</span><textarea {...register('subtasks')} placeholder="Read chapter 4\nWrite summary" rows={3} /></label>
          <div className="drawer-actions"><button type="button" className="button secondary" onClick={onClose}>Cancel</button><button className="button primary" type="submit" disabled={isSubmitting}><Check size={17} />{task ? 'Save changes' : 'Create task'}</button></div>
        </form>
      </section>
    </div>
  )
}
