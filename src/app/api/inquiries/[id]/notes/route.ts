import { NextRequest } from 'next/server';
import { requirePermission, Permission } from '@/lib/auth';
import { inquiryAdminNoteSchema } from '@/lib/validations';
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
    const validated = inquiryAdminNoteSchema.parse(body);
    const updated = await inquiriesRepository.addAdminNote(params.id, validated.adminNotes, auth.user.id);

    if (!updated) {
      throw AppError.notFound(`Inquiry with id '${params.id}' not found`);
    }

    await notificationService.notifyInquiryEvent(
      'ADMIN_NOTE_ADDED',
      [{ email: updated.email, name: updated.doctorName }],
      { inquiry: updated, actorName: auth.user.name }
    );

    return successResponse(updated);
  } catch (error) {
    return errorResponse(error);
  }
}
