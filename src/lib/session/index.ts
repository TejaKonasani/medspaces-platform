import { cookies } from 'next/headers';
import type { Session, AuthUser } from '@/lib/auth/types';
import { sessionStore } from './store';

const SESSION_COOKIE_NAME = 'medspaces_session';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function generateSessionId(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function createSession(user: AuthUser): Session {
  const session: Session = {
    id: generateSessionId(),
    userId: user.id,
    role: user.role,
    expiresAt: Date.now() + SESSION_DURATION_MS,
    createdAt: Date.now(),
  };
  sessionStore.set(session.id, session);
  return session;
}

export function getSession(sessionId: string): Session | null {
  const session = sessionStore.get(sessionId);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    sessionStore.delete(sessionId);
    return null;
  }
  return session;
}

export function deleteSession(sessionId: string): boolean {
  return sessionStore.delete(sessionId);
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

export function getSessionCookie(): string | undefined {
  const cookieStore = cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

export function clearSessionCookie(): void {
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export function getCurrentSession(): Session | null {
  const sessionId = getSessionCookie();
  if (!sessionId) return null;
  return getSession(sessionId);
}

export { SESSION_COOKIE_NAME };
