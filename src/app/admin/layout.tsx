import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentSessionAsync } from '@/lib/session';
import { usersRepository } from '@/lib/repositories/users.repository';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getCurrentSessionAsync();

  if (!session) {
    redirect('/login?redirect=/admin');
  }

  const user = await usersRepository.findById(session.userId);

  if (!user) {
    redirect('/login?redirect=/admin');
  }

  if (user.role !== 'ADMIN') {
    redirect('/browse');
  }

  return children;
}