'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/db';
import { slow } from '@/utils/slow';
import type { JokeSchemaErrorType } from '@/validations/jokeSchema';
import { jokeSchema } from '@/validations/jokeSchema';

type State = {
  success: boolean;
  errors?: JokeSchemaErrorType;
  message?: string;
};

export async function createJoke(_prevState: State, data: FormData) {
  await slow();

  const result = jokeSchema.safeParse({
    content: data.get('content'),
    name: data.get('name'),
  });

  if (!result.success) {
    return {
      errors: result.error.formErrors,
      message: 'VALIDATION ERROR',
      success: false,
    };
  }

  try {
    await prisma.joke.create({
      data: result.data,
    });
  } catch (e) {
    return {
      message: 'SERVER ERROR',
      success: false,
    };
  }

  revalidatePath('/jokes');
  return {
    errors: undefined,
    success: true,
  };
}
