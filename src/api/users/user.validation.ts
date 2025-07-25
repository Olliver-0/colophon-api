import z from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string('Not a string').optional(),
    email: z.email({
      error: (issue) =>
        issue.input === undefined ? 'Email is required' : 'Invalid Format',
    }),
    password: z.string({
      error: (issue) => {
        if (issue.input === undefined) {
          return 'Password is requied.';
        }
        return 'Not a string';
      },
    }).min(8, 'The password must have at least 8 characters'),
  }),
});

export type CreatedUserInput = z.infer<typeof createUserSchema>;
