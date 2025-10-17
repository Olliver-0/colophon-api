import { z } from 'zod';

export const createBookshelfItemSchema = z.object({
  body: z.object({
    googleBooksId: z.string({
      error: () => 'googleBooksId is required and must be a string',
    }),
    status: z.string({
      error: () => 'status is required and must be a string',
    }),
  }),
});
