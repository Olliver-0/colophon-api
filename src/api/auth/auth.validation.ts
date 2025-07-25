import z from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string('Not a string').optional(),
    email: z.email({
      error: (issue) => {
        if (issue.input === undefined) return 'Email is required';
        if (typeof issue.input !== 'string') return 'Not a string';
        return 'Invalid Format'
      },
    }),
    password: z.string({
      error: (issue) => 
          issue.input === undefined ? 'Password is required' : 'Not a String',
    }).min(8, 'The password must have at least 8 characters'),
  }),
});

export const authenticateUserSchema = z.object({
  body: z.object({
    email: z.email({
      error: (issue) => {
        if (issue.input === undefined) return 'Email is required';
        if (typeof issue.input !== 'string') return 'Not a string';
        return 'Invalid Format'
      },
    }),
    password: z.string({
      error: (issue) =>
        issue.input == undefined ? 'Password is required' : 'Not a String'
    }),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type AuthenticateUserInput = z.infer<typeof authenticateUserSchema>;
