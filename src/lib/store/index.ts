import type { Listing, Doctor, Inquiry } from '@/types';
import { sampleListings } from '@/data/listings';

class InMemoryStore {
  private listings: Map<string, Listing> = new Map();
  private doctors: Map<string, Doctor> = new Map();
  private inquiries: Map<string, Inquiry> = new Map();
  private nextId = 100;

  constructor() {
    sampleListings.forEach((listing) => {
      this.listings.set(listing.id, listing as Listing);
    });
  }

  generateId(): string {
    return String(this.nextId++);
  }

  // Listings
  getAllListings(): Listing[] {
    return Array.from(this.listings.values());
  }

  getListingById(id: string): Listing | undefined {
    return this.listings.get(id);
  }

  createListing(listing: Listing): Listing {
    this.listings.set(listing.id, listing);
    return listing;
  }

  updateListing(id: string, updates: Partial<Listing>): Listing | undefined {
    const existing = this.listings.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates, id, updatedAt: new Date().toISOString() };
    this.listings.set(id, updated);
    return updated;
  }

  deleteListing(id: string): boolean {
    return this.listings.delete(id);
  }

  // Doctors
  getAllDoctors(): Doctor[] {
    return Array.from(this.doctors.values());
  }

  createDoctor(doctor: Doctor): Doctor {
    this.doctors.set(doctor.id, doctor);
    return doctor;
  }

  getDoctorByEmail(email: string): Doctor | undefined {
    return Array.from(this.doctors.values()).find((d) => d.email === email);
  }

  // Inquiries
  getAllInquiries(): Inquiry[] {
    return Array.from(this.inquiries.values());
  }

  createInquiry(inquiry: Inquiry): Inquiry {
    this.inquiries.set(inquiry.id, inquiry);
    return inquiry;
  }
}

export const store = new InMemoryStore();
