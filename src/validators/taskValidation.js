import { z } from 'zod';

export const objectId = z
	.string()
	.regex(/^[a-f\d]{24}$/i, 'Invalid id format');

export const createTaskSchema = z
	.object({
		title: z.string().trim().min(2),
		description: z.string().trim().optional(),
		status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
		deadline: z.coerce.date().optional()
	})
	.strict();

export const updateTaskSchema = z
	.object({
		title: z.string().trim().min(2).optional(),
		description: z.string().trim().optional(),
		status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
		deadline: z.coerce.date().optional()
	})
	.strict()
	.refine(
		(data) => Object.keys(data).length > 0,
		{ message: 'At least one field must be provided' }
	);

export const listTasksQuerySchema = z
	.object({
		status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
		sort: z.enum(['createdAt', 'deadline']).optional(),
		page: z.coerce.number().int().min(1).default(1),
		limit: z.coerce.number().int().min(1).max(100).default(10)
	})
	.strict();

export const taskIdParamsSchema = z
	.object({
		id: objectId
	})
	.strict();
