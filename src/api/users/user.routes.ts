import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { UserController } from './user.controller.js';
import { authMiddleware } from '#/middlewares/auth.middleware.js';

const router = Router();

const profileRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const userController = new UserController();

router.get('/me', profileRateLimiter, authMiddleware, userController.getProfile);

export default router;
