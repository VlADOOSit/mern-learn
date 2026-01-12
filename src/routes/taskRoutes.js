import { Router } from 'express';
import {
	createTaskController,
	listTasksController,
	listAllTasksController,
	getTaskController,
	updateTaskController,
	deleteTaskController
} from '../controllers/taskController.js';
import { validate } from '../middlewares/validate.js';
import { requireAuth } from '../middlewares/auth.js';
import { requireRole } from '../middlewares/requireRole.js';
import {
	createTaskSchema,
	listTasksQuerySchema,
	taskIdParamsSchema,
	updateTaskSchema
} from '../validators/taskValidation.js';

const router = Router();

router.use(requireAuth);
router.post('/', validate({ body: createTaskSchema }), createTaskController);
router.get('/', validate({ query: listTasksQuerySchema }), listTasksController);
router.get(
	'/admin',
	requireRole('admin'),
	validate({ query: listTasksQuerySchema }),
	listAllTasksController
);
router.get('/:id', validate({ params: taskIdParamsSchema }), getTaskController);
router.patch(
	'/:id',
	validate({ params: taskIdParamsSchema, body: updateTaskSchema }),
	updateTaskController
);
router.delete('/:id', validate({ params: taskIdParamsSchema }), deleteTaskController);

export default router;
