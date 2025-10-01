import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { UserController } from './user.controller.js';
import { authMiddleware } from '#/middlewares/auth.middleware.js';

const router = Router();

// Apply rate limiter to sensitive routes
const profileRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

const userController = new UserController();

router.get('/me', profileRateLimiter, authMiddleware, userController.getProfile);

export default router;