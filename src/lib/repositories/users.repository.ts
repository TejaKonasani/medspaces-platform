import prisma from '@/lib/prisma';
import { AppError } from '@/lib/errors';
import type { AuthUser } from '@/lib/auth/types';
import bcrypt from 'bcryptjs';

type CreateUserData = {
  name: string;
  email: string;
  password: string;
  role: AuthUser['role'];
  phone?: string;
  specialty?: string;
  city?: string;
};

export class UsersRepository {
  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  async findByEmail(email: string): Promise<AuthUser | null> {
    try {
      const normalizedEmail = this.normalizeEmail(email);
      const u = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (!u) return null;
      return this.mapUser(u);
    } catch (err) {
      throw AppError.internal('Failed to fetch user');
    }
  }

  async findById(id: string): Promise<AuthUser | null> {
    try {
      const u = await prisma.user.findUnique({ where: { id } });
      if (!u) return null;
      return this.mapUser(u);
    } catch (err) {
      throw AppError.internal('Failed to fetch user');
    }
  }

  async createUser(data: CreateUserData): Promise<AuthUser> {
    try {
      const hash = await bcrypt.hash(data.password, 10);
      const normalizedEmail = this.normalizeEmail(data.email);
      const u = await prisma.user.create({ data: {
        name: data.name,
        email: normalizedEmail,
        passwordHash: hash,
        role: data.role,
        phone: data.phone,
        specialty: data.specialty,
        city: data.city,
      } });
      return this.mapUser(u);
    } catch (err: any) {
      if (err.code === 'P2002') throw AppError.conflict('User with this email already exists');
      throw AppError.internal('Failed to create user');
    }
  }

  async verifyPassword(email: string, password: string): Promise<boolean> {
    const normalizedEmail = this.normalizeEmail(email);
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) return false;
    return bcrypt.compare(password, user.passwordHash);
  }

  private mapUser(u: any): AuthUser {
    return {
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      phone: u.phone ?? null,
      specialty: u.specialty ?? null,
      city: u.city ?? null,
      createdAt: u.createdAt.toISOString(),
    };
  }
}

export const usersRepository = new UsersRepository();
