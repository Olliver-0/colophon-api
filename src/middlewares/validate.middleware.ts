import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import * as z4 from 'zod/v4/core';

export const validate =
  (schema: z4.$ZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      z4.parse(schema, {
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation error',
          errors: error.issues.map((e) => ({ path: e.path, message: e.message })),
        });
      }
      return next(error);
    }
  };
