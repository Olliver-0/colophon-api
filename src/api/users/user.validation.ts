import { z } from 'zod';
import { BookshelfStatus } from '@prisma/client';

const bookshelfStatusValues = Object.values(BookshelfStatus) as [string, ...string[]];
const invalidStatusMessage = `status must be one of: ${bookshelfStatusValues.join(', ')}`;

const statusEnum = z.enum(bookshelfStatusValues, { error: invalidStatusMessage });

export const createBookshelfItemSchema = z.object({
  body: z.object({
    googleBooksId: z
      .string({ error: 'googleBooksId must be a string' })
      .min(1, { error: 'googleBooksId is required' }),
    status: statusEnum,
  }),
});

export const updateBookshelfItemSchema = z.object({
  params: z.object({
    itemId: z.string({ error: 'Item ID must be a string' }).min(1, { error: 'An itemId is required' }),
  }),
  body: z.object({
    status: statusEnum,
  }),
});
