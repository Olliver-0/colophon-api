export interface Book {
  googleBooksId: string;
  title: string;
  subtitle?: string;
  authors: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  categories: string[];
  coverImageUrl?: string;
}
