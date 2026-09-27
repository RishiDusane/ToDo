import { ValidationError } from 'sequelize';
import { ZodError } from 'zod';

export const notFound = (_request, response) => {
    response.status(404).json({ message: 'Route not found' });
};

export const errorHandler = (error, _request, response, _next) => {
    if (error instanceof ZodError) {
        return response.status(400).json({
            message: error.issues[0]?.message || 'Validation failed',
            issues: error.issues,
        });
    }
    if (error instanceof ValidationError) {
        return response.status(400).json({
            message: error.errors[0]?.message || 'Validation failed',
        });
    }
    console.error(error);
    return response.status(500).json({ message: 'Something went wrong on the server' });
};
