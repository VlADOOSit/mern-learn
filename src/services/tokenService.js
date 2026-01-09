import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { AppError } from '../utils/appError.js';
import { RefreshToken } from '../models/refreshTokenModel.js';

const requireEnv = (key) => {
	const value = process.env[key];
	if (!value) {
		throw new Error(`${key} is not defined in the environment variables`);
	}
	return value;
};

export const signAccessToken = ({ userId, email, role }) => {
	const secret = requireEnv('JWT_ACCESS_SECRET');
	const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
	return jwt.sign({ userId, email, role }, secret, { expiresIn });
};

export const signRefreshToken = ({ userId }) => {
	const secret = requireEnv('JWT_REFRESH_SECRET');
	const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
	return jwt.sign({ userId }, secret, { expiresIn });
};

export const verifyAccessToken = (token) => {
	try {
		const secret = requireEnv('JWT_ACCESS_SECRET');
		const payload = jwt.verify(token, secret);
		return {
			userId: payload.userId,
			email: payload.email,
			role: payload.role
		};
	} catch (error) {
		throw new AppError('Invalid or expired access token', 401);
	}
};

export const verifyRefreshToken = (token) => {
	try {
		const secret = requireEnv('JWT_REFRESH_SECRET');
		return jwt.verify(token, secret);
	} catch (error) {
		throw new AppError('Invalid or expired refresh token', 401);
	}
};

export const hashToken = (token) =>
	crypto.createHash('sha256').update(token).digest('hex');

export const getRefreshTokenExpiresAt = (refreshToken) => {
	const decoded = jwt.decode(refreshToken);
	if (!decoded?.exp) {
		throw new AppError('Invalid refresh token', 401);
	}
	return new Date(decoded.exp * 1000);
};

export const saveRefreshToken = async ({ userId, refreshToken, expiresAt }) => {
	const tokenHash = hashToken(refreshToken);
	const refreshTokenDoc = await RefreshToken.create({
		userId,
		tokenHash,
		expiresAt
	});
	return refreshTokenDoc;
};

export const rotateRefreshToken = async ({ refreshToken }) => {
	const payload = verifyRefreshToken(refreshToken);
	const tokenHash = hashToken(refreshToken);

	const stored = await RefreshToken.findOne({ tokenHash });
	if (!stored || stored.revoked) {
		throw new AppError('Invalid or expired refresh token', 401);
	}

	if (stored.expiresAt && stored.expiresAt.getTime() <= Date.now()) {
		stored.revoked = true;
		await stored.save();
		throw new AppError('Invalid or expired refresh token', 401);
	}

	const newRefreshToken = signRefreshToken({ userId: payload.userId });
	const newTokenHash = hashToken(newRefreshToken);
	const expiresAt = getRefreshTokenExpiresAt(newRefreshToken);

	stored.revoked = true;
	stored.replacedByTokenHash = newTokenHash;
	await stored.save();

	await RefreshToken.create({
		userId: payload.userId,
		tokenHash: newTokenHash,
		expiresAt
	});

	return { newRefreshToken, userId: payload.userId };
};

export const revokeRefreshToken = async ({ refreshToken }) => {
	if (!refreshToken) {
		return;
	}

	const tokenHash = hashToken(refreshToken);
	await RefreshToken.findOneAndUpdate(
		{ tokenHash, revoked: false },
		{ revoked: true }
	);
};
