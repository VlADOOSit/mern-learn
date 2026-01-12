import { jest } from '@jest/globals';
import { AppError } from '../src/utils/appError.js';
import { requireRole } from '../src/middlewares/requireRole.js';

describe('requireRole middleware', () => {
	it('rejects when user is missing', () => {
		const req = {};
		const res = {};
		const next = jest.fn();

		requireRole('admin')(req, res, next);

		const error = next.mock.calls[0][0];
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(403);
		expect(error.message).toBe('Forbidden');
	});

	it('rejects when role is not allowed', () => {
		const req = { user: { role: 'user' } };
		const res = {};
		const next = jest.fn();

		requireRole('admin')(req, res, next);

		const error = next.mock.calls[0][0];
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(403);
	});

	it('passes when role is allowed', () => {
		const req = { user: { role: 'admin' } };
		const res = {};
		const next = jest.fn();

		requireRole('admin')(req, res, next);

		expect(next).toHaveBeenCalledWith();
	});
});
