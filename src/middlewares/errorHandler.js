import { AppError } from '../utils/appError.js';

export const notFound = (req, res, next) => {
	next(new AppError('Resource not found', 404));
};

export const errorHandler = (err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || 'Internal Server Error';
	const payload = {
		error: {
			message,
			statusCode,
			details: err.details,
		},
	};

	if (!payload.error.details) {
		delete payload.error.details;
	}

	res.status(statusCode).json(payload);
};
