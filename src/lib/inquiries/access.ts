import { UserRole, type AuthUser } from '@/lib/auth';
import type { InquiryDetail } from '@/types';

export function canUserAccessInquiry(user: AuthUser, inquiry: InquiryDetail): boolean {
  if (user.role === UserRole.ADMIN) {
    return true;
  }

  if (user.role === UserRole.DOCTOR) {
    return inquiry.createdByUserId === user.id || inquiry.email.toLowerCase() === user.email.toLowerCase();
  }

  if (user.role === UserRole.CLINIC_OWNER) {
    return inquiry.listing?.id !== undefined && inquiry.listingOwnerUserId === user.id;
  }

  return false;
}

export function canUserManageInquiry(user: AuthUser): boolean {
  return user.role === UserRole.ADMIN;
}
