import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { validate } from '#/middlewares/validate.js';
import { createUserSchema } from './auth.validation.js';

const router = Router();
const authController = new AuthController();

router.post('/register', validate(createUserSchema), authController.register);

export default router;
