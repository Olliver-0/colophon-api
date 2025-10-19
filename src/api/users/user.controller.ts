import { Request, Response } from 'express';
import prisma from '#/lib/prisma.js';
import { UserService } from './user.service.js';
import { AppError } from '#/utils/AppError.js';

const userService = new UserService(prisma);

export class UserController {
  public getProfile = async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const user = await userService.findUserById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return res.status(200).json({ status: 'success', data: user });
  };

  public addBookToShelf = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { googleBooksId, status } = req.body;

    const newBookshelfItem = await userService.createBookshelfItem(
      userId,
      googleBooksId,
      status
    );

    return res.status(201).json({ status: 'success', data: newBookshelfItem });
  };

  public getBookshelf = async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const bookshelfItems = await userService.findBookshelfByUserId(userId);

    return res.status(200).json({ status: 'success', data: bookshelfItems });
  };
}
