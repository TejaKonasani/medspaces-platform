'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, label, hint, error, id, ...props },
  ref
) {
  const textareaId = id || props.name;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700">
          {label}
          {props.required ? <span className="ml-1 text-red-500">*</span> : null}
        </label>
      )}
      <div className={cn('field-shell', error && 'border-red-300 focus-within:border-red-400 focus-within:shadow-red-100/70')}>
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
          aria-errormessage={error && textareaId ? `${textareaId}-error` : undefined}
          className={cn(
            'w-full rounded-xl border-0 bg-transparent px-4 py-3 text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:ring-0 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
            error ? 'text-red-950' : undefined,
            className
          )}
          {...props}
        />
      </div>
      {error ? (
        <p id={textareaId ? `${textareaId}-error` : undefined} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={textareaId ? `${textareaId}-hint` : undefined} className="text-sm text-gray-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
