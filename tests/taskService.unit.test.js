import { jest } from '@jest/globals';
import { AppError } from '../src/middlewares/errorHandler.js';

const mockIsValidObjectId = jest.fn();

const mockTaskModel = {
	create: jest.fn(),
	find: jest.fn(),
	countDocuments: jest.fn(),
	findById: jest.fn(),
	findByIdAndUpdate: jest.fn(),
	findByIdAndDelete: jest.fn()
};

jest.unstable_mockModule('mongoose', () => ({
	__esModule: true,
	default: {
		isValidObjectId: mockIsValidObjectId
	}
}));

jest.unstable_mockModule('../src/models/taskModel.js', () => ({
	__esModule: true,
	Task: mockTaskModel
}));

let taskService;
let Task;
let mongoose;

beforeAll(async () => {
	({ default: mongoose } = await import('mongoose'));
	({ Task } = await import('../src/models/taskModel.js'));
	taskService = await import('../src/services/taskService.js');
});

const createQueryChain = (resolvedValue) => ({
	sort: jest.fn().mockReturnThis(),
	skip: jest.fn().mockReturnThis(),
	limit: jest.fn().mockReturnThis(),
	lean: jest.fn().mockResolvedValue(resolvedValue)
});

describe('taskService', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockIsValidObjectId.mockReturnValue(true);
	});

	describe('createTask', () => {
		it('creates a task via Task.create and returns the result', async () => {
			const payload = { title: 'Test task' };
			const createdTask = { _id: '1', ...payload };
			Task.create.mockResolvedValueOnce(createdTask);

			const result = await taskService.createTask(payload);

			expect(Task.create).toHaveBeenCalledWith(payload);
			expect(result).toEqual(createdTask);
		});
	});

	describe('getTasks', () => {
		it('applies filters, sorting, pagination and returns meta', async () => {
			const tasks = [
				{ _id: '1', title: 'Task 1' },
				{ _id: '2', title: 'Task 2' }
			];
			const queryChain = createQueryChain(tasks);
			Task.find.mockReturnValue(queryChain);
			Task.countDocuments.mockResolvedValueOnce(12);

			const query = { status: 'TODO', page: '2', limit: '5', sort: 'deadline' };
			const result = await taskService.getTasks(query);

			expect(Task.find).toHaveBeenCalledWith({ status: 'TODO' });
			expect(queryChain.sort).toHaveBeenCalledWith({ deadline: -1 });
			expect(queryChain.skip).toHaveBeenCalledWith(5);
			expect(queryChain.limit).toHaveBeenCalledWith(5);
			expect(Task.countDocuments).toHaveBeenCalledWith({ status: 'TODO' });
			expect(result).toEqual({
				tasks,
				meta: { page: 2, limit: 5, total: 12, pages: 3 }
			});
		});

		it('defaults to createdAt sorting when no sort is provided', async () => {
			const tasks = [{ _id: '1', title: 'Task 1' }];
			const queryChain = createQueryChain(tasks);
			Task.find.mockReturnValue(queryChain);
			Task.countDocuments.mockResolvedValueOnce(0);

			const result = await taskService.getTasks({});

			expect(queryChain.sort).toHaveBeenCalledWith({ createdAt: -1 });
			expect(result.meta.pages).toBe(1);
		});
	});

	describe('getTaskById', () => {
		it('throws an AppError when id is invalid', async () => {
			mongoose.isValidObjectId.mockReturnValueOnce(false);

			await expect(taskService.getTaskById('bad-id')).rejects.toMatchObject({
				statusCode: 400,
				message: 'Invalid task id'
			});
		});

		it('throws an AppError when task is not found', async () => {
			const lean = jest.fn().mockResolvedValue(null);
			Task.findById.mockReturnValue({ lean });

			await expect(taskService.getTaskById('6641faaa111bbb222ccc3333')).rejects.toMatchObject({
				statusCode: 404,
				message: 'Task not found'
			});
			expect(lean).toHaveBeenCalled();
		});

		it('returns the task when id is valid and found', async () => {
			const task = { _id: '6641faaa111bbb222ccc3333', title: 'Found task' };
			const lean = jest.fn().mockResolvedValue(task);
			Task.findById.mockReturnValue({ lean });

			const result = await taskService.getTaskById(task._id);

			expect(Task.findById).toHaveBeenCalledWith(task._id);
			expect(result).toEqual(task);
		});
	});

	describe('updateTask', () => {
		it('throws an AppError when id is invalid', async () => {
			mongoose.isValidObjectId.mockReturnValueOnce(false);

			await expect(taskService.updateTask('invalid', { title: 'x' })).rejects.toMatchObject({
				statusCode: 400,
				message: 'Invalid task id'
			});
		});

		it('throws an AppError when task is not found', async () => {
			const lean = jest.fn().mockResolvedValue(null);
			Task.findByIdAndUpdate.mockReturnValue({ lean });

			await expect(
				taskService.updateTask('6641faaa111bbb222ccc3333', { title: 'Updated' })
			).rejects.toMatchObject({
				statusCode: 404,
				message: 'Task not found'
			});
			expect(lean).toHaveBeenCalled();
		});

		it('updates and returns the task when found', async () => {
			const updates = { title: 'Updated' };
			const updatedTask = { _id: '6641faaa111bbb222ccc3333', ...updates };
			const lean = jest.fn().mockResolvedValue(updatedTask);
			Task.findByIdAndUpdate.mockReturnValue({ lean });

			const result = await taskService.updateTask(updatedTask._id, updates);

			expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(updatedTask._id, updates, {
				new: true,
				runValidators: true
			});
			expect(result).toEqual(updatedTask);
		});
	});

	describe('deleteTask', () => {
		it('throws an AppError when id is invalid', async () => {
			mongoose.isValidObjectId.mockReturnValueOnce(false);

			await expect(taskService.deleteTask('invalid')).rejects.toMatchObject({
				statusCode: 400,
				message: 'Invalid task id'
			});
		});

		it('throws an AppError when task is not found', async () => {
			const lean = jest.fn().mockResolvedValue(null);
			Task.findByIdAndDelete.mockReturnValue({ lean });

			await expect(taskService.deleteTask('6641faaa111bbb222ccc3333')).rejects.toMatchObject({
				statusCode: 404,
				message: 'Task not found'
			});
			expect(lean).toHaveBeenCalled();
		});

		it('deletes and returns the task when found', async () => {
			const deletedTask = { _id: '6641faaa111bbb222ccc3333', title: 'Done' };
			const lean = jest.fn().mockResolvedValue(deletedTask);
			Task.findByIdAndDelete.mockReturnValue({ lean });

			const result = await taskService.deleteTask(deletedTask._id);

			expect(Task.findByIdAndDelete).toHaveBeenCalledWith(deletedTask._id);
			expect(result).toEqual(deletedTask);
		});
	});
});
