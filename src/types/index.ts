export type FacilityType = 'clinic' | 'hospital' | 'diagnostic_center' | 'polyclinic';
export type InquiryWorkflowStatus = 'NEW' | 'CONTACTED' | 'IN_DISCUSSION' | 'MATCHED' | 'CLOSED' | 'REJECTED';
export type InquiryActivityType = 'INQUIRY_CREATED' | 'STATUS_CHANGED' | 'ADMIN_NOTE_ADDED' | 'ADMIN_UPDATED' | 'WORKFLOW_EVENT';
export type ListingModerationStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
export type DoctorModerationStatus = 'PENDING' | 'VERIFIED' | 'INACTIVE';

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
  moderationStatus: ListingModerationStatus;
  featured: boolean;
  ownerUserId?: string;
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
  status: DoctorModerationStatus;
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
  status: InquiryWorkflowStatus;
  adminNotes?: string;
  createdByUserId?: string;
  contactedAt?: string;
  discussionStartedAt?: string;
  matchedAt?: string;
  closedAt?: string;
  rejectedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface InquiryActivity {
  id: string;
  inquiryId: string;
  actorUserId?: string;
  type: InquiryActivityType;
  title: string;
  description?: string;
  fromStatus?: InquiryWorkflowStatus;
  toStatus?: InquiryWorkflowStatus;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface InquiryListItem extends Inquiry {
  listing?: Pick<Listing, 'id' | 'clinicName' | 'city' | 'locality'>;
  listingOwnerUserId?: string;
}

export interface InquiryDetail extends InquiryListItem {
  activity?: InquiryActivity[];
}

export interface InquiryWorkflowQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: InquiryWorkflowStatus | InquiryWorkflowStatus[];
  listingId?: string;
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
