'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInAction, signUpAction } from '@/lib/actions/auth-actions';

type AuthFormProps = {
  type: 'sign-in' | 'sign-up';
  callbackUrl?: string;
};

type FormState = {
  error?: {
    message: string;
    fields?: Record<string, string[]>;
  };
  success?: boolean;
};

export function AuthForm({ type, callbackUrl }: AuthFormProps) {
  const isSignIn = type === 'sign-in';
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<FormState>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = isSignIn
        ? await signInAction(formData)
        : await signUpAction(formData);

      if ('error' in result && result.error) {
        setState({ error: result.error });
      } else {
        setState({ success: true });
        if (isSignIn) {
          router.push(callbackUrl || '/');
          router.refresh();
        }
      }
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {isSignIn ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            {isSignIn
              ? 'Enter your email to sign in to your account'
              : 'Enter your information to create an account'}
          </p>
        </div>

        {state.error?.message && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
            {state.error.message}
          </div>
        )}

        {!isSignIn && state.success ? (
          <div className="space-y-6">
            <div className="rounded-lg border border-green-200 bg-green-50 p-6 space-y-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mx-auto">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-green-900">
                  Account created successfully!
                </h3>
                <p className="text-sm text-green-800">
                  You can now sign in with your credentials.
                </p>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/sign-in"
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Go to sign in →
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {!isSignIn && (
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  disabled={isPending}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                {state.error?.fields?.name && (
                  <p className="text-sm text-red-600">
                    {state.error.fields.name[0]}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                disabled={isPending}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {state.error?.fields?.email && (
                <p className="text-sm text-red-600">
                  {state.error.fields.email[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                {isSignIn && (
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <input
                id="password"
                name="password"
                type="password"
                disabled={isPending}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {state.error?.fields?.password && (
                <p className="text-sm text-red-600">
                  {state.error.fields.password[0]}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isPending
                ? 'Loading...'
                : isSignIn
                  ? 'Sign in'
                  : 'Create account'}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Continue with Google
            </button>

            <div className="text-center text-sm text-gray-600">
              {isSignIn
                ? "Don't have an account? "
                : 'Already have an account? '}
              <Link
                href={isSignIn ? '/sign-up' : '/sign-in'}
                className="text-blue-600 hover:underline font-medium"
              >
                {isSignIn ? 'Sign up' : 'Sign in'}
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
