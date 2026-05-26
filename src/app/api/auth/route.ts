import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/responses';
import { AppError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      throw AppError.badRequest('Email and password are required');
    }

    // Placeholder: auth will be implemented with a proper provider
    return successResponse({
      message: 'Auth endpoint ready. Integration pending.',
      token: null,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function GET() {
  return successResponse({
    message: 'Auth service operational',
    providers: ['credentials'],
    status: 'placeholder',
  });
}
