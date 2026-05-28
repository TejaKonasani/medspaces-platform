import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentSessionAsync } from '@/lib/session';
import { usersRepository } from '@/lib/repositories';
import { getLandingPathForRole } from '@/lib/auth/portal';

export default async function ClinicLayout({ children }: { children: ReactNode }) {
  const session = await getCurrentSessionAsync();

  if (!session) {
    redirect('/login?redirect=/clinic/dashboard');
  }

  const user = await usersRepository.findById(session.userId);

  if (!user) {
    redirect('/login?redirect=/clinic/dashboard');
  }

  if (user.role !== 'CLINIC_OWNER') {
    redirect(getLandingPathForRole(user.role));
  }

  return children;
}
