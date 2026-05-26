import { NextRequest } from 'next/server';
import { store } from '@/lib/store';
import { listingSchema } from '@/lib/validations';
import { successResponse, errorResponse } from '@/lib/responses';
import { AppError } from '@/lib/errors';
import type { Listing, ListingsQueryParams, PaginationMeta } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params: ListingsQueryParams = {
      search: searchParams.get('search') || undefined,
      city: searchParams.get('city') || undefined,
      specialty: searchParams.get('specialty') || undefined,
      facilityType: (searchParams.get('facilityType') as ListingsQueryParams['facilityType']) || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      verified: searchParams.get('verified') === 'true' ? true : undefined,
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 12,
    };

    let listings = store.getAllListings();

    if (params.search) {
      const term = params.search.toLowerCase();
      listings = listings.filter(
        (l) =>
          l.clinicName.toLowerCase().includes(term) ||
          l.locality.toLowerCase().includes(term) ||
          l.city.toLowerCase().includes(term)
      );
    }

    if (params.city) {
      listings = listings.filter((l) => l.city === params.city);
    }

    if (params.specialty) {
      listings = listings.filter((l) => l.specialties.includes(params.specialty!));
    }

    if (params.facilityType) {
      listings = listings.filter((l) => l.facilityType === params.facilityType);
    }

    if (params.minPrice !== undefined) {
      listings = listings.filter((l) => l.pricing.monthlyFee >= params.minPrice!);
    }

    if (params.maxPrice !== undefined) {
      listings = listings.filter((l) => l.pricing.monthlyFee <= params.maxPrice!);
    }

    if (params.verified !== undefined) {
      listings = listings.filter((l) => l.verified === params.verified);
    }

    const total = listings.length;
    const page = params.page!;
    const limit = params.limit!;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginatedListings = listings.slice(start, start + limit);

    const meta: PaginationMeta = { page, limit, total, totalPages };

    return successResponse(paginatedListings, 200, meta);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = listingSchema.parse(body);

    const listing: Listing = {
      ...validated,
      id: store.generateId(),
      createdAt: new Date().toISOString(),
    };

    const created = store.createListing(listing);
    return successResponse(created, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
