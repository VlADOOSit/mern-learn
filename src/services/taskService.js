import mongoose from 'mongoose';
import { Task } from '../models/taskModel.js';
import { AppError } from '../middlewares/errorHandler.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const validateObjectId = (id) => {
	if (!mongoose.isValidObjectId(id)) {
		throw new AppError('Invalid task id', 400);
	}
};

export const createTask = async (payload, userId) => {
	const task = await Task.create({ ...payload, userId });
	return task;
};

export const getTasks = async (query, userId) => {
	const { status, page = DEFAULT_PAGE, limit = DEFAULT_LIMIT, sort } = query;

	const filters = { userId };
	if (status) {
		filters.status = status;
	}

	const sortField = sort === 'deadline' ? 'deadline' : 'createdAt';
	const sortOrder = -1;

	const pageNumber = Number(page) > 0 ? Number(page) : DEFAULT_PAGE;
	const limitNumber = Number(limit) > 0 ? Number(limit) : DEFAULT_LIMIT;
	const skip = (pageNumber - 1) * limitNumber;

	const [tasks, total] = await Promise.all([
		Task.find(filters)
			.sort({ [sortField]: sortOrder })
			.skip(skip)
			.limit(limitNumber)
			.lean(),
		Task.countDocuments(filters)
	]);

	const pages = Math.ceil(total / limitNumber) || 1;

	return {
		tasks,
		meta: {
			page: pageNumber,
			limit: limitNumber,
			total,
			pages
		}
	};
};

export const getTaskById = async (id, userId) => {
	validateObjectId(id);
	const task = await Task.findOne({ _id: id, userId }).lean();
	if (!task) {
		throw new AppError('Task not found', 404);
	}
	return task;
};

export const updateTask = async (id, updates, userId) => {
	validateObjectId(id);
	const task = await Task.findOneAndUpdate({ _id: id, userId }, updates, {
		new: true,
		runValidators: true
	}).lean();

	if (!task) {
		throw new AppError('Task not found', 404);
	}

	return task;
};

export const deleteTask = async (id, userId) => {
	validateObjectId(id);
	const task = await Task.findOneAndDelete({ _id: id, userId }).lean();

	if (!task) {
		throw new AppError('Task not found', 404);
	}

	return task;
};
