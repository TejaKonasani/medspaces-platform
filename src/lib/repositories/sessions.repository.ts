import prisma from '@/lib/prisma';
import { AppError } from '@/lib/errors';
import type { UserRoleType } from '@/lib/auth/types';

export interface SessionPayload {
  token: string;
  userId: string;
  role?: UserRoleType;
  expiresAt: number; // ms timestamp
}

export interface SessionRecord {
  id: string;
  token: string;
  userId: string;
  role: UserRoleType;
  expiresAt: number;
  createdAt: number;
}

export class SessionsRepository {
  async set(token: string, payload: { userId: string; role?: string; expiresAt: number; createdAt?: number }): Promise<void> {
    try {
      await prisma.session.upsert({
        where: { token },
        update: { userId: payload.userId, expiresAt: new Date(payload.expiresAt) },
        create: { token, userId: payload.userId, expiresAt: new Date(payload.expiresAt) },
      });
    } catch (err) {
      throw AppError.internal('Failed to set session');
    }
  }

  async get(token: string): Promise<SessionRecord | null> {
    try {
      const s = await prisma.session.findUnique({
        where: { token },
        include: {
          user: {
            select: { role: true },
          },
        },
      });
      if (!s) return null;
      return {
        id: s.id,
        userId: s.userId,
        token: s.token,
        role: s.user.role,
        expiresAt: s.expiresAt.getTime(),
        createdAt: s.createdAt.getTime(),
      };
    } catch (err) {
      throw AppError.internal('Failed to get session');
    }
  }

  async delete(token: string): Promise<boolean> {
    try {
      await prisma.session.delete({ where: { token } });
      return true;
    } catch (err: any) {
      if (err.code === 'P2025') return false;
      throw AppError.internal('Failed to delete session');
    }
  }

  async getByUserId(userId: string) {
    try {
      const s = await prisma.session.findFirst({
        where: { userId },
        include: {
          user: {
            select: { role: true },
          },
        },
      });
      if (!s) return null;
      return {
        id: s.id,
        userId: s.userId,
        token: s.token,
        role: s.user.role,
        expiresAt: s.expiresAt.getTime(),
        createdAt: s.createdAt.getTime(),
      };
    } catch (err) {
      throw AppError.internal('Failed to get session by userId');
    }
  }

  async deleteByUserId(userId: string): Promise<void> {
    try {
      await prisma.session.deleteMany({ where: { userId } });
    } catch (err) {
      throw AppError.internal('Failed to delete sessions for user');
    }
  }

  async cleanup(): Promise<void> {
    try {
      await prisma.session.deleteMany({ where: { expiresAt: { lt: new Date() } } });
    } catch (err) {
      // don't throw; cleanup should be best-effort
      console.error('Session cleanup failed', err);
    }
  }
}

export const sessionsRepository = new SessionsRepository();
