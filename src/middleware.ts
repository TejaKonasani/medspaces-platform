import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@/lib/auth';
import { getLandingPathForRole } from '@/lib/auth/portal';

const SESSION_COOKIE_NAME = 'medspaces_session';
const SESSION_ROLE_COOKIE_NAME = 'medspaces_role';

const AUTH_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const roleCookie = request.cookies.get(SESSION_ROLE_COOKIE_NAME)?.value;

  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const isDoctorRoute = pathname === '/doctor' || pathname.startsWith('/doctor/');
  const isClinicRoute = pathname === '/clinic' || pathname.startsWith('/clinic/');
  const isBrowseRoute = pathname === '/browse' || pathname.startsWith('/listing/');
  const isInquiryRoute = pathname === '/inquiry' || pathname.startsWith('/inquiry/');
  const isAddSpaceRoute = pathname === '/add-space' || pathname.startsWith('/add-space/');

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  if ((isAdminRoute || isDoctorRoute || isClinicRoute || isBrowseRoute || isInquiryRoute || isAddSpaceRoute) && !sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (roleCookie && isAdminRoute && roleCookie !== UserRole.ADMIN) {
    return NextResponse.redirect(new URL(getLandingPathForRole(roleCookie as any), request.url));
  }

  if (roleCookie && isDoctorRoute && roleCookie !== UserRole.DOCTOR) {
    return NextResponse.redirect(new URL(getLandingPathForRole(roleCookie as any), request.url));
  }

  if (roleCookie && isClinicRoute && roleCookie !== UserRole.CLINIC_OWNER) {
    return NextResponse.redirect(new URL(getLandingPathForRole(roleCookie as any), request.url));
  }

  if (roleCookie && isBrowseRoute && roleCookie !== UserRole.DOCTOR) {
    return NextResponse.redirect(new URL(getLandingPathForRole(roleCookie as any), request.url));
  }

  if (roleCookie && isInquiryRoute && roleCookie !== UserRole.DOCTOR) {
    return NextResponse.redirect(new URL(getLandingPathForRole(roleCookie as any), request.url));
  }

  if (roleCookie && isAddSpaceRoute && roleCookie !== UserRole.CLINIC_OWNER) {
    return NextResponse.redirect(new URL(getLandingPathForRole(roleCookie as any), request.url));
  }

  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL(getLandingPathForRole(roleCookie as any), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/doctor/:path*', '/clinic/:path*', '/browse/:path*', '/listing/:path*', '/inquiry/:path*', '/add-space/:path*', '/login', '/register'],
};
