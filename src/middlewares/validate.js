import { AppError } from '../utils/appError.js';

export const validate = ({ body, query, params } = {}) => (req, res, next) => {
	try {
		const validated = {};

		if (body) {
			const result = body.safeParse(req.body);
			if (!result.success) {
				return next(new AppError('Validation error', 400, result.error.flatten()));
			}
			validated.body = result.data;
		}

		if (query) {
			const result = query.safeParse(req.query);
			if (!result.success) {
				return next(new AppError('Validation error', 400, result.error.flatten()));
			}
			validated.query = result.data;
		}

		if (params) {
			const result = params.safeParse(req.params);
			if (!result.success) {
				return next(new AppError('Validation error', 400, result.error.flatten()));
			}
			validated.params = result.data;
		}

		req.validated = validated;
		return next();
	} catch (err) {
		return next(err);
	}
};
