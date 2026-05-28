import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type BadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'outline';

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'bg-gray-100 text-gray-700',
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
  danger: 'bg-red-50 text-red-700 ring-1 ring-red-100',
  info: 'bg-primary-50 text-primary-700 ring-1 ring-primary-100',
  outline: 'border border-gray-200 text-gray-700',
};

export function Badge({
  children,
  variant = 'neutral',
  className,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', variantClasses[variant], className)}>{children}</span>;
}
