import { z } from 'zod';

export const searchBooksSchema = z.object({
  query: z.object({
    q: z.string().min(1, 'Search query is required'),
  }),
});

export type SearchBooksInput = z.infer<typeof searchBooksSchema>;
