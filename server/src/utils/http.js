import { ZodError } from 'zod';
export function sendValidationError(response, error) {
    if (error instanceof ZodError)
        return response.status(400).json({ message: error.issues[0]?.message || 'Invalid request', issues: error.issues });
    console.error('Unexpected error in handler:', error);
    return response.status(500).json({ message: error?.message || 'Something went wrong on the server' });
}
