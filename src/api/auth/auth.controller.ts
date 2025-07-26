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

  public login = async (req: Request, res: Response) => {
    const token = await authService.authenticateUser(req.body);

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 168 * 60 * 60 * 1000,
      path: '/api',
    });

    return res.status(200).json({ status: 'success', message: 'Logged in successfully' });
  };
}
