import type { Session } from '@/lib/auth/types';

class SessionStore {
  private sessions: Map<string, Session> = new Map();

  set(id: string, session: Session): void {
    this.sessions.set(id, session);
  }

  get(id: string): Session | undefined {
    return this.sessions.get(id);
  }

  delete(id: string): boolean {
    return this.sessions.delete(id);
  }

  getByUserId(userId: string): Session | undefined {
    return Array.from(this.sessions.values()).find((s) => s.userId === userId);
  }

  deleteByUserId(userId: string): void {
    for (const [id, session] of this.sessions.entries()) {
      if (session.userId === userId) {
        this.sessions.delete(id);
      }
    }
  }

  cleanup(): void {
    const now = Date.now();
    for (const [id, session] of this.sessions.entries()) {
      if (session.expiresAt < now) {
        this.sessions.delete(id);
      }
    }
  }
}

export const sessionStore = new SessionStore();
