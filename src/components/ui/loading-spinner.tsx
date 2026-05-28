import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

export function LoadingSpinner({ className, label = 'Loading' }: { className?: string; label?: string }) {
  return (
    <div className={cn('inline-flex items-center gap-2 text-gray-500', className)} aria-live="polite" aria-busy="true">
      <Loader2 className="h-5 w-5 animate-spin text-primary-600" aria-hidden="true" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
