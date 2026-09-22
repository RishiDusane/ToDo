import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { env } from '../config/env.js'
import { User } from '../models/index.js'
import { requireAuth } from '../middleware/auth.js'
import { sendValidationError } from '../utils/http.js'

const router = Router()
const credentialsSchema = z.object({ name: z.string().trim().min(2).max(80).optional(), email: z.string().trim().email().max(160), password: z.string().min(8).max(100) })

function tokenFor(user: User) { return jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: '7d' }) }
function publicUser(user: User) { return { id: user.id, name: user.name, email: user.email } }

router.post('/register', async (request, response) => {
  try {
    const input = credentialsSchema.extend({ name: z.string().trim().min(2).max(80) }).parse(request.body)
    const existing = await User.findOne({ where: { email: input.email.toLowerCase() } })
    if (existing) return response.status(409).json({ message: 'An account with that email already exists' })
    const user = await User.create({ name: input.name, email: input.email.toLowerCase(), passwordHash: await bcrypt.hash(input.password, 12) })
    return response.status(201).json({ token: tokenFor(user), user: publicUser(user) })
  } catch (error) { return sendValidationError(response, error) }
})

router.post('/login', async (request, response) => {
  try {
    const input = credentialsSchema.omit({ name: true }).parse(request.body)
    const user = await User.findOne({ where: { email: input.email.toLowerCase() } })
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) return response.status(401).json({ message: 'Email or password is incorrect' })
    return response.json({ token: tokenFor(user), user: publicUser(user) })
  } catch (error) { return sendValidationError(response, error) }
})

router.get('/me', requireAuth, (request, response) => response.json({ user: publicUser(request.user!) }))

export default router
