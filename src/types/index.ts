export type FacilityType = 'clinic' | 'hospital' | 'diagnostic_center' | 'polyclinic';

export interface Listing {
  id: string;
  clinicName: string;
  facilityType: FacilityType;
  city: string;
  locality: string;
  address: string;
  contactPerson: string;
  phone: string;
  email: string;
  whatsapp: string;
  rooms: {
    available: number;
    size: string;
    furniture: string[];
    equipment: string[];
  };
  pricing: {
    monthlyFee: number;
    slotFee?: number;
    deposit?: number;
  };
  availability: {
    days: string[];
    hours: string;
  };
  infrastructure: {
    parking: boolean;
    waitingArea: boolean;
    pharmacy: boolean;
    diagnostics: boolean;
    powerBackup: boolean;
  };
  specialties: string[];
  images: string[];
  verified: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Doctor {
  id: string;
  fullName: string;
  mobile: string;
  email: string;
  qualification: string;
  specialty: string;
  subSpecialty?: string;
  registrationNumber: string;
  experience: number;
  preferredLocations: string[];
  consultingTimes?: string;
  practiceModel?: string;
  website?: string;
  linkedin?: string;
  affiliations?: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  doctorName: string;
  specialty: string;
  phone: string;
  email: string;
  listingId?: string;
  message: string;
  status: 'pending' | 'contacted' | 'resolved';
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListingsQueryParams {
  search?: string;
  city?: string;
  specialty?: string;
  facilityType?: FacilityType;
  minPrice?: number;
  maxPrice?: number;
  verified?: boolean;
  page?: number;
  limit?: number;
}
