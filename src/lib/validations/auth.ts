import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const doctorRegistrationSchema = z.object({
  role: z.literal('DOCTOR'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  specialty: z.string().min(2, 'Specialty is required'),
  phone: z.string().min(6, 'Phone number is required'),
});

const clinicRegistrationSchema = z.object({
  role: z.literal('CLINIC_OWNER'),
  clinicName: z.string().min(2, 'Clinic name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  city: z.string().min(2, 'City is required'),
  phone: z.string().min(6, 'Phone number is required'),
});

export const registrationSchema = z.discriminatedUnion('role', [doctorRegistrationSchema, clinicRegistrationSchema]);
export const registerSchema = registrationSchema;

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registrationSchema>;
