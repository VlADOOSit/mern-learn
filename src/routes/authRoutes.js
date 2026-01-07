import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { requireAuth } from '../middlewares/auth.js';
import {
	registerController,
	loginController,
	refreshController,
	logoutController,
	meController
} from '../controllers/authController.js';
import {
	loginSchema,
	refreshSchema,
	registerSchema
} from '../validators/authValidation.js';

const router = Router();

router.post('/register', validate({ body: registerSchema }), registerController);
router.post('/login', validate({ body: loginSchema }), loginController);
router.post('/refresh', validate({ body: refreshSchema }), refreshController);
router.post('/logout', logoutController);
router.get('/me', requireAuth, meController);

export default router;
