import bcrypt from 'bcryptjs';
import { User } from '../models/userModel.js';
import { AppError } from '../middlewares/errorHandler.js';
import {
	signAccessToken,
	signRefreshToken,
	getRefreshTokenExpiresAt,
	saveRefreshToken,
	rotateRefreshToken,
	revokeRefreshToken
} from './tokenService.js';

const SALT_ROUNDS = 12;

const normalizeEmail = (email) => email.trim().toLowerCase();

const toPublicUser = (user) => ({
	id: user._id?.toString?.() || String(user._id),
	email: user.email,
	role: user.role
});

export const register = async ({ email, password }) => {
	const normalizedEmail = normalizeEmail(email);

	const existingUser = await User.findOne({ email: normalizedEmail }).lean();
	if (existingUser) {
		throw new AppError('Email already in use', 409);
	}

	const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
	const user = await User.create({ email: normalizedEmail, passwordHash });

	const accessToken = signAccessToken({
		userId: user._id.toString(),
		email: user.email,
		role: user.role
	});

	const refreshToken = signRefreshToken({ userId: user._id.toString() });
	const expiresAt = getRefreshTokenExpiresAt(refreshToken);
	await saveRefreshToken({
		userId: user._id.toString(),
		refreshToken,
		expiresAt
	});

	return { user: toPublicUser(user), accessToken, refreshToken };
};

export const login = async ({ email, password }) => {
	const normalizedEmail = normalizeEmail(email);
	const user = await User.findOne({ email: normalizedEmail }).select(
		'+passwordHash'
	);

	if (!user) {
		throw new AppError('Invalid email or password', 401);
	}

	const validPassword = await bcrypt.compare(password, user.passwordHash);
	if (!validPassword) {
		throw new AppError('Invalid email or password', 401);
	}

	const accessToken = signAccessToken({
		userId: user._id.toString(),
		email: user.email,
		role: user.role
	});

	const refreshToken = signRefreshToken({ userId: user._id.toString() });
	const expiresAt = getRefreshTokenExpiresAt(refreshToken);
	await saveRefreshToken({
		userId: user._id.toString(),
		refreshToken,
		expiresAt
	});

	return { user: toPublicUser(user), accessToken, refreshToken };
};

export const refresh = async ({ refreshToken }) => {
	const { newRefreshToken, userId } = await rotateRefreshToken({ refreshToken });
	const user = await User.findById(userId).lean();

	if (!user) {
		throw new AppError('Unauthorized', 401);
	}

	const accessToken = signAccessToken({
		userId: user._id.toString(),
		email: user.email,
		role: user.role
	});

	return {
		accessToken,
		refreshToken: newRefreshToken,
		user: toPublicUser(user)
	};
};

export const logout = async ({ refreshToken }) => {
	await revokeRefreshToken({ refreshToken });
};
