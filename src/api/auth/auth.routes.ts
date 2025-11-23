import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { validate } from '#/middlewares/validate.middleware.js';
import { authenticateUserSchema, createUserSchema } from './auth.validation.js';
import rateLimit from 'express-rate-limit';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: process.env.NODE_ENV === 'test' ? 1000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many authentication attempts from this IP, please try again after 5 minutes.',
});

const authController = new AuthController();

router.post('/register', authLimiter, validate(createUserSchema), authController.register);
router.post('/login', authLimiter, validate(authenticateUserSchema), authController.login);
router.post('/logout', authController.logout);
export default router;
