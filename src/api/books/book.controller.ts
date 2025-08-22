import { BookService } from "./book.service.js";
import { Request, Response } from 'express';
import { SearchBooksInput } from "./book.validation.js";

const bookService = new BookService();

export class BookController {
  public searchBooks = async (req: Request, res: Response) => {
    const { q } = req.query as SearchBooksInput['query'];

    const books = await bookService.search(q);

    return res.status(200).json({
      status: 'success',
      data: books,
    })
  };
}
