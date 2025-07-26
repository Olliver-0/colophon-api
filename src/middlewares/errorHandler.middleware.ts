  import { Request, Response, NextFunction } from 'express';
  import { AppError } from '#/utils/AppError.js';

  export const errorHandler = (
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    console.error(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  };
