import { ZodError } from 'zod';
export function sendValidationError(response, error) {
    if (error instanceof ZodError)
        return response.status(400).json({ message: error.issues[0]?.message || 'Invalid request', issues: error.issues });
    return response.status(400).json({ message: 'Invalid request' });
}
