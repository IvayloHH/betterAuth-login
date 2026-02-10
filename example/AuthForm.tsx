'use client';

import { useActionState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInAction, signUpAction } from '@/lib/actions/auth-actions';
import GoogleSignInButton from './GoogleSignInButton';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import FacebookSignInButton from './FacebookSignInButton';

type AuthFormProps = {
  type: 'sign-in' | 'sign-up';
  callbackUrl?: string;
};

const AuthForm = ({ type, callbackUrl }: AuthFormProps) => {
  const isSignIn = type === 'sign-in';
  const router = useRouter();

  const [state, action, isPending] = useActionState(
    isSignIn ? signInAction : signUpAction,
    { success: false }
  );

  useEffect(() => {
    if (state.success) {
      if (isSignIn) {
        toast.success(state.message);
        // Redirect to callback URL if provided, otherwise homepage
        router.push(callbackUrl || '/');
      }
      // For sign-up, don't redirect - show success message on same page
    } else if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state, router, isSignIn, callbackUrl]);

  return (
    <div className="relative flex min-h-screen items-center justify-center">
      {/* Background Image */}
      <Image
        src="/login3.jpg"
        alt="Фонова снимка"
        fill
        priority
        className="object-cover"
        quality={85}
      />

      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Form Container */}
      <div className="relative z-10 w-full px-4 md:px-6">
        <div className="mx-auto w-full max-w-xl space-y-6 rounded-2xl bg-white p-6 shadow-2xl md:p-8 xl:p-10">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold md:text-3xl xl:text-4xl">
              {isSignIn ? 'Вход' : 'Регистрация'}
            </h1>
            <p className="text-sm text-zinc-600 md:text-base">
              {isSignIn
                ? 'Въведете вашия имейл за вход в профила'
                : 'Въведете вашите данни за създаване на профил'}
            </p>
          </div>

          {state.message && !state.success && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {state.message}
            </div>
          )}

          {/* Show success message after sign-up */}
          {!isSignIn && state.success && state.message ? (
            <div className="space-y-6">
              <div className="rounded-lg bg-green-50 border border-green-200 p-6 space-y-4">
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
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold text-green-900">
                    Акаунтът е създаден успешно!
                  </h3>
                  <p className="text-sm text-green-800">
                    Изпратихме ви имейл с линк за потвърждение. Моля, проверете пощенската си кутия
                    и кликнете върху линка, за да активирате акаунта си.
                  </p>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Не сте получили имейл? Проверете спам папката или{' '}
                  <button
                    onClick={() => window.location.reload()}
                    className="text-primary hover:underline font-medium"
                  >
                    опитайте отново
                  </button>
                </p>
                <Link
                  href="/sign-in"
                  className="inline-block text-sm text-primary hover:underline font-medium"
                >
                  Вече потвърдихте? Влезте в профила си →
                </Link>
              </div>
            </div>
          ) : (
            <form action={action} className="space-y-4" noValidate>
            {!isSignIn && (
              <div className="space-y-2">
                <Label htmlFor="name">Име</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Иван Иванов"
                  disabled={isPending}
                  required
                />
                {state.fieldErrors?.name && (
                  <p className="text-sm text-destructive">
                    {state.fieldErrors.name[0]}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Имейл</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="иван@example.com"
                disabled={isPending}
                required
              />
              {state.fieldErrors?.email && (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.email[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Парола</Label>
                {isSignIn && (
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Забравена парола?
                  </Link>
                )}
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                disabled={isPending}
                required
              />
              {state.fieldErrors?.password && (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.password[0]}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="outline"
              className="w-full cursor-pointer bg-zinc-50 border-zinc-200 text-sm hover:bg-card hover:border-orange-200 md:text-bas py-5"
              disabled={isPending}
            >
              {isPending ? 'Зареждане...' : isSignIn ? 'Вход' : 'Създай профил'}
            </Button>
          </form>
          )}

          {/* Only show social buttons and sign-in link if NOT showing success message */}
          {!((!isSignIn && state.success && state.message)) && (
            <>
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-zinc-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-zinc-500 font-medium">
                    Или продължете с
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <GoogleSignInButton callbackUrl={callbackUrl} />
                <FacebookSignInButton callbackUrl={callbackUrl} />
              </div>

              <p className="text-center text-sm text-muted-foreground">
                {isSignIn ? 'Нямате профил? ' : 'Вече имате профил? '}
                <Link
                  href={isSignIn ? '/sign-up' : '/sign-in'}
                  className="font-medium underline"
                >
                  {isSignIn ? 'Регистрация' : 'Вход'}
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
