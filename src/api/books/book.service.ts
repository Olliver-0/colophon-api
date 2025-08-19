import config from '#/config/index.js';
import { AppError } from '#/utils/AppError.js';
import axios from 'axios';
import type { Book } from './book.types.js';

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
            maxResults: 20,
          },
        }
      );

      if (!response.data.items) {
        return [];
      }

      return response.data.items.map(this.formatBook);
    } catch (error) {
      console.error('Error searching books:', error);
      throw new AppError('Failed to fetch books from Google Books API.', 500);
    }
  };

  private formatBook = (item: GoogleBookItem): Book => {
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
}
