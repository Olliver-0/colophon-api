import { Prisma, PrismaClient } from '@prisma/client';
import { type BookshelfStatus } from '@prisma/client';
import { type User, type UserResponse } from './user.types.js';
import { type Book } from '../books/book.types.js';
import { type BookshelfItem } from './user.types.js';
import { BookService } from '../books/book.service.js';
import { AppError } from '#/utils/AppError.js';

export class UserService {
  private bookService: BookService;

  constructor(private prisma: PrismaClient) {
    this.bookService = new BookService(this.prisma);
  }

  public findUserById = async (id: string): Promise<UserResponse | null> => {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    const { password, ...userResponse } = user;
    return userResponse;
  };

  public createBookshelfItem = async (
    userId: User['id'],
    googleBooksId: Book['googleBooksId'],
    status: BookshelfStatus
  ): Promise<BookshelfItem> => {
    const bookInDb = await this.bookService.findOrCreateBook(googleBooksId);

    const addBook = await this.prisma.bookshelfItem.create({
      data: {
        status,
        bookId: bookInDb.id,
        userId,
      },
    });

    return addBook;
  };

  public findBookshelfByUserId = async (
    userId: string
  ): Promise<BookshelfItem[]> => {
    const bookshelfItems = await this.prisma.bookshelfItem.findMany({
      where: { userId },
      include: { book: true },
    });
    return bookshelfItems;
  };

  public updateBookshelfItemStatus = async (
    userId: string,
    itemId: string,
    status: BookshelfStatus
  ): Promise<BookshelfItem> => {
    try {
      const updatedItem = await this.prisma.bookshelfItem.update({
        where: {
          id: itemId,
          userId,
        },
        data: {
          status,
        },
        include: {
          book: true,
        },
      });
      return updatedItem;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new AppError('Bookshelf item not found or does not belong to the user.', 404);
      }
      throw error;
    }
  };
}
