import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/cn';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

const config: Record<AlertVariant, { wrapper: string; icon: ReactNode }> = {
  info: { wrapper: 'border-primary-200 bg-primary-50 text-primary-900', icon: <Info className="h-5 w-5 text-primary-600" /> },
  success: { wrapper: 'border-emerald-200 bg-emerald-50 text-emerald-900', icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" /> },
  warning: { wrapper: 'border-amber-200 bg-amber-50 text-amber-900', icon: <AlertTriangle className="h-5 w-5 text-amber-600" /> },
  error: { wrapper: 'border-red-200 bg-red-50 text-red-900', icon: <AlertCircle className="h-5 w-5 text-red-600" /> },
};

export function Alert({
  children,
  title,
  variant = 'info',
  action,
  className,
  live = variant === 'error' ? 'assertive' : 'polite',
}: {
  children: ReactNode;
  title?: string;
  variant?: AlertVariant;
  action?: ReactNode;
  className?: string;
  live?: 'assertive' | 'polite' | 'off';
}) {
  return (
    <div className={cn('flex gap-3 rounded-2xl border px-4 py-3 shadow-sm', config[variant].wrapper, className)} role={variant === 'error' ? 'alert' : 'status'} aria-live={live}>
      <div className="mt-0.5 shrink-0">{config[variant].icon}</div>
      <div className="min-w-0 flex-1">
        {title ? <p className="font-semibold leading-6">{title}</p> : null}
        <div className={cn('text-sm leading-6', title ? 'mt-1' : '')}>{children}</div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
