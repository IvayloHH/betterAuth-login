'use server';

import { signInSchema, signUpSchema } from '@/validations/validations';
import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';

export async function signInAction(formData: FormData) {
  try {
    const validationResult = signInSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (!validationResult.success) {
      return {
        error: {
          message: 'Please fix the errors below',
          fields: validationResult.error.flatten().fieldErrors,
        },
      };
    }

    const response = await auth.api.signInEmail({
      body: validationResult.data,
      headers: await headers(),
    });

    return response;
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      error: {
        message:
          error instanceof Error
            ? error.message
            : 'An error occurred during sign in. Please try again.',
      },
    };
  }
}

export async function signUpAction(formData: FormData) {
  try {
    const validationResult = signUpSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (!validationResult.success) {
      return {
        error: {
          message: 'Please fix the errors below',
          fields: validationResult.error.flatten().fieldErrors,
        },
      };
    }
    const response = await auth.api.signUpEmail({
      body: validationResult.data,
      headers: await headers(),
    });

    return response;
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      error: {
        message:
          error instanceof Error
            ? error.message
            : 'An error occurred during sign up. Please try again.',
      },
    };
  }
}

export async function signOutAction() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });

    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return {
      error: {
        message:
          error instanceof Error
            ? error.message
            : 'An error occurred during sign out. Please try again.',
      },
    };
  }
}
