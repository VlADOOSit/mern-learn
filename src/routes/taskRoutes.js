import { Router } from 'express';
import {
	createTaskController,
	listTasksController,
	getTaskController,
	updateTaskController,
	deleteTaskController
} from '../controllers/taskController.js';

const router = Router();

router.post('/', createTaskController);
router.get('/', listTasksController);
router.get('/:id', getTaskController);
router.patch('/:id', updateTaskController);
router.delete('/:id', deleteTaskController);

export default router;
