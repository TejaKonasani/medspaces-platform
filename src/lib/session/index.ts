import { cookies } from 'next/headers';
import type { Session, AuthUser } from '@/lib/auth/types';
import { sessionStore } from './store';
import { sessionsRepository } from '@/lib/repositories/sessions.repository';

const SESSION_COOKIE_NAME = 'medspaces_session';
const SESSION_ROLE_COOKIE_NAME = 'medspaces_role';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function generateSessionId(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function createSession(user: AuthUser): Session {
  const sessionId = generateSessionId();
  const session: Session = {
    id: sessionId,
    userId: user.id,
    role: user.role,
    expiresAt: Date.now() + SESSION_DURATION_MS,
    createdAt: Date.now(),
  };

  sessionStore.set(session.id, session);

  // Best-effort persistence for compatibility callers that still use the sync API.
  void sessionsRepository.set(sessionId, {
    userId: session.userId,
    role: session.role,
    expiresAt: session.expiresAt,
  });

  return session;
}

export async function createSessionAsync(user: AuthUser): Promise<Session> {
  const sessionId = generateSessionId();
  const session: Session = {
    id: sessionId,
    userId: user.id,
    role: user.role,
    expiresAt: Date.now() + SESSION_DURATION_MS,
    createdAt: Date.now(),
  };

  sessionStore.set(session.id, session);
  await sessionsRepository.set(session.id, {
    userId: session.userId,
    role: session.role,
    expiresAt: session.expiresAt,
  });

  return session;
}

export function getSession(sessionId: string): Session | null {
  const session = sessionStore.get(sessionId);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    sessionStore.delete(sessionId);
    void sessionsRepository.delete(sessionId);
    return null;
  }
  return session;
}

export async function deleteSession(sessionId: string): Promise<boolean> {
  const deleted = sessionStore.delete(sessionId);
  await sessionsRepository.delete(sessionId);
  return deleted;
}

export function setSessionCookie(sessionId: string): void {
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_MS / 1000,
  });
}

export function setSessionRoleCookie(role: AuthUser['role']): void {
  const cookieStore = cookies();
  cookieStore.set(SESSION_ROLE_COOKIE_NAME, role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_MS / 1000,
  });
}

export function getSessionCookie(): string | undefined {
  const cookieStore = cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

export function getSessionRoleCookie(): Session['role'] | undefined {
  const cookieStore = cookies();
  return cookieStore.get(SESSION_ROLE_COOKIE_NAME)?.value as Session['role'] | undefined;
}

export function clearSessionCookie(): void {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export function clearSessionRoleCookie(): void {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_ROLE_COOKIE_NAME);
}

export function getCurrentSession(): Session | null {
  const sessionId = getSessionCookie();
  if (!sessionId) return null;
  return getSession(sessionId);
}

export async function getSessionAsync(sessionId: string): Promise<Session | null> {
  const row = await sessionsRepository.get(sessionId);
  if (!row) return null;
  if (row.expiresAt < Date.now()) {
    sessionStore.delete(sessionId);
    await sessionsRepository.delete(sessionId);
    return null;
  }
  const session: Session = {
    id: row.token,
    userId: row.userId,
    role: row.role,
    expiresAt: row.expiresAt,
    createdAt: row.createdAt,
  };
  sessionStore.set(session.id, session);
  return session;
}

export async function getCurrentSessionAsync(): Promise<Session | null> {
  const sessionId = getSessionCookie();
  if (!sessionId) return null;
  return getSessionAsync(sessionId);
}

export { SESSION_COOKIE_NAME };
