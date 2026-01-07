import { jest } from '@jest/globals';
import { AppError } from '../src/middlewares/errorHandler.js';

const mockVerifyAccessToken = jest.fn();

jest.unstable_mockModule('../src/services/tokenService.js', () => ({
	__esModule: true,
	verifyAccessToken: mockVerifyAccessToken
}));

let requireAuth;

beforeAll(async () => {
	({ requireAuth } = await import('../src/middlewares/auth.js'));
});

describe('auth middleware', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('rejects when Authorization header is missing', () => {
		const req = { headers: {} };
		const res = {};
		const next = jest.fn();

		requireAuth(req, res, next);

		const error = next.mock.calls[0][0];
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(401);
		expect(error.message).toBe('Unauthorized');
	});

	it('rejects when Authorization header is malformed', () => {
		const req = { headers: { authorization: 'Token abc' } };
		const res = {};
		const next = jest.fn();

		requireAuth(req, res, next);

		const error = next.mock.calls[0][0];
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(401);
	});

	it('sets req.user when token is valid', () => {
		const req = { headers: { authorization: 'Bearer valid-token' } };
		const res = {};
		const next = jest.fn();

		mockVerifyAccessToken.mockReturnValueOnce({
			userId: 'user-1',
			email: 'user@example.com',
			role: 'user'
		});

		requireAuth(req, res, next);

		expect(mockVerifyAccessToken).toHaveBeenCalledWith('valid-token');
		expect(req.user).toEqual({
			userId: 'user-1',
			email: 'user@example.com',
			role: 'user'
		});
		expect(next).toHaveBeenCalledWith();
	});

	it('passes token errors to next', () => {
		const req = { headers: { authorization: 'Bearer bad-token' } };
		const res = {};
		const next = jest.fn();

		mockVerifyAccessToken.mockImplementationOnce(() => {
			throw new AppError('Invalid or expired access token', 401);
		});

		requireAuth(req, res, next);

		const error = next.mock.calls[0][0];
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(401);
		expect(error.message).toBe('Invalid or expired access token');
	});
});
