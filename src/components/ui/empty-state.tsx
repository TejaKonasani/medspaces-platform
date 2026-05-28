import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('rounded-3xl border border-dashed border-gray-300 bg-white/95 px-6 py-12 text-center shadow-sm shadow-slate-900/5', className)}>
      {icon ? <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-gray-500">{icon}</div> : null}
      <h3 className="text-xl font-semibold text-gray-900 text-balance">{title}</h3>
      {description ? <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
