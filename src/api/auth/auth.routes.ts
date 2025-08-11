import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { validate } from '#/middlewares/validate.middleware.js';
import { authenticateUserSchema, createUserSchema } from './auth.validation.js';

const router = Router();
const authController = new AuthController();

router.post('/register', validate(createUserSchema), authController.register);
router.post('/login', validate(authenticateUserSchema), authController.login);
router.post('/logout', authController.logout);
export default router;
