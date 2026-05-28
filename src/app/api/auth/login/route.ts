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

    const user = stored;
    const session = await createSessionAsync(user);
    setSessionCookie(session.id);
    setSessionRoleCookie(user.role);

    return successResponse({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone ?? null,
        specialty: user.specialty ?? null,
        city: user.city ?? null,
      },
      sessionId: session.id,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
