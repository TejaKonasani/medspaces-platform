import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AppError } from '@/lib/errors';
import type { ApiResponse, PaginationMeta } from '@/types';

export function successResponse<T>(
  data: T,
  status = 200,
  meta?: PaginationMeta
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    { success: true, data, ...(meta && { meta }) },
    { status }
  );
}

export function errorResponse(
  error: unknown
): NextResponse<ApiResponse> {
  if (error instanceof AppError) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    const fieldErrors: Record<string, string[]> = {};
    error.errors.forEach((err) => {
      const path = err.path.join('.');
      if (!fieldErrors[path]) fieldErrors[path] = [];
      fieldErrors[path].push(err.message);
    });

    return NextResponse.json(
      { success: false, error: 'Validation failed', errors: fieldErrors },
      { status: 422 }
    );
  }

  return NextResponse.json(
    { success: false, error: 'Internal server error' },
    { status: 500 }
  );
}
