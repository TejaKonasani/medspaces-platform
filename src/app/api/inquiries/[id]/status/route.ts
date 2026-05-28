import { NextRequest } from 'next/server';
import { requirePermission, Permission } from '@/lib/auth';
import { inquiryStatusSchema } from '@/lib/validations';
import { successResponse, errorResponse } from '@/lib/responses';
import { AppError } from '@/lib/errors';
import { notificationService } from '@/lib/notifications';
import { inquiriesRepository } from '@/lib/repositories';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requirePermission(request, Permission.MANAGE_INQUIRIES);
    const body = await request.json();
    const validated = inquiryStatusSchema.parse(body);
    const existing = await inquiriesRepository.findById(params.id);

    if (!existing) {
      throw AppError.notFound(`Inquiry with id '${params.id}' not found`);
    }

    const updated = await inquiriesRepository.updateStatus(params.id, validated.status, auth.user.id);
    if (!updated) {
      throw AppError.notFound(`Inquiry with id '${params.id}' not found`);
    }

    const notificationEvent = validated.status === 'MATCHED' ? 'INQUIRY_MATCHED' : validated.status === 'REJECTED' ? 'INQUIRY_REJECTED' : 'INQUIRY_STATUS_UPDATED';

    await notificationService.notifyInquiryEvent(
      notificationEvent,
      [{ email: updated.email, name: updated.doctorName }],
      {
        inquiry: updated,
        previousStatus: existing.status,
        nextStatus: updated.status,
        actorName: auth.user.name,
      }
    );

    return successResponse(updated);
  } catch (error) {
    return errorResponse(error);
  }
}
