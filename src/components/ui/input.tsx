'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, hint, error, leftIcon, rightSlot, id, ...props },
  ref
) {
  const inputId = id || props.name;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
          {props.required ? <span className="ml-1 text-red-500">*</span> : null}
        </label>
      )}
      <div className={cn('field-shell relative', error && 'border-red-300 focus-within:border-red-400 focus-within:shadow-red-100/70')}>
        {leftIcon ? (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">{leftIcon}</span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          aria-errormessage={error && inputId ? `${inputId}-error` : undefined}
          className={cn(
            'w-full rounded-xl border-0 bg-transparent px-4 py-3 text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:ring-0 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
            leftIcon ? 'pl-10' : undefined,
            rightSlot ? 'pr-10' : undefined,
            error ? 'text-red-950' : undefined,
            className
          )}
          {...props}
        />
        {rightSlot ? <span className="absolute inset-y-0 right-3 flex items-center">{rightSlot}</span> : null}
      </div>
      {error ? (
        <p id={inputId ? `${inputId}-error` : undefined} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={inputId ? `${inputId}-hint` : undefined} className="text-sm text-gray-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
