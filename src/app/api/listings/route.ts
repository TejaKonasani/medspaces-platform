import { NextRequest } from 'next/server';
import { listingSchema } from '@/lib/validations';
import { successResponse, errorResponse } from '@/lib/responses';
import { authenticateRequestOptional } from '@/lib/auth';
import { listingsRepository } from '@/lib/repositories';
import type { ListingsQueryParams } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const auth = await authenticateRequestOptional(request);
    const isAdmin = auth?.user.role === 'ADMIN';
    const verifiedParam = searchParams.get('verified');

    const params: ListingsQueryParams = {
      search: searchParams.get('search') || undefined,
      city: searchParams.get('city') || undefined,
      specialty: searchParams.get('specialty') || undefined,
      facilityType: (searchParams.get('facilityType') as ListingsQueryParams['facilityType']) || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      verified: isAdmin ? (verifiedParam === 'true' ? true : verifiedParam === 'false' ? false : undefined) : true,
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 12,
    };

    const result = await listingsRepository.findMany(params);
    return successResponse(result.items, 200, result.meta);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = listingSchema.parse(body);
    const auth = await authenticateRequestOptional(request);
    const created = await listingsRepository.create({
      ...validated,
      ownerUserId: auth?.user.role === 'CLINIC_OWNER' ? auth.user.id : undefined,
    });
    return successResponse(created, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
