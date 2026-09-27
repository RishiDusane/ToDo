import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { env } from './config/env.js';
import { sequelize } from './config/database.js';
import './models/index.js';
import { errorHandler, notFound } from './middleware/errors.js';
import { requireAuth } from './middleware/auth.js';
import authRouter from './routes/auth.js';
import categoryRouter from './routes/categories.js';
import taskRouter from './routes/tasks.js';
const app = express();
const allowedOrigins = [env.FRONTEND_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.get('/health', (_request, response) => response.json({ status: 'ok' }));
app.use('/api/auth', authRouter);
app.use('/api/tasks', requireAuth, taskRouter);
app.use('/api/categories', requireAuth, categoryRouter);
app.use(notFound);
app.use(errorHandler);
async function start() {
    await sequelize.authenticate();
    app.listen(env.PORT, () => console.log(`TaskFlow API listening on http://localhost:${env.PORT}`));
}
start().catch((error) => {
    console.error('Unable to start TaskFlow API', error);
    process.exitCode = 1;
});
export default app;
