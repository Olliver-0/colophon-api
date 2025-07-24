import { Router } from 'express';
import { UserController } from './user.controller.js';
import { validate } from '#/middlewares/validate.js';
import { createUserSchema } from './user.validation.js';

const router = Router();
const userController = new UserController();

router.post('/register', validate(createUserSchema), userController.register);

export default router;
