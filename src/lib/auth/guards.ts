import { NextRequest } from 'next/server';
import { errorResponse } from '@/lib/responses';
import { AppError } from '@/lib/errors';
import { getSession } from '@/lib/session';
import { userStore } from './users';
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

export function authenticateRequest(request: NextRequest): AuthenticatedRequest {
  const sessionId = getSessionFromRequest(request);
  if (!sessionId) {
    throw AppError.unauthorized('Authentication required');
  }

  const session = getSession(sessionId);
  if (!session) {
    throw AppError.unauthorized('Session expired or invalid');
  }

  const storedUser = userStore.findById(session.userId);
  if (!storedUser) {
    throw AppError.unauthorized('User not found');
  }

  return {
    user: userStore.getPublicUser(storedUser),
    sessionId: session.id,
  };
}

export function requireRole(request: NextRequest, ...roles: UserRoleType[]) {
  const { user, sessionId } = authenticateRequest(request);
  if (!roles.includes(user.role)) {
    throw AppError.forbidden(`Access denied. Required role: ${roles.join(' or ')}`);
  }
  return { user, sessionId };
}

export function requirePermission(request: NextRequest, permission: PermissionType) {
  const { user, sessionId } = authenticateRequest(request);
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
      const auth = authenticateRequest(request);
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
        const auth = requireRole(request, ...roles);
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
        const auth = requirePermission(request, permission);
        return await handler(request, auth);
      } catch (error) {
        return errorResponse(error);
      }
    };
  };
}
