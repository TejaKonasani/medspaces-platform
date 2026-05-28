import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { AppError } from '@/lib/errors';
import type { AuthUser } from '@/lib/auth';
import { canTransitionInquiryStatus, getWorkflowTimestampField } from '@/lib/inquiries';
import type { Inquiry, InquiryActivity, InquiryDetail, InquiryListItem, InquiryWorkflowQueryParams, InquiryWorkflowStatus, PaginationMeta } from '@/types';
import { inquiryActivitiesRepository } from './inquiry-activities.repository';

type InquiryRow = Prisma.InquiryGetPayload<{
  include: {
    listing: {
      select: {
        id: true;
        clinicName: true;
        city: true;
        locality: true;
        ownerUserId: true;
      };
    };
  };
}>;

export interface InquiryWorkflowQueryResult {
  items: InquiryListItem[];
  meta: PaginationMeta;
}

export interface InquiryAccessScope {
  user: Pick<AuthUser, 'id' | 'email' | 'role'>;
}

export class InquiriesRepository {
  async findMany(): Promise<Inquiry[]> {
    const result = await this.findWorkflowPage({ page: 1, limit: 1000 });
    return result.items;
  }

  async findWorkflowPage(options: InquiryWorkflowQueryParams = {}, scope?: InquiryAccessScope): Promise<InquiryWorkflowQueryResult> {
    try {
      const page = options.page ?? 1;
      const limit = options.limit ?? 20;
      const where = this.buildWhere(options, scope);

      const [total, rows] = await Promise.all([
        prisma.inquiry.count({ where }),
        prisma.inquiry.findMany({
          where,
          include: {
            listing: {
              select: {
                id: true,
                clinicName: true,
                city: true,
                locality: true,
                ownerUserId: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);

      return {
        items: rows.map((row) => this.mapInquiry(row)),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.max(1, Math.ceil(total / limit)),
        },
      };
    } catch {
      throw AppError.internal('Failed to fetch inquiries');
    }
  }

  async findByStatus(status: InquiryWorkflowStatus, options: Omit<InquiryWorkflowQueryParams, 'status'> = {}, scope?: InquiryAccessScope): Promise<InquiryWorkflowQueryResult> {
    return this.findWorkflowPage({ ...options, status }, scope);
  }

  async findById(id: string, scope?: InquiryAccessScope): Promise<InquiryDetail | null> {
    try {
      const row = await prisma.inquiry.findFirst({
        where: {
          id,
          ...this.buildWhere({}, scope),
        },
        include: {
          listing: {
            select: {
              id: true,
              clinicName: true,
              city: true,
              locality: true,
              ownerUserId: true,
            },
          },
        },
      });

      if (!row) return null;
      return this.mapInquiry(row);
    } catch {
      throw AppError.internal('Failed to fetch inquiry');
    }
  }

  async create(data: Partial<Inquiry>, actorUserId?: string): Promise<InquiryDetail> {
    try {
      const created = await prisma.inquiry.create({
        data: {
          listingId: data.listingId ?? undefined,
          createdByUserId: actorUserId,
          doctorName: data.doctorName as string,
          specialty: data.specialty as string,
          email: data.email as string,
          phone: data.phone as string,
          message: data.message as string,
          status: data.status ?? 'NEW',
        },
        include: {
          listing: {
            select: {
              id: true,
              clinicName: true,
              city: true,
              locality: true,
              ownerUserId: true,
            },
          },
        },
      });

      await inquiryActivitiesRepository.create({
        inquiryId: created.id,
        actorUserId,
        type: 'INQUIRY_CREATED',
        title: 'Inquiry submitted',
        description: 'The inquiry was created and entered the workflow.',
        toStatus: created.status as InquiryWorkflowStatus,
      });

      return this.mapInquiry(created);
    } catch {
      throw AppError.internal('Failed to create inquiry');
    }
  }

  async updateStatus(id: string, nextStatus: InquiryWorkflowStatus, actorUserId: string): Promise<InquiryDetail | null> {
    try {
      const existing = await prisma.inquiry.findUnique({ where: { id } });
      if (!existing) return null;

      const currentStatus = existing.status as InquiryWorkflowStatus;
      if (!canTransitionInquiryStatus(currentStatus, nextStatus)) {
        throw AppError.badRequest(`Cannot move inquiry from ${currentStatus} to ${nextStatus}`);
      }

      const timestampField = getWorkflowTimestampField(nextStatus);
      const updated = await prisma.$transaction(async (tx) => {
        const data: Prisma.InquiryUpdateInput = {
          status: nextStatus,
        };

        if (timestampField) {
          data[timestampField] = new Date();
        }

        const inquiry = await tx.inquiry.update({
          where: { id },
          data,
          include: {
            listing: {
              select: {
                id: true,
                clinicName: true,
                city: true,
                locality: true,
                ownerUserId: true,
              },
            },
          },
        });

        await tx.inquiryActivity.create({
          data: {
            inquiryId: id,
            actorUserId,
            type: 'STATUS_CHANGED',
            title: 'Status updated',
            description: `Inquiry moved from ${currentStatus} to ${nextStatus}.`,
            fromStatus: currentStatus,
            toStatus: nextStatus,
          },
        });

        return inquiry;
      });

      return this.mapInquiry(updated);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw AppError.internal('Failed to update inquiry status');
    }
  }

  async addAdminNote(id: string, adminNotes: string, actorUserId: string): Promise<InquiryDetail | null> {
    try {
      const updated = await prisma.$transaction(async (tx) => {
        const inquiry = await tx.inquiry.update({
          where: { id },
          data: { adminNotes },
          include: {
            listing: {
              select: {
                id: true,
                clinicName: true,
                city: true,
                locality: true,
                ownerUserId: true,
              },
            },
          },
        });

        await tx.inquiryActivity.create({
          data: {
            inquiryId: id,
            actorUserId,
            type: 'ADMIN_NOTE_ADDED',
            title: 'Admin note added',
            description: adminNotes,
          },
        });

        return inquiry;
      });

      return this.mapInquiry(updated);
    } catch (error) {
      if (this.isPrismaNotFoundError(error)) return null;
      throw AppError.internal('Failed to update inquiry notes');
    }
  }

  async getActivityTimeline(id: string, page = 1, limit = 20): Promise<{ items: InquiryActivity[]; meta: PaginationMeta }> {
    return inquiryActivitiesRepository.findByInquiryId(id, page, limit);
  }

  async getInquiryById(id: string, scope?: InquiryAccessScope): Promise<InquiryDetail | null> {
    return this.findById(id, scope);
  }

  async createInquiry(data: Partial<Inquiry>, actorUserId?: string): Promise<InquiryDetail> {
    return this.create(data, actorUserId);
  }

  private buildWhere(options: InquiryWorkflowQueryParams, scope?: InquiryAccessScope): Prisma.InquiryWhereInput {
    const where: Prisma.InquiryWhereInput = {};
    const andFilters: Prisma.InquiryWhereInput[] = [];

    if (options.search) {
      const term = options.search.trim();
      where.OR = [
        { doctorName: { contains: term, mode: 'insensitive' } },
        { email: { contains: term, mode: 'insensitive' } },
        { specialty: { contains: term, mode: 'insensitive' } },
        { listing: { is: { clinicName: { contains: term, mode: 'insensitive' } } } },
      ];
    }

    if (options.status) {
      where.status = Array.isArray(options.status) ? { in: options.status } : options.status;
    }

    if (options.listingId) {
      where.listingId = options.listingId;
    }

    if (scope) {
      if (scope.user.role === 'DOCTOR') {
        andFilters.push(
          {
            OR: [
              { createdByUserId: scope.user.id },
              { email: { equals: scope.user.email, mode: 'insensitive' } },
            ],
          },
        );
      }

      if (scope.user.role === 'CLINIC_OWNER') {
        andFilters.push(
          {
            listing: {
              is: {
                ownerUserId: scope.user.id,
              },
            },
          },
        );
      }
    }

    if (andFilters.length > 0) {
      where.AND = andFilters;
    }

    return where;
  }

  private mapInquiry(row: InquiryRow): InquiryDetail {
    return {
      id: row.id,
      doctorName: row.doctorName,
      specialty: row.specialty,
      phone: row.phone,
      email: row.email,
      listingId: row.listingId ?? undefined,
      message: row.message,
      status: row.status as InquiryWorkflowStatus,
      adminNotes: row.adminNotes ?? undefined,
      createdByUserId: row.createdByUserId ?? undefined,
      contactedAt: row.contactedAt?.toISOString(),
      discussionStartedAt: row.discussionStartedAt?.toISOString(),
      matchedAt: row.matchedAt?.toISOString(),
      closedAt: row.closedAt?.toISOString(),
      rejectedAt: row.rejectedAt?.toISOString(),
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt?.toISOString(),
      listing: row.listing
        ? {
            id: row.listing.id,
            clinicName: row.listing.clinicName,
            city: row.listing.city,
            locality: row.listing.locality,
          }
        : undefined,
      listingOwnerUserId: row.listing?.ownerUserId ?? undefined,
    };
  }

  private isPrismaNotFoundError(err: unknown): boolean {
    return typeof err === 'object' && err !== null && 'code' in err && (err as { code?: string }).code === 'P2025';
  }
}

export const inquiriesRepository = new InquiriesRepository();
