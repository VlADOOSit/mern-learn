import {
	createTask,
	getTasks,
	getTaskById,
	updateTask,
	deleteTask
} from '../services/taskService.js';

export const createTaskController = async (req, res, next) => {
	try {
		const task = await createTask(req.body);
		res.status(201).json({ data: task });
	} catch (error) {
		next(error);
	}
};

export const listTasksController = async (req, res, next) => {
	try {
		const result = await getTasks(req.query);
		res.json({ data: result.tasks, meta: result.meta });
	} catch (error) {
		next(error);
	}
};

export const getTaskController = async (req, res, next) => {
	try {
		const task = await getTaskById(req.params.id);
		res.json({ data: task });
	} catch (error) {
		next(error);
	}
};

export const updateTaskController = async (req, res, next) => {
	try {
		const task = await updateTask(req.params.id, req.body);
		res.json({ data: task });
	} catch (error) {
		next(error);
	}
};

export const deleteTaskController = async (req, res, next) => {
	try {
		const task = await deleteTask(req.params.id);
		res.json({ data: task });
	} catch (error) {
		next(error);
	}
};
