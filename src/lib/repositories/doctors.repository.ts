import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { AppError } from '@/lib/errors';
import type { Doctor } from '@/types';

type DoctorRow = Prisma.DoctorGetPayload<{}>;
type DoctorModerationAction = 'VERIFY' | 'DEACTIVATE' | 'ACTIVATE';

export class DoctorsRepository {
  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  async findMany(): Promise<Doctor[]> {
    try {
      const rows = await prisma.doctor.findMany({ orderBy: { createdAt: 'asc' } });
      return rows.map((row) => this.mapDoctor(row));
    } catch (err) {
      throw AppError.internal('Failed to fetch doctors');
    }
  }

  async findById(id: string): Promise<Doctor | null> {
    try {
      const row = await prisma.doctor.findUnique({ where: { id } });
      if (!row) return null;
      return this.mapDoctor(row);
    } catch (err) {
      throw AppError.internal('Failed to fetch doctor');
    }
  }

  async findByEmail(email: string): Promise<Doctor | null> {
    try {
      const row = await prisma.doctor.findUnique({ where: { email: this.normalizeEmail(email) } });
      if (!row) return null;
      return this.mapDoctor(row);
    } catch (err) {
      throw AppError.internal('Failed to fetch doctor');
    }
  }

  async create(data: Partial<Doctor>): Promise<Doctor> {
    try {
      const created = await prisma.doctor.create({
        data: {
          fullName: data.fullName as string,
          email: this.normalizeEmail(data.email as string),
          phone: data.mobile as string,
          specialty: data.specialty as string,
          experience: Number(data.experience ?? 0),
          qualification: data.qualification as string,
          preferredLocations: data.preferredLocations ?? [],
          consultingTimes: data.consultingTimes,
          practiceModel: data.practiceModel,
          website: data.website,
          linkedin: data.linkedin,
          affiliations: data.affiliations,
        },
      });

      return this.mapDoctor(created);
    } catch (err) {
      if (this.isPrismaUniqueError(err)) throw AppError.conflict('Doctor with this email already exists');
      throw AppError.internal('Failed to create doctor');
    }
  }

  async update(id: string, data: Partial<Doctor>): Promise<Doctor | null> {
    try {
      const updated = await prisma.doctor.update({
        where: { id },
        data: {
          fullName: data.fullName,
          email: data.email,
          phone: data.mobile,
          specialty: data.specialty,
          status: data.status,
          experience: data.experience,
          qualification: data.qualification,
          preferredLocations: data.preferredLocations,
          consultingTimes: data.consultingTimes,
          practiceModel: data.practiceModel,
          website: data.website,
          linkedin: data.linkedin,
          affiliations: data.affiliations,
        },
      });
      return this.mapDoctor(updated);
    } catch (err) {
      if (this.isPrismaNotFoundError(err)) return null;
      if (this.isPrismaUniqueError(err)) throw AppError.conflict('Doctor with this email already exists');
      throw AppError.internal('Failed to create doctor');
    }
  }

  async getAllDoctors(): Promise<Doctor[]> {
    return this.findMany();
  }

  async getDoctorByEmail(email: string): Promise<Doctor | null> {
    return this.findByEmail(email);
  }

  async createDoctor(data: Partial<Doctor>): Promise<Doctor> {
    return this.create(data);
  }

  async moderateDoctor(id: string, action: DoctorModerationAction): Promise<Doctor | null> {
    try {
      const status = action === 'DEACTIVATE' ? 'INACTIVE' : 'VERIFIED';
      const updated = await prisma.doctor.update({
        where: { id },
        data: { status },
      });

      return this.mapDoctor(updated);
    } catch (err) {
      if (this.isPrismaNotFoundError(err)) return null;
      throw AppError.internal('Failed to update doctor moderation');
    }
  }

  private mapDoctor(row: DoctorRow): Doctor {
    return {
      id: row.id,
      fullName: row.fullName,
      mobile: row.phone,
      email: row.email,
      qualification: row.qualification,
      specialty: row.specialty,
      status: row.status as Doctor['status'],
      subSpecialty: row.subSpecialty ?? undefined,
      registrationNumber: row.registrationNumber ?? '',
      experience: row.experience,
      preferredLocations: row.preferredLocations ?? [],
      consultingTimes: row.consultingTimes ?? undefined,
      practiceModel: row.practiceModel ?? undefined,
      website: row.website ?? undefined,
      linkedin: row.linkedin ?? undefined,
      affiliations: row.affiliations ?? undefined,
      createdAt: row.createdAt.toISOString(),
    };
  }

  private isPrismaUniqueError(err: unknown): boolean {
    return typeof err === 'object' && err !== null && 'code' in err && (err as { code?: string }).code === 'P2002';
  }

  private isPrismaNotFoundError(err: unknown): boolean {
    return typeof err === 'object' && err !== null && 'code' in err && (err as { code?: string }).code === 'P2025';
  }
}

export const doctorsRepository = new DoctorsRepository();
