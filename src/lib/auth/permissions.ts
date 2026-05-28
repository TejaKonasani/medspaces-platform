import { UserRole, type UserRoleType } from './types';

export const Permission = {
  MANAGE_LISTINGS: 'MANAGE_LISTINGS',
  MANAGE_DOCTORS: 'MANAGE_DOCTORS',
  MANAGE_INQUIRIES: 'MANAGE_INQUIRIES',
  VIEW_LISTING_INQUIRIES: 'VIEW_LISTING_INQUIRIES',
  VIEW_ADMIN_DASHBOARD: 'VIEW_ADMIN_DASHBOARD',
  MANAGE_USERS: 'MANAGE_USERS',
  CREATE_LISTING: 'CREATE_LISTING',
  VIEW_OWN_LISTINGS: 'VIEW_OWN_LISTINGS',
  CREATE_INQUIRY: 'CREATE_INQUIRY',
  VIEW_OWN_INQUIRIES: 'VIEW_OWN_INQUIRIES',
  VIEW_OWN_PROFILE: 'VIEW_OWN_PROFILE',
  EDIT_OWN_PROFILE: 'EDIT_OWN_PROFILE',
} as const;

export type PermissionType = (typeof Permission)[keyof typeof Permission];

const ROLE_PERMISSIONS: Record<UserRoleType, PermissionType[]> = {
  [UserRole.ADMIN]: Object.values(Permission),
  [UserRole.DOCTOR]: [
    Permission.CREATE_INQUIRY,
    Permission.VIEW_OWN_INQUIRIES,
    Permission.VIEW_OWN_PROFILE,
    Permission.EDIT_OWN_PROFILE,
  ],
  [UserRole.CLINIC_OWNER]: [
    Permission.CREATE_LISTING,
    Permission.VIEW_OWN_LISTINGS,
    Permission.VIEW_LISTING_INQUIRIES,
    Permission.VIEW_OWN_PROFILE,
    Permission.EDIT_OWN_PROFILE,
  ],
};

export function hasPermission(role: UserRoleType, permission: PermissionType): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(role: UserRoleType, permissions: PermissionType[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function hasAllPermissions(role: UserRoleType, permissions: PermissionType[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

export function getPermissionsForRole(role: UserRoleType): PermissionType[] {
  return ROLE_PERMISSIONS[role] ?? [];
}
