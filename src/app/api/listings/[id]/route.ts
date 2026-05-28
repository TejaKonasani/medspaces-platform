import { NextRequest } from 'next/server';
import { listingUpdateSchema, listingModerationActionSchema } from '@/lib/validations';
import { successResponse, errorResponse } from '@/lib/responses';
import { AppError } from '@/lib/errors';
import { listingsRepository } from '@/lib/repositories';
import { requirePermission, Permission } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listing = await listingsRepository.findById(params.id);
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
    const existing = await listingsRepository.findById(params.id);
    if (!existing) {
      throw AppError.notFound(`Listing with id '${params.id}' not found`);
    }

    const body = await request.json();
    const validated = listingUpdateSchema.parse(body);

    const updated = await listingsRepository.update(params.id, validated);
    if (!updated) {
      throw AppError.notFound(`Listing with id '${params.id}' not found`);
    }
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
    const existing = await listingsRepository.findById(params.id);
    if (!existing) {
      throw AppError.notFound(`Listing with id '${params.id}' not found`);
    }

    const deleted = await listingsRepository.delete(params.id);
    if (!deleted) {
      throw AppError.notFound(`Listing with id '${params.id}' not found`);
    }
    return successResponse({ message: 'Listing deleted successfully' });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requirePermission(request, Permission.MANAGE_LISTINGS);

    const existing = await listingsRepository.findById(params.id);
    if (!existing) {
      throw AppError.notFound(`Listing with id '${params.id}' not found`);
    }

    const body = await request.json();
    const validated = listingModerationActionSchema.parse(body);

    const updated = await listingsRepository.moderateListing(params.id, validated.action);
    if (!updated) {
      throw AppError.notFound(`Listing with id '${params.id}' not found`);
    }

    return successResponse(updated);
  } catch (error) {
    return errorResponse(error);
  }
}
