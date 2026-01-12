import { AppError } from '../utils/appError.js';

export const requireRole = (...allowedRoles) => {
	return (req, res, next) => {
		const role = req.user?.role;
		if (!role || !allowedRoles.includes(role)) {
			return next(new AppError('Forbidden', 403));
		}

		return next();
	};
};
