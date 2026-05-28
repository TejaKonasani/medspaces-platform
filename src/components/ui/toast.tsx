'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/cn';

type ToastVariant = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (toast: Omit<ToastItem, 'id'>) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const icons: Record<ToastVariant, ReactNode> = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
  error: <AlertCircle className="h-5 w-5 text-red-600" />,
  info: <Info className="h-5 w-5 text-primary-600" />,
};

const styles: Record<ToastVariant, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-950',
  error: 'border-red-200 bg-red-50 text-red-950',
  info: 'border-primary-200 bg-primary-50 text-primary-950',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback<ToastContextValue['toast']>(({ title, description, variant }) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((current) => [...current, { id, title, description, variant }]);
    return id;
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;

    const timers = toasts.map((item) => window.setTimeout(() => dismiss(item.id), 4000));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [toasts, dismiss]);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" aria-atomic="false" className="pointer-events-none fixed right-4 top-4 z-[110] flex w-full max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={cn('pointer-events-auto rounded-2xl border p-4 shadow-lg backdrop-blur transition-all duration-200', styles[item.variant])}
            role={item.variant === 'error' ? 'alert' : 'status'}
            aria-live={item.variant === 'error' ? 'assertive' : 'polite'}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{icons[item.variant]}</div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-6">{item.title}</p>
                {item.description ? <p className="mt-1 text-sm leading-6 opacity-90">{item.description}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                className="rounded-full p-1 text-current/60 transition-colors hover:bg-black/5 hover:text-current"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return {
    toast: context.toast,
    success: (title: string, description?: string) => context.toast({ title, description, variant: 'success' }),
    error: (title: string, description?: string) => context.toast({ title, description, variant: 'error' }),
    info: (title: string, description?: string) => context.toast({ title, description, variant: 'info' }),
    dismiss: context.dismiss,
  };
}
