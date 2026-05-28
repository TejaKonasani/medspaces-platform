import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { AppError } from '@/lib/errors';
import type { InquiryActivity, InquiryActivityType, InquiryWorkflowStatus, PaginationMeta } from '@/types';

type InquiryActivityRow = Prisma.InquiryActivityGetPayload<{}>;

export interface InquiryActivityQueryResult {
  items: InquiryActivity[];
  meta: PaginationMeta;
}

export interface CreateInquiryActivityInput {
  inquiryId: string;
  actorUserId?: string;
  type: InquiryActivityType;
  title: string;
  description?: string;
  fromStatus?: InquiryWorkflowStatus;
  toStatus?: InquiryWorkflowStatus;
  metadata?: Record<string, unknown>;
}

export class InquiryActivitiesRepository {
  async create(input: CreateInquiryActivityInput): Promise<InquiryActivity> {
    try {
      const created = await prisma.inquiryActivity.create({
        data: {
          inquiryId: input.inquiryId,
          actorUserId: input.actorUserId,
          type: input.type,
          title: input.title,
          description: input.description,
          fromStatus: input.fromStatus,
          toStatus: input.toStatus,
          metadata: input.metadata as Prisma.InputJsonValue | undefined,
        },
      });

      return this.mapActivity(created);
    } catch {
      throw AppError.internal('Failed to create inquiry activity');
    }
  }

  async findByInquiryId(inquiryId: string, page = 1, limit = 20): Promise<InquiryActivityQueryResult> {
    try {
      const [total, rows] = await Promise.all([
        prisma.inquiryActivity.count({ where: { inquiryId } }),
        prisma.inquiryActivity.findMany({
          where: { inquiryId },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);

      return {
        items: rows.map((row) => this.mapActivity(row)),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.max(1, Math.ceil(total / limit)),
        },
      };
    } catch {
      throw AppError.internal('Failed to fetch inquiry activity');
    }
  }

  private mapActivity(row: InquiryActivityRow): InquiryActivity {
    return {
      id: row.id,
      inquiryId: row.inquiryId,
      actorUserId: row.actorUserId ?? undefined,
      type: row.type as InquiryActivityType,
      title: row.title,
      description: row.description ?? undefined,
      fromStatus: row.fromStatus as InquiryWorkflowStatus | undefined,
      toStatus: row.toStatus as InquiryWorkflowStatus | undefined,
      metadata: (row.metadata as Record<string, unknown> | null) ?? undefined,
      createdAt: row.createdAt.toISOString(),
    };
  }
}

export const inquiryActivitiesRepository = new InquiryActivitiesRepository();
