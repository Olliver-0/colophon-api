import prisma from '#/lib/prisma.js';
import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';

const authService = new AuthService(prisma);
export class AuthController {
  public register = async (req: Request, res: Response) => {
    const createdUser = await authService.createUser(req.body);
  
    return res.status(201).json({
      status: 'success',
      message: 'User created with success',
      data: createdUser,
    });
  };
}
