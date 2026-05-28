import { UserRole, type UserRoleType } from './types';

export function getLandingPathForRole(role?: UserRoleType | null): string {
  switch (role) {
    case UserRole.ADMIN:
      return '/admin';
    case UserRole.DOCTOR:
      return '/doctor/dashboard';
    case UserRole.CLINIC_OWNER:
      return '/clinic/dashboard';
    default:
      return '/browse';
  }
}

export function isPortalPathAllowedForRole(role: UserRoleType | undefined, pathname: string): boolean {
  if (!role) return false;

  switch (role) {
    case UserRole.ADMIN:
      return pathname.startsWith('/admin');
    case UserRole.DOCTOR:
      return pathname.startsWith('/doctor');
    case UserRole.CLINIC_OWNER:
      return pathname.startsWith('/clinic');
    default:
      return false;
  }
}
