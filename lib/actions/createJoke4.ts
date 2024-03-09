'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/db';
import type { JokeSchemaErrorType } from '@/validations/jokeSchema';
import { jokeSchema } from '@/validations/jokeSchema';

type State = {
  success: boolean;
  errors?: JokeSchemaErrorType;
  message?: string;
};

export async function createJoke(_prevState: State, data: FormData) {
  const result = jokeSchema.safeParse({
    content: data.get('content')?.valueOf(),
    name: data.get('name')?.valueOf(),
  });

  if (!result.success) {
    revalidatePath('/jokes');
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
    revalidatePath('/jokes');
    return {
      message: 'SERVER ERROR',
      success: false,
    };
  }

  revalidatePath('/jokes');
  return {
    success: true,
  };
}
