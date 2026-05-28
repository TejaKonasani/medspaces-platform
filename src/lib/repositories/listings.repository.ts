import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { AppError } from '@/lib/errors';
import type { FacilityType, Listing, ListingsQueryParams, PaginationMeta } from '@/types';

export interface ListingQueryResult {
  items: Listing[];
  meta: PaginationMeta;
}

export interface ListingSortOption {
  createdAt?: 'asc' | 'desc';
  featured?: 'asc' | 'desc';
  verified?: 'asc' | 'desc';
}

export interface ListingQueryOptions extends ListingsQueryParams {
  sort?: ListingSortOption[];
}

type ListingRow = Prisma.ListingGetPayload<{}>;

type ListingModerationAction = 'APPROVE' | 'REJECT' | 'VERIFY';

export class ListingsRepository {
  async findMany(options: ListingQueryOptions = {}): Promise<ListingQueryResult> {
    try {
      const page = options.page ?? 1;
      const limit = options.limit ?? 12;
      const where = this.buildWhere(options);
      const orderBy = this.buildOrderBy(options.sort);

      const [total, rows] = await Promise.all([
        prisma.listing.count({ where }),
        prisma.listing.findMany({
          where,
          orderBy,
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);

      return {
        items: rows.map((row) => this.mapListing(row)),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.max(1, Math.ceil(total / limit)),
        },
      };
    } catch (err) {
      throw AppError.internal('Failed to fetch listings');
    }
  }

  async findById(id: string): Promise<Listing | null> {
    try {
      const row = await prisma.listing.findUnique({ where: { id } });
      return row ? this.mapListing(row) : null;
    } catch (err) {
      throw AppError.internal('Failed to fetch listing');
    }
  }

  async findManyByOwnerUserId(ownerUserId: string): Promise<Listing[]> {
    try {
      const rows = await prisma.listing.findMany({
        where: { ownerUserId },
        orderBy: { createdAt: 'desc' },
      });

      return rows.map((row) => this.mapListing(row));
    } catch (err) {
      throw AppError.internal('Failed to fetch clinic listings');
    }
  }

  async create(listing: Partial<Listing>): Promise<Listing> {
    try {
      const created = await prisma.listing.create({
        data: {
          clinicName: listing.clinicName as string,
          facilityType: listing.facilityType as FacilityType,
          city: listing.city as string,
          locality: listing.locality as string,
          address: listing.address as string,
          contactPerson: listing.contactPerson as string,
          phone: listing.phone as string,
          email: listing.email as string,
          whatsapp: listing.whatsapp as string,
          rooms: listing.rooms as Prisma.InputJsonValue,
          pricing: listing.pricing as Prisma.InputJsonValue,
          availability: listing.availability as Prisma.InputJsonValue,
          infrastructure: listing.infrastructure as Prisma.InputJsonValue,
          specialties: listing.specialties ?? [],
          images: listing.images ?? [],
          verified: listing.verified ?? false,
          featured: listing.featured ?? false,
          ownerUserId: listing.ownerUserId,
        },
      });

      return this.mapListing(created);
    } catch (err) {
      throw AppError.internal('Failed to create listing');
    }
  }

  async update(id: string, updates: Partial<Listing>): Promise<Listing | null> {
    try {
      const updated = await prisma.listing.update({
        where: { id },
        data: {
          clinicName: updates.clinicName,
          facilityType: updates.facilityType as FacilityType | undefined,
          city: updates.city,
          locality: updates.locality,
          address: updates.address,
          contactPerson: updates.contactPerson,
          phone: updates.phone,
          email: updates.email,
          whatsapp: updates.whatsapp,
          rooms: updates.rooms as Prisma.InputJsonValue | undefined,
          pricing: updates.pricing as Prisma.InputJsonValue | undefined,
          availability: updates.availability as Prisma.InputJsonValue | undefined,
          infrastructure: updates.infrastructure as Prisma.InputJsonValue | undefined,
          specialties: updates.specialties,
          images: updates.images,
          verified: updates.verified,
          moderationStatus: updates.moderationStatus,
          featured: updates.featured,
          ownerUserId: updates.ownerUserId,
        },
      });

      return this.mapListing(updated);
    } catch (err) {
      if (this.isPrismaNotFoundError(err)) {
        return null;
      }
      throw AppError.internal('Failed to update listing');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.listing.delete({ where: { id } });
      return true;
    } catch (err) {
      if (this.isPrismaNotFoundError(err)) return false;
      throw AppError.internal('Failed to delete listing');
    }
  }

  async getAllListings(): Promise<Listing[]> {
    const result = await this.findMany();
    return result.items;
  }

  async getListingById(id: string): Promise<Listing | null> {
    return this.findById(id);
  }

  async createListing(listing: Partial<Listing>): Promise<Listing> {
    return this.create(listing);
  }

  async updateListing(id: string, updates: Partial<Listing>): Promise<Listing | null> {
    return this.update(id, updates);
  }

  async deleteListing(id: string): Promise<boolean> {
    return this.delete(id);
  }

  async moderateListing(id: string, action: ListingModerationAction): Promise<Listing | null> {
    try {
      const moderationStatus = action === 'REJECT' ? 'REJECTED' : 'APPROVED';
      const updated = await prisma.listing.update({
        where: { id },
        data: {
          verified: action !== 'REJECT',
          moderationStatus,
        },
      });

      return this.mapListing(updated);
    } catch (err) {
      if (this.isPrismaNotFoundError(err)) return null;
      throw AppError.internal('Failed to update listing moderation');
    }
  }

  private buildWhere(options: ListingQueryOptions): Prisma.ListingWhereInput {
    const where: Prisma.ListingWhereInput = {};

    if (options.search) {
      const term = options.search.trim();
      where.OR = [
        { clinicName: { contains: term, mode: 'insensitive' } },
        { locality: { contains: term, mode: 'insensitive' } },
        { city: { contains: term, mode: 'insensitive' } },
      ];
    }

    if (options.city) where.city = options.city;
    if (options.specialty) where.specialties = { has: options.specialty };
    if (options.facilityType) where.facilityType = options.facilityType;
    if (options.verified !== undefined) where.verified = options.verified;

    if (options.minPrice !== undefined || options.maxPrice !== undefined) {
      where.pricing = {
        path: ['monthlyFee'],
        gte: options.minPrice,
        lte: options.maxPrice,
      };
    }

    return where;
  }

  private buildOrderBy(sort?: ListingSortOption[]): Prisma.ListingOrderByWithRelationInput[] {
    if (sort && sort.length > 0) {
      return sort.map((item) => ({ ...item }));
    }

    return [{ createdAt: 'asc' }];
  }

  private isPrismaNotFoundError(err: unknown): boolean {
    return typeof err === 'object' && err !== null && 'code' in err && (err as { code?: string }).code === 'P2025';
  }

  private mapListing(row: ListingRow): Listing {
    return {
      id: row.id,
      clinicName: row.clinicName,
      facilityType: row.facilityType,
      city: row.city,
      locality: row.locality,
      address: row.address,
      contactPerson: row.contactPerson,
      phone: row.phone,
      email: row.email,
      whatsapp: row.whatsapp,
      rooms: row.rooms as Listing['rooms'],
      pricing: row.pricing as Listing['pricing'],
      availability: row.availability as Listing['availability'],
      infrastructure: row.infrastructure as Listing['infrastructure'],
      specialties: row.specialties || [],
      images: row.images || [],
      verified: row.verified,
      moderationStatus: row.moderationStatus as Listing['moderationStatus'],
      featured: row.featured,
      ownerUserId: row.ownerUserId ?? undefined,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt ? row.updatedAt.toISOString() : undefined,
    };
  }
}

export const listingsRepository = new ListingsRepository();
