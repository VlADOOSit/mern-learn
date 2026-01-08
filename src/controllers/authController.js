import {
	register,
	login,
	refresh,
	logout
} from '../services/authService.js';
import { AppError } from '../middlewares/errorHandler.js';
import { User } from '../models/userModel.js';
import { setRefreshCookie, clearRefreshCookie, REFRESH_COOKIE_NAME } from '../services/cookieService.js';

const toPublicUser = (user) => ({
	id: user._id?.toString?.() || String(user._id),
	email: user.email,
	role: user.role
});

export const registerController = async (req, res, next) => {
	try {
		const { user, accessToken, refreshToken } = await register(
			req.validated?.body
		);

		setRefreshCookie(res, refreshToken);
		res.status(201).json({ data: { user, accessToken } });
	} catch (error) {
		next(error);
	}
};

export const loginController = async (req, res, next) => {
	try {
		const { user, accessToken, refreshToken } = await login(req.validated?.body);
		setRefreshCookie(res, refreshToken);
		res.json({ data: { user, accessToken } });
	} catch (error) {
		next(error);
	}
};

export const refreshController = async (req, res, next) => {
	try {
		const refreshToken =
			req.cookies?.[REFRESH_COOKIE_NAME] || req.validated?.body?.refreshToken;

		if (!refreshToken) {
			throw new AppError('Unauthorized', 401);
		}

		const result = await refresh({ refreshToken });
		setRefreshCookie(res, result.refreshToken);
		res.json({ data: { accessToken: result.accessToken } });
	} catch (error) {
		next(error);
	}
};

export const logoutController = async (req, res, next) => {
	try {
		const refreshToken =
			req.cookies?.[REFRESH_COOKIE_NAME] || req.validated?.body?.refreshToken;

		await logout({ refreshToken });
		clearRefreshCookie(res);
		res.json({ data: { ok: true } });
	} catch (error) {
		next(error);
	}
};

export const meController = async (req, res, next) => {
	try {
		const user = await User.findById(req.user?.userId).lean();
		if (!user) {
			throw new AppError('Unauthorized', 401);
		}
		res.json({ data: toPublicUser(user) });
	} catch (error) {
		next(error);
	}
};
