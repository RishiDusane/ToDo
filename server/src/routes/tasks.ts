import { Router } from 'express'
import { Op } from 'sequelize'
import { z } from 'zod'
import { sequelize } from '../config/database.js'
import { Category, Subtask, Task } from '../models/index.js'
import { sendValidationError } from '../utils/http.js'
import { serializeTask } from '../utils/serializers.js'

const router = Router()
const statusSchema = z.enum(['todo', 'progress', 'done'])
const prioritySchema = z.enum(['low', 'medium', 'high'])
const taskSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().max(500).default(''),
  dueDate: z.string().optional().or(z.literal('')),
  priority: prioritySchema.default('medium'),
  category: z.string().trim().min(1).max(40).default('Personal'),
  status: statusSchema.default('todo'),
  subtasks: z.array(z.object({ title: z.string().trim().min(1).max(160), completed: z.boolean().default(false) })).default([]),
})

function splitDueDate(value: string | undefined) {
  if (!value) return { dueDate: null, dueTime: null }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) throw new Error('Due date must be valid')
  return { dueDate: date.toISOString().slice(0, 10), dueTime: value.includes('T') ? `${date.toISOString().slice(11, 19)}` : null }
}

async function categoryFor(userId: number, name: string) {
  const [category] = await Category.findOrCreate({ where: { userId, name }, defaults: { userId, name, color: '#2f765c' } })
  return category
}

const include = [{ model: Category }, { model: Subtask }]

async function ownedTask(userId: number, taskId: string) {
  return Task.findOne({ where: { id: taskId, userId }, include })
}

async function replaceSubtasks(taskId: number, values: Array<{ title: string; completed: boolean }>) {
  await Subtask.destroy({ where: { taskId } })
  if (values.length) await Subtask.bulkCreate(values.map((subtask, position) => ({ taskId, title: subtask.title, isComplete: subtask.completed, position })))
}

router.get('/', async (request, response, next) => {
  try {
    const query = z.object({ status: z.enum(['todo', 'in_progress', 'done']).optional(), priority: prioritySchema.optional(), category: z.string().optional(), search: z.string().optional(), sortBy: z.enum(['dueDate', 'priority', 'createdAt']).default('dueDate') }).parse(request.query)
    const where: Record<string, unknown> = { userId: request.user!.id }
    if (query.status) where.status = query.status
    if (query.priority) where.priority = query.priority
    if (query.search) where[Op.or as unknown as string] = [{ title: { [Op.like]: `%${query.search}%` } }, { description: { [Op.like]: `%${query.search}%` } }]
    const tasks = await Task.findAll({ where, include, order: query.sortBy === 'priority' ? [['priority', 'ASC']] : query.sortBy === 'createdAt' ? [['createdAt', 'DESC']] : [['dueDate', 'ASC'], ['dueTime', 'ASC']] })
    const filtered = query.category ? tasks.filter((task) => (task as Task & { Category?: Category }).Category?.name === query.category) : tasks
    return response.json({ tasks: filtered.map((task) => serializeTask(task)) })
  } catch (error) { return next(error) }
})

router.get('/:id', async (request, response, next) => {
  try { const task = await ownedTask(request.user!.id, request.params.id); return task ? response.json({ task: serializeTask(task) }) : response.status(404).json({ message: 'Task not found' }) } catch (error) { return next(error) }
})

router.post('/', async (request, response) => {
  try {
    const input = taskSchema.parse(request.body)
    const category = await categoryFor(request.user!.id, input.category)
    const task = await sequelize.transaction(async (transaction) => {
      const created = await Task.create({ userId: request.user!.id, categoryId: category.id, title: input.title, description: input.description, ...splitDueDate(input.dueDate), priority: input.priority, status: input.status === 'progress' ? 'in_progress' : input.status }, { transaction })
      await replaceSubtasks(created.id, input.subtasks)
      return created
    })
    const fullTask = await ownedTask(request.user!.id, String(task.id))
    return response.status(201).json({ task: serializeTask(fullTask!) })
  } catch (error) { return sendValidationError(response, error) }
})

router.put('/:id', async (request, response, next) => {
  try {
    const input = taskSchema.partial().parse(request.body)
    const task = await ownedTask(request.user!.id, request.params.id)
    if (!task) return response.status(404).json({ message: 'Task not found' })
    const updates: Record<string, unknown> = { ...input }
    if (input.category) updates.categoryId = (await categoryFor(request.user!.id, input.category)).id
    if (input.dueDate !== undefined) Object.assign(updates, splitDueDate(input.dueDate))
    if (input.status) updates.status = input.status === 'progress' ? 'in_progress' : input.status
    delete updates.category
    delete updates.subtasks
    await sequelize.transaction(async (transaction) => {
      await task.update(updates, { transaction })
      if (input.subtasks) await replaceSubtasks(task.id, input.subtasks)
    })
    const fullTask = await ownedTask(request.user!.id, request.params.id)
    return response.json({ task: serializeTask(fullTask!) })
  } catch (error) { return next(error) }
})

router.delete('/:id', async (request, response, next) => {
  try { const deleted = await Task.destroy({ where: { id: request.params.id, userId: request.user!.id } }); return deleted ? response.status(204).send() : response.status(404).json({ message: 'Task not found' }) } catch (error) { return next(error) }
})

router.patch('/:id/status', async (request, response, next) => {
  try { const input = z.object({ status: statusSchema }).parse(request.body); const task = await ownedTask(request.user!.id, request.params.id); if (!task) return response.status(404).json({ message: 'Task not found' }); await task.update({ status: input.status === 'progress' ? 'in_progress' : input.status }); const fullTask = await ownedTask(request.user!.id, request.params.id); return response.json({ task: serializeTask(fullTask!) }) } catch (error) { return next(error) }
})

router.post('/:id/subtasks', async (request, response, next) => {
  try { const input = z.object({ title: z.string().trim().min(1).max(160), completed: z.boolean().default(false) }).parse(request.body); const task = await ownedTask(request.user!.id, request.params.id); if (!task) return response.status(404).json({ message: 'Task not found' }); const subtask = await Subtask.create({ taskId: task.id, title: input.title, isComplete: input.completed, position: await Subtask.count({ where: { taskId: task.id } }) }); return response.status(201).json({ subtask: { id: String(subtask.id), title: subtask.title, completed: subtask.isComplete } }) } catch (error) { return next(error) }
})

router.put('/:id/subtasks/:subtaskId', async (request, response, next) => {
  try { const input = z.object({ title: z.string().trim().min(1).max(160).optional(), completed: z.boolean().optional() }).parse(request.body); const task = await ownedTask(request.user!.id, request.params.id); if (!task) return response.status(404).json({ message: 'Task not found' }); const subtask = await Subtask.findOne({ where: { id: request.params.subtaskId, taskId: task.id } }); if (!subtask) return response.status(404).json({ message: 'Subtask not found' }); await subtask.update({ title: input.title, isComplete: input.completed }); return response.json({ subtask: { id: String(subtask.id), title: subtask.title, completed: subtask.isComplete } }) } catch (error) { return next(error) }
})

router.delete('/:id/subtasks/:subtaskId', async (request, response, next) => {
  try { const task = await ownedTask(request.user!.id, request.params.id); if (!task) return response.status(404).json({ message: 'Task not found' }); const deleted = await Subtask.destroy({ where: { id: request.params.subtaskId, taskId: task.id } }); return deleted ? response.status(204).send() : response.status(404).json({ message: 'Subtask not found' }) } catch (error) { return next(error) }
})

export default router
