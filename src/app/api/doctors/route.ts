import { NextRequest } from 'next/server';
import { store } from '@/lib/store';
import { doctorSchema } from '@/lib/validations';
import { successResponse, errorResponse } from '@/lib/responses';
import { AppError } from '@/lib/errors';
import type { Doctor } from '@/types';

export async function GET() {
  try {
    const doctors = store.getAllDoctors();
    return successResponse(doctors);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = doctorSchema.parse(body);

    const existingDoctor = store.getDoctorByEmail(validated.email);
    if (existingDoctor) {
      throw AppError.conflict('A doctor with this email is already registered');
    }

    const doctor: Doctor = {
      ...validated,
      id: store.generateId(),
      experience: Number(validated.experience),
      createdAt: new Date().toISOString(),
    };

    const created = store.createDoctor(doctor);
    return successResponse(created, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
