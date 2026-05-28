import { NextRequest } from 'next/server';
import { authenticateRequest, authenticateRequestOptional } from '@/lib/auth';
import { inquirySchema, inquiryWorkflowQuerySchema } from '@/lib/validations';
import { successResponse, errorResponse } from '@/lib/responses';
import { AppError } from '@/lib/errors';
import { notificationService } from '@/lib/notifications';
import { inquiriesRepository, listingsRepository } from '@/lib/repositories';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    const url = new URL(request.url);
    const validated = inquiryWorkflowQuerySchema.parse({
      page: url.searchParams.get('page') ?? undefined,
      limit: url.searchParams.get('limit') ?? undefined,
      search: url.searchParams.get('search') ?? undefined,
      listingId: url.searchParams.get('listingId') ?? undefined,
      status: url.searchParams.getAll('status').length > 1 ? url.searchParams.getAll('status') : url.searchParams.get('status') ?? undefined,
    });

    const result = await inquiriesRepository.findWorkflowPage(validated, { user: auth.user });
    return successResponse(result.items, 200, result.meta);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = inquirySchema.parse(body);
    const auth = await authenticateRequestOptional(request);

    if (validated.listingId) {
      const listing = await listingsRepository.findById(validated.listingId);
      if (!listing) {
        throw AppError.badRequest(`Listing with id '${validated.listingId}' does not exist`);
      }
    }

    const created = await inquiriesRepository.create(validated, auth?.user.role === 'DOCTOR' ? auth.user.id : undefined);

    await notificationService.notifyInquiryEvent(
      'INQUIRY_SUBMITTED',
      [{ email: created.email, name: created.doctorName }],
      { inquiry: created }
    );

    return successResponse(created, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
