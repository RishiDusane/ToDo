import type { ErrorRequestHandler, RequestHandler } from 'express'
import { ValidationError } from 'sequelize'

export const notFound: RequestHandler = (_request, response) => {
  response.status(404).json({ message: 'Route not found' })
}

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ValidationError) return response.status(400).json({ message: error.errors[0]?.message || 'Validation failed' })
  console.error(error)
  return response.status(500).json({ message: 'Something went wrong on the server' })
}
