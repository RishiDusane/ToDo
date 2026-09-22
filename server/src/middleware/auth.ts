import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { User } from '../models/User.js'

type TokenPayload = { userId: number }

export async function requireAuth(request: Request, response: Response, next: NextFunction) {
  const header = request.header('authorization')
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined
  if (!token) return response.status(401).json({ message: 'Authentication required' })
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as TokenPayload
    const user = await User.findByPk(payload.userId)
    if (!user) return response.status(401).json({ message: 'Session user no longer exists' })
    request.user = user
    return next()
  } catch {
    return response.status(401).json({ message: 'Invalid or expired token' })
  }
}
