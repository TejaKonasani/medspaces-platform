import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/responses';
import { AppError } from '@/lib/errors';
import { createSessionAsync, setSessionCookie, setSessionRoleCookie } from '@/lib/session';
import { usersRepository } from '@/lib/repositories/users.repository';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      throw AppError.badRequest('Email and password are required');
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      throw AppError.badRequest('Invalid credentials format');
    }

    const stored = await usersRepository.findByEmail(email.trim());
    if (!stored) throw AppError.unauthorized('Invalid email or password');

    const valid = await usersRepository.verifyPassword(email.trim(), password);
    if (!valid) throw AppError.unauthorized('Invalid email or password');

    const session = await createSessionAsync(stored);
    setSessionCookie(session.id);
    setSessionRoleCookie(stored.role);

    return successResponse({
      user: {
        id: stored.id,
        email: stored.email,
        name: stored.name,
        role: stored.role,
      },
      sessionId: session.id,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function GET() {
  return successResponse({
    message: 'Auth service operational',
    providers: ['credentials'],
    endpoints: {
      login: '/api/auth/login',
      logout: '/api/auth/logout',
      me: '/api/auth/me',
    },
  });
}
