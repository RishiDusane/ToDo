import dotenv from 'dotenv'
import path from 'node:path'
import { z } from 'zod'

dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  FRONTEND_ORIGIN: z.string().default('http://localhost:5173'),
  DB_HOST: z.string().default('127.0.0.1'),
  DB_PORT: z.coerce.number().default(3306),
  DB_USER: z.string().default('taskflow'),
  DB_PASSWORD: z.string().default('taskflow'),
  DB_NAME: z.string().default('taskflow'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters').default('development-taskflow-secret'),
})

export const env = envSchema.parse(process.env)
