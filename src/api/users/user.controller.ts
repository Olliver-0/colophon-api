import prisma from '#/lib/prisma.js';
import { Request, Response } from 'express';
import { UserService } from './user.service.js';

const userService = new UserService(prisma);
export class UserController {
  public register = async (req: Request, res: Response) => {
    const createdUser = await userService.createUser(req.body);
  
    return res.status(201).json({
      status: 'success',
      message: 'User created with success',
      data: createdUser,
    });
  };
}
