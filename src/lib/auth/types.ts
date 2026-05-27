export const UserRole = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  CLINIC_OWNER: 'CLINIC_OWNER',
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRoleType;
  createdAt: string;
}

export interface Session {
  id: string;
  userId: string;
  role: UserRoleType;
  expiresAt: number;
  createdAt: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<AuthUser, 'createdAt'>;
  sessionId: string;
}
