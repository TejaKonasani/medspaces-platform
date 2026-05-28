import { NextRequest } from 'next/server';
import { doctorSchema } from '@/lib/validations';
import { successResponse, errorResponse } from '@/lib/responses';
import { AppError } from '@/lib/errors';
import { doctorsRepository } from '@/lib/repositories';

export async function GET() {
  try {
    const doctors = await doctorsRepository.findMany();
    return successResponse(doctors);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = doctorSchema.parse(body);

    const existingDoctor = await doctorsRepository.findByEmail(validated.email);
    if (existingDoctor) {
      throw AppError.conflict('A doctor with this email is already registered');
    }

    const created = await doctorsRepository.create(validated);
    return successResponse(created, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
