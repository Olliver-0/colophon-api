import { BookshelfItem, PrismaClient } from '@prisma/client';
import { User, UserResponse } from '../users/user.types.js';
import { Book } from '../books/book.types.js';
import { BookService } from '../books/book.service.js';
import { BookShelfItem } from './user.types.js';

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
    shelf: string
  ): Promise<BookShelfItem> => {
    const bookInDb = await this.bookService.findOrCreateBook(googleBooksId);

    const addBook = await this.prisma.bookshelfItem.create({
      data: {
        status: shelf,
        bookId: bookInDb.id,
        userId: userId,
      },
    });

    return addBook;
  };

  public findBookshelfByUserId = async (userId: string): Promise<BookshelfItem[]> => {
    const bookshelfItems = await this.prisma.bookshelfItem.findMany({
      where: { userId },
      include: { book: true },
    });
    return bookshelfItems;
  };
}
