import { NextRequest } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { canUserAccessInquiry } from '@/lib/inquiries/access';
import { successResponse, errorResponse } from '@/lib/responses';
import { AppError } from '@/lib/errors';
import { inquiriesRepository } from '@/lib/repositories';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(request);
    const inquiry = await inquiriesRepository.findById(params.id);

    if (!inquiry) {
      throw AppError.notFound(`Inquiry with id '${params.id}' not found`);
    }

    if (!canUserAccessInquiry(auth.user, inquiry)) {
      throw AppError.forbidden('You do not have permission to view this inquiry');
    }

    return successResponse(inquiry);
  } catch (error) {
    return errorResponse(error);
  }
}
