import config from '#/config/index.js';
import { AppError } from '#/utils/AppError.js';
import axios from 'axios';
import type { Book } from './book.types.js';
import { type Book as PrismaBook, Prisma, PrismaClient } from '@prisma/client';

interface GoogleBookItem {
  id: string;
  volumeInfo: {
    title: string;
    subtitle?: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
    };
  };
}

export class BookService {
  private readonly apiKey = config.app.googleBooksApiKey;
  private readonly baseUrl = 'https://www.googleapis.com/books/v1/volumes';

  constructor(private prisma: PrismaClient) {}

  public search = async (query: string): Promise<Book[]> => {
    if (!this.apiKey) {
      throw new AppError('Google Books API key is missing.', 500);
    }

    try {
      const response = await axios.get<{ items: GoogleBookItem[] }>(
        this.baseUrl,
        {
          params: {
            q: query,
            key: this.apiKey,
            maxResults: 24,
          },
        }
      );

      if (!response.data.items) {
        return [];
      }

      return response.data.items.map(this._formatBook);
    } catch (error) {
      console.error('Error searching books:', error);
      throw new AppError('Failed to fetch books from Google Books API.', 500);
    }
  };

  public findOrCreateBook = async (googleBooksId: string): Promise<PrismaBook> => {
    const existingBook = await this.prisma.book.findUnique({
      where: { googleBooksId: googleBooksId },
    });

    if (existingBook) {
      return existingBook;
    }

    try {
      const response = await axios.get<GoogleBookItem>(
        `${this.baseUrl}/${googleBooksId}?key=${this.apiKey}`
      );

      const bookDataForDb = this._prepareBookForDatabase(response.data);

      const newBook = await this.prisma.book.create({
        data: bookDataForDb,
      });

      return newBook;
    } catch (error) {
      console.error('Error fetching single book:', error);
      throw new AppError('Failed to fetch book from Google Books API.', 500);
    }
};


  private _formatBook = (item: GoogleBookItem): Book => {
    return {
      googleBooksId: item.id,
      title: item.volumeInfo.title,
      subtitle: item.volumeInfo.subtitle,
      authors: item.volumeInfo.authors || [],
      publisher: item.volumeInfo.publisher,
      publishedDate: item.volumeInfo.publishedDate,
      description: item.volumeInfo.description,
      pageCount: item.volumeInfo.pageCount,
      categories: item.volumeInfo.categories || [],
      coverImageUrl: item.volumeInfo.imageLinks?.thumbnail,
    };
  };

  private _prepareBookForDatabase = (item: GoogleBookItem): Prisma.BookCreateInput => {
    const volumeInfo = item.volumeInfo;
    return {
      googleBooksId: item.id,
      title: volumeInfo.title,
      subtitle: volumeInfo.subtitle ?? null,
      authors: volumeInfo.authors || [],
      publisher: volumeInfo.publisher ?? null,
      publishedDate: volumeInfo.publishedDate ?? null,
      description: volumeInfo.description ?? null,
      pageCount: volumeInfo.pageCount ?? null,
      categories: volumeInfo.categories || [],
      coverImageUrl: volumeInfo.imageLinks?.thumbnail ?? null,
    };
};
}
