import { UserRole, type AuthUser } from './types';

interface StoredUser extends AuthUser {
  passwordHash: string;
}

class UserStore {
  private users: Map<string, StoredUser> = new Map();

  constructor() {
    this.seed();
  }

  private seed(): void {
    const seedUsers: StoredUser[] = [
      {
        id: 'admin-001',
        email: 'admin@medspaces.in',
        name: 'MedSpaces Admin',
        role: UserRole.ADMIN,
        passwordHash: this.hashPassword('MedAdmin@2024!'),
        createdAt: '2024-01-01T00:00:00.000Z',
      },
      {
        id: 'doctor-001',
        email: 'doctor@medspaces.in',
        name: 'Dr. Sneha Patel',
        role: UserRole.DOCTOR,
        passwordHash: this.hashPassword('Doctor@2024!'),
        createdAt: '2024-02-15T00:00:00.000Z',
      },
      {
        id: 'clinic-001',
        email: 'clinic@medspaces.in',
        name: 'LifeCare Clinic Admin',
        role: UserRole.CLINIC_OWNER,
        passwordHash: this.hashPassword('Clinic@2024!'),
        createdAt: '2024-02-01T00:00:00.000Z',
      },
    ];

    seedUsers.forEach((user) => this.users.set(user.id, user));
  }

  private hashPassword(password: string): string {
    // Simple hash for temporary store — will be replaced with bcrypt when DB is integrated
    let hash = 0;
    const salt = 'medspaces_salt_v1';
    const salted = salt + password;
    for (let i = 0; i < salted.length; i++) {
      const char = salted.charCodeAt(i);
      hash = ((hash << 5) - hash + char) | 0;
    }
    return `temp_hash_${Math.abs(hash).toString(36)}`;
  }

  verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash;
  }

  findByEmail(email: string): StoredUser | undefined {
    return Array.from(this.users.values()).find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
  }

  findById(id: string): StoredUser | undefined {
    return this.users.get(id);
  }

  getPublicUser(user: StoredUser): AuthUser {
    const { passwordHash: _, ...publicUser } = user;
    return publicUser;
  }

  authenticate(email: string, password: string): AuthUser | null {
    const user = this.findByEmail(email);
    if (!user) return null;
    if (!this.verifyPassword(password, user.passwordHash)) return null;
    return this.getPublicUser(user);
  }

  createUser(data: Omit<AuthUser, 'id' | 'createdAt'> & { password: string }): AuthUser {
    const id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const stored: StoredUser = {
      id,
      email: data.email,
      name: data.name,
      role: data.role,
      passwordHash: this.hashPassword(data.password),
      createdAt: new Date().toISOString(),
    };
    this.users.set(id, stored);
    return this.getPublicUser(stored);
  }
}

export const userStore = new UserStore();
