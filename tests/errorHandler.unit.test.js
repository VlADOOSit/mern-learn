import { jest } from '@jest/globals';
import { errorHandler } from '../src/middlewares/errorHandler.js';
import { AppError } from '../src/utils/appError.js';

const createRes = () => ({
	status: jest.fn().mockReturnThis(),
	json: jest.fn()
});

describe('errorHandler middleware', () => {
	it('returns unified error response with details when present', () => {
		const req = {};
		const res = createRes();
		const next = jest.fn();
		const error = new AppError('Validation error', 400, {
			fieldErrors: { title: ['Required'] }
		});

		errorHandler(error, req, res, next);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			error: {
				message: 'Validation error',
				statusCode: 400,
				details: { fieldErrors: { title: ['Required'] } }
			}
		});
	});

	it('omits details when not provided', () => {
		const req = {};
		const res = createRes();
		const next = jest.fn();
		const error = new AppError('Unauthorized', 401);

		errorHandler(error, req, res, next);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({
			error: {
				message: 'Unauthorized',
				statusCode: 401
			}
		});
	});
});
