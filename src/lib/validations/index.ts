import { z } from 'zod';

const phoneRegex = /^\+?[0-9\s\-()]{10,15}$/;

export const listingSchema = z.object({
  clinicName: z.string().min(2, 'Clinic name must be at least 2 characters'),
  facilityType: z.enum(['clinic', 'hospital', 'diagnostic_center', 'polyclinic'], {
    errorMap: () => ({ message: 'Invalid facility type' }),
  }),
  city: z.string().min(2, 'City is required'),
  locality: z.string().min(2, 'Locality is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  contactPerson: z.string().min(2, 'Contact person name is required'),
  phone: z.string().regex(phoneRegex, 'Invalid phone number format'),
  email: z.string().email('Invalid email address'),
  whatsapp: z.string().regex(phoneRegex, 'Invalid WhatsApp number format'),
  rooms: z.object({
    available: z.number().int().min(1, 'At least 1 room must be available'),
    size: z.string().min(1, 'Room size is required'),
    furniture: z.array(z.string()).default([]),
    equipment: z.array(z.string()).default([]),
  }),
  pricing: z.object({
    monthlyFee: z.number().min(0, 'Monthly fee must be non-negative'),
    slotFee: z.number().min(0).optional(),
    deposit: z.number().min(0).optional(),
  }),
  availability: z.object({
    days: z.array(z.string()).min(1, 'At least one day must be specified'),
    hours: z.string().min(1, 'Operating hours are required'),
  }),
  infrastructure: z.object({
    parking: z.boolean().default(false),
    waitingArea: z.boolean().default(false),
    pharmacy: z.boolean().default(false),
    diagnostics: z.boolean().default(false),
    powerBackup: z.boolean().default(false),
  }),
  specialties: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  verified: z.boolean().default(false),
  featured: z.boolean().default(false),
});

export const listingUpdateSchema = listingSchema.partial();

export const doctorSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  mobile: z.string().regex(phoneRegex, 'Invalid mobile number format'),
  email: z.string().email('Invalid email address'),
  qualification: z.string().min(2, 'Qualification is required'),
  specialty: z.string().min(2, 'Specialty is required'),
  subSpecialty: z.string().optional(),
  registrationNumber: z.string().min(3, 'Registration number is required'),
  experience: z.number().int().min(0, 'Experience must be non-negative'),
  preferredLocations: z.array(z.string()).min(1, 'At least one preferred location is required'),
  consultingTimes: z.string().optional(),
  practiceModel: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  affiliations: z.string().optional(),
});

export const inquirySchema = z.object({
  doctorName: z.string().min(2, 'Doctor name must be at least 2 characters'),
  specialty: z.string().min(2, 'Specialty is required'),
  phone: z.string().regex(phoneRegex, 'Invalid phone number format'),
  email: z.string().email('Invalid email address'),
  listingId: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ListingInput = z.infer<typeof listingSchema>;
export type ListingUpdateInput = z.infer<typeof listingUpdateSchema>;
export type DoctorInput = z.infer<typeof doctorSchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;
