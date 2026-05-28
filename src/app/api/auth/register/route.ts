import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/responses';
import { AppError } from '@/lib/errors';
import { registrationSchema } from '@/lib/validations/auth';
import { UserRole } from '@/lib/auth';
import { usersRepository } from '@/lib/repositories/users.repository';
import { doctorsRepository } from '@/lib/repositories/doctors.repository';
import { createSessionAsync, setSessionCookie, setSessionRoleCookie } from '@/lib/session';
import { sendWelcomeEmail } from '@/lib/notifications/welcome-email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = registrationSchema.parse(body);
    const normalizedEmail = validated.email.trim().toLowerCase();

    const existingUser = await usersRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      throw AppError.conflict('Email is already registered. Please sign in instead.');
    }

    if (validated.role === UserRole.DOCTOR) {
      const existingDoctor = await doctorsRepository.findByEmail(normalizedEmail);
      if (existingDoctor) {
        throw AppError.conflict('A doctor profile already exists for this email. Please sign in instead.');
      }
    }

    const createdUser = await usersRepository.createUser(
      validated.role === UserRole.DOCTOR
        ? {
            role: UserRole.DOCTOR,
            name: validated.name.trim(),
            email: normalizedEmail,
            password: validated.password,
            phone: validated.phone.trim(),
            specialty: validated.specialty.trim(),
          }
        : {
            role: UserRole.CLINIC_OWNER,
            name: validated.clinicName.trim(),
            email: normalizedEmail,
            password: validated.password,
            phone: validated.phone.trim(),
            city: validated.city.trim(),
          }
    );

    if (validated.role === UserRole.DOCTOR) {
      try {
        await doctorsRepository.createDoctor({
          fullName: validated.name.trim(),
          email: normalizedEmail,
          mobile: validated.phone.trim(),
          specialty: validated.specialty.trim(),
          qualification: 'Not provided',
          experience: 0,
          preferredLocations: [],
        });
      } catch (doctorError) {
        await prisma.user.delete({ where: { id: createdUser.id } });
        throw doctorError;
      }
    }

    const session = await createSessionAsync(createdUser);
    setSessionCookie(session.id);
    setSessionRoleCookie(createdUser.role);

    // Email is best-effort and must not block signup.
    void sendWelcomeEmail({
      email: createdUser.email,
      name: createdUser.name,
      role: createdUser.role,
    }).catch((emailError) => {
      console.error('Welcome email dispatch failed', emailError);
    });

    return successResponse({
      user: {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
        role: createdUser.role,
        phone: createdUser.phone ?? null,
        specialty: createdUser.specialty ?? null,
        city: createdUser.city ?? null,
      },
      sessionId: session.id,
    }, 201);
  } catch (error) {
    return errorResponse(error);
  }
}