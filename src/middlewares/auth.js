import { AppError } from './errorHandler.js';
import { verifyAccessToken } from '../services/tokenService.js';

export const requireAuth = (req, res, next) => {
	try {
		const authHeader = req.headers.authorization || '';
		const [scheme, token] = authHeader.split(' ');

		if (scheme !== 'Bearer' || !token) {
			throw new AppError('Unauthorized', 401);
		}

		const payload = verifyAccessToken(token);
		req.user = {
			userId: payload.userId,
			email: payload.email,
			role: payload.role
		};

		return next();
	} catch (error) {
		return next(error);
	}
};
