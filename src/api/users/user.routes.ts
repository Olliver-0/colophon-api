import { Router } from 'express';
import { UserController } from './user.controller.js';
import { authMiddleware } from '#/middlewares/auth.middleware.js';

const router = Router();
const userController = new UserController();

router.get('/me', authMiddleware, userController.getProfile);

export default router;