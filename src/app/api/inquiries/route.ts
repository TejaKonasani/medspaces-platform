import { NextRequest } from 'next/server';
import { store } from '@/lib/store';
import { inquirySchema } from '@/lib/validations';
import { successResponse, errorResponse } from '@/lib/responses';
import type { Inquiry } from '@/types';

export async function GET() {
  try {
    const inquiries = store.getAllInquiries();
    return successResponse(inquiries);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = inquirySchema.parse(body);

    if (validated.listingId) {
      const listing = store.getListingById(validated.listingId);
      if (!listing) {
        const { AppError } = await import('@/lib/errors');
        throw AppError.badRequest(`Listing with id '${validated.listingId}' does not exist`);
      }
    }

    const inquiry: Inquiry = {
      ...validated,
      id: store.generateId(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const created = store.createInquiry(inquiry);
    return successResponse(created, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
