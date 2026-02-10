import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth/auth';

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { pathname } = request.nextUrl;

  // If user is logged in and trying to access auth pages, redirect to home
  if (session?.user && (pathname === '/sign-in' || pathname === '/sign-up')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is not logged in and trying to access protected routes, redirect to sign-in
  if (!session?.user && pathname === '/') {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/sign-in', '/sign-up'],
};
