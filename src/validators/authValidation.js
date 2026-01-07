import { z } from 'zod';

const emailSchema = z.preprocess(
	(value) => (typeof value === 'string' ? value.trim() : value),
	z.email().transform((value) => value.toLowerCase())
);

const passwordSchema = z.string().min(8);

export const registerSchema = z.object({
	email: emailSchema,
	password: passwordSchema
});

export const loginSchema = z.object({
	email: emailSchema,
	password: passwordSchema
});

export const refreshSchema = z.object({
	refreshToken: z.string().min(1).optional()
});
