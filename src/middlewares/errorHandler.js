export class AppError extends Error {
	constructor(message, statusCode = 500, details) {
		super(message);
		this.statusCode = statusCode;
		this.details = details;
		Error.captureStackTrace(this, this.constructor);
	}
}

export const notFound = (req, res, next) => {
	next(new AppError('Resource not found', 404));
};

export const errorHandler = (err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || 'Internal Server Error';
	const payload = { error: message };

	if (err.details) {
		payload.details = err.details;
	}

	res.status(statusCode).json(payload);
};
