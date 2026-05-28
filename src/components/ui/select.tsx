'use client';

import { forwardRef, type SelectHTMLAttributes, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, label, hint, error, leftIcon, id, children, ...props },
  ref
) {
  const selectId = id || props.name;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700">
          {label}
          {props.required ? <span className="ml-1 text-red-500">*</span> : null}
        </label>
      )}
      <div className={cn('field-shell relative', error && 'border-red-300 focus-within:border-red-400 focus-within:shadow-red-100/70')}>
        {leftIcon ? (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">{leftIcon}</span>
        ) : null}
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
          aria-errormessage={error && selectId ? `${selectId}-error` : undefined}
          className={cn(
            'w-full appearance-none rounded-xl border-0 bg-transparent px-4 py-3 pr-10 text-gray-900 outline-none transition-colors focus:ring-0 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
            leftIcon ? 'pl-10' : undefined,
            error ? 'text-red-950' : undefined,
            className
          )}
          {...props}
        >
          {children}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
          <ChevronDown className="h-4 w-4" />
        </span>
      </div>
      {error ? (
        <p id={selectId ? `${selectId}-error` : undefined} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={selectId ? `${selectId}-hint` : undefined} className="text-sm text-gray-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
