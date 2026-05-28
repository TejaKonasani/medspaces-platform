import { NextRequest } from 'next/server';
import { errorResponse } from '@/lib/responses';
import { AppError } from '@/lib/errors';
import { getSessionAsync } from '@/lib/session';
import { usersRepository } from '@/lib/repositories/users.repository';
import { hasPermission } from './permissions';
import type { UserRoleType, AuthUser } from './types';
import type { PermissionType } from './permissions';

const SESSION_COOKIE_NAME = 'medspaces_session';

interface AuthenticatedRequest {
  user: AuthUser;
  sessionId: string;
}

export function getSessionFromRequest(request: NextRequest): string | null {
  return request.cookies.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function authenticateRequest(request: NextRequest): Promise<AuthenticatedRequest> {
  const sessionId = getSessionFromRequest(request);
  if (!sessionId) throw AppError.unauthorized('Authentication required');

  const session = await getSessionAsync(sessionId);
  if (!session) throw AppError.unauthorized('Session expired or invalid');

  const storedUser = await usersRepository.findById(session.userId);
  if (!storedUser) throw AppError.unauthorized('User not found');

  return { user: storedUser as any, sessionId: session.id };
}

export async function authenticateRequestOptional(request: NextRequest): Promise<AuthenticatedRequest | null> {
  const sessionId = getSessionFromRequest(request);
  if (!sessionId) return null;

  try {
    const session = await getSessionAsync(sessionId);
    if (!session) return null;

    const storedUser = await usersRepository.findById(session.userId);
    if (!storedUser) return null;

    return { user: storedUser as any, sessionId: session.id };
  } catch {
    return null;
  }
}

export async function requireRole(request: NextRequest, ...roles: UserRoleType[]) {
  const { user, sessionId } = await authenticateRequest(request);
  if (!roles.includes(user.role)) {
    throw AppError.forbidden(`Access denied. Required role: ${roles.join(' or ')}`);
  }
  return { user, sessionId };
}

export async function requirePermission(request: NextRequest, permission: PermissionType) {
  const { user, sessionId } = await authenticateRequest(request);
  if (!hasPermission(user.role, permission)) {
    throw AppError.forbidden('You do not have permission to perform this action');
  }
  return { user, sessionId };
}

export function withAuth(
  handler: (request: NextRequest, auth: AuthenticatedRequest) => Promise<Response>
) {
  return async (request: NextRequest) => {
    try {
      const auth = await authenticateRequest(request);
      return await handler(request, auth);
    } catch (error) {
      return errorResponse(error);
    }
  };
}

export function withRole(...roles: UserRoleType[]) {
  return (handler: (request: NextRequest, auth: AuthenticatedRequest) => Promise<Response>) => {
    return async (request: NextRequest) => {
      try {
        const auth = await requireRole(request, ...roles);
        return await handler(request, auth);
      } catch (error) {
        return errorResponse(error);
      }
    };
  };
}

export function withPermission(permission: PermissionType) {
  return (handler: (request: NextRequest, auth: AuthenticatedRequest) => Promise<Response>) => {
    return async (request: NextRequest) => {
      try {
        const auth = await requirePermission(request, permission);
        return await handler(request, auth);
      } catch (error) {
        return errorResponse(error);
      }
    };
  };
}
