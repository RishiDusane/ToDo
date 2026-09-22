import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
export async function requireAuth(request, response, next) {
    const header = request.header('authorization');
    const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
    if (!token)
        return response.status(401).json({ message: 'Authentication required' });
    try {
        const payload = jwt.verify(token, env.JWT_SECRET);
        const user = await User.findByPk(payload.userId);
        if (!user)
            return response.status(401).json({ message: 'Session user no longer exists' });
        request.user = user;
        return next();
    }
    catch {
        return response.status(401).json({ message: 'Invalid or expired token' });
    }
}
