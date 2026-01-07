import {
	createTask,
	getTasks,
	getTaskById,
	updateTask,
	deleteTask
} from '../services/taskService.js';

export const createTaskController = async (req, res, next) => {
	try {
		const task = await createTask(req.validated?.body, req.user?.userId);
		res.status(201).json({ data: task });
	} catch (error) {
		next(error);
	}
};

export const listTasksController = async (req, res, next) => {
	try {
		const result = await getTasks(req.validated?.query, req.user?.userId);
		res.json({ data: result.tasks, meta: result.meta });
	} catch (error) {
		next(error);
	}
};

export const getTaskController = async (req, res, next) => {
	try {
		const task = await getTaskById(
			req.validated?.params.id,
			req.user?.userId
		);
		res.json({ data: task });
	} catch (error) {
		next(error);
	}
};

export const updateTaskController = async (req, res, next) => {
	try {
		const task = await updateTask(
			req.validated?.params.id,
			req.validated?.body,
			req.user?.userId
		);
		res.json({ data: task });
	} catch (error) {
		next(error);
	}
};

export const deleteTaskController = async (req, res, next) => {
	try {
		const task = await deleteTask(
			req.validated?.params.id,
			req.user?.userId
		);
		res.json({ data: task });
	} catch (error) {
		next(error);
	}
};
