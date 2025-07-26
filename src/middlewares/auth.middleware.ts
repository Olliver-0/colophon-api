import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '#/utils/AppError.js';
import config from '#/config/index.js';

declare module 'express-serve-static-core' {
  interface Request {
    user?: { id: string };
  }
}

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;

  if (!token) throw new AppError('No token provided, authorization denied.', 401);

  try {
    const decoded = jwt.verify(token, config.auth.jwtSecret) as { id: string };

    req.user = { id: decoded.id }

    return next();
  } catch (error) {
    console.error('Authentication Error:', error);
    throw new AppError('Invalid token.', 401)
  }
};
