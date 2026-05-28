import { NextRequest } from 'next/server';
import { requirePermission, Permission } from '@/lib/auth';
import { doctorModerationActionSchema } from '@/lib/validations';
import { successResponse, errorResponse } from '@/lib/responses';
import { AppError } from '@/lib/errors';
import { doctorsRepository } from '@/lib/repositories';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requirePermission(request, Permission.MANAGE_DOCTORS);

    const existing = await doctorsRepository.findById(params.id);
    if (!existing) {
      throw AppError.notFound(`Doctor with id '${params.id}' not found`);
    }

    const body = await request.json();
    const validated = doctorModerationActionSchema.parse(body);

    const updated = await doctorsRepository.moderateDoctor(params.id, validated.action);
    if (!updated) {
      throw AppError.notFound(`Doctor with id '${params.id}' not found`);
    }

    return successResponse(updated);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const doctor = await doctorsRepository.findById(params.id);
    if (!doctor) {
      throw AppError.notFound(`Doctor with id '${params.id}' not found`);
    }

    return successResponse(doctor);
  } catch (error) {
    return errorResponse(error);
  }
}
