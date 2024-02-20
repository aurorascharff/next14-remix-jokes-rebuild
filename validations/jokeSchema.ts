import { z } from 'zod';

export const jokeSchema = z.object({
  content: z.string().min(5, {
    message: 'Content must be at least 5 characters long',
  }),
  id: z.string().optional(),
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters long',
  }),
});

export type JokeSchemaType = z.infer<typeof jokeSchema>;

export type JokeSchemaErrorType = z.inferFlattenedErrors<typeof jokeSchema>;
