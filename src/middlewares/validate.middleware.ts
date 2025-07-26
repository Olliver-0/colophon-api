import { Request, Response, NextFunction } from 'express';
import z from 'zod';

export const validate =
  (schema: z.core.$ZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      z.core.parse(schema, {
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof z.core.$ZodError) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation error',
          errors: error.issues.map((e) => ({ path: e.path, message: e.message })),
        });
      }
      return next(error);
    }
  };
