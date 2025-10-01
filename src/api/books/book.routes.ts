import { Router } from "express";
import { BookController } from "./book.controller.js";
import { validate } from "#/middlewares/validate.middleware.js";
import { searchBooksSchema } from "./book.validation.js";

const router = Router();
const bookControler = new BookController();

router.get('/search', validate(searchBooksSchema), bookControler.searchBooks);

export default router;
