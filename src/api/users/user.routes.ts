import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { UserController } from './user.controller.js';
import { authMiddleware } from '#/middlewares/auth.middleware.js';
import { validate } from '#/middlewares/validate.middleware.js';
import {
  createBookshelfItemSchema,
  updateBookshelfItemSchema,
} from './user.validation.js';

const router = Router();

const userActionsRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'test' ? 1000 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message:
    'Too many user actions from this IP, please try again after 15 minutes.',
});

const userController = new UserController();

router.get(
  '/me',
  userActionsRateLimiter,
  authMiddleware,
  userController.getProfile
);
router.post(
  '/me/bookshelf',
  userActionsRateLimiter,
  authMiddleware,
  validate(createBookshelfItemSchema),
  userController.addBookToShelf
);
router.get(
  '/me/bookshelf',
  userActionsRateLimiter,
  authMiddleware,
  userController.getBookshelf
);
router.patch(
  '/me/bookshelf/:itemId',
  userActionsRateLimiter,
  authMiddleware,
  validate(updateBookshelfItemSchema),
  userController.updateBookshelfItem
);
router.delete(
  '/me/bookshelf/:itemId',
  userActionsRateLimiter,
  authMiddleware,
  userController.deleteBookFromShelf
);

export default router;
