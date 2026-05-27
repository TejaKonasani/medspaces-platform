import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'medspaces_session';

const PROTECTED_ROUTES: Record<string, string[]> = {
  '/admin': ['ADMIN'],
  '/dashboard': ['ADMIN', 'DOCTOR', 'CLINIC_OWNER'],
};

const AUTH_ROUTES = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  const isProtectedRoute = Object.keys(PROTECTED_ROUTES).some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  if (isProtectedRoute && !sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/login'],
};
