import { NextRequest } from 'next/server';
import { store } from '@/lib/store';
import { listingUpdateSchema } from '@/lib/validations';
import { successResponse, errorResponse } from '@/lib/responses';
import { AppError } from '@/lib/errors';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listing = store.getListingById(params.id);
    if (!listing) {
      throw AppError.notFound(`Listing with id '${params.id}' not found`);
    }
    return successResponse(listing);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existing = store.getListingById(params.id);
    if (!existing) {
      throw AppError.notFound(`Listing with id '${params.id}' not found`);
    }

    const body = await request.json();
    const validated = listingUpdateSchema.parse(body);

    const updated = store.updateListing(params.id, validated);
    return successResponse(updated);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existing = store.getListingById(params.id);
    if (!existing) {
      throw AppError.notFound(`Listing with id '${params.id}' not found`);
    }

    store.deleteListing(params.id);
    return successResponse({ message: 'Listing deleted successfully' });
  } catch (error) {
    return errorResponse(error);
  }
}
