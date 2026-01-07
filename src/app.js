import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import taskRoutes from './routes/taskRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

const app = express();

if (process.env.NODE_ENV !== 'test') {
	app.use(morgan('dev'));
}

app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
	res.json({ status: 'ok' });
});

app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
