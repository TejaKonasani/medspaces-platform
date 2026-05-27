import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/responses';
import { AppError } from '@/lib/errors';
import { userStore } from '@/lib/auth/users';
import { createSession, setSessionCookie } from '@/lib/session';

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

    const user = userStore.authenticate(email.trim(), password);
    if (!user) {
      throw AppError.unauthorized('Invalid email or password');
    }

    const session = createSession(user);
    setSessionCookie(session.id);

    return successResponse({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      sessionId: session.id,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
