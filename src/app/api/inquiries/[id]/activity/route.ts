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
      throw AppError.forbidden('You do not have permission to view this inquiry activity');
    }

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 20;
    const timeline = await inquiriesRepository.getActivityTimeline(params.id, page, limit);

    return successResponse(timeline.items, 200, timeline.meta);
  } catch (error) {
    return errorResponse(error);
  }
}
