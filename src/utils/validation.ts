import { z } from 'zod';
import { CommunicationType } from '../types';

/**
 * Company validation schema
 */
export const companySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  location: z.string().min(2, 'Location is required'),
  linkedinProfile: z.string().url('Must be a valid URL'),
  emails: z.array(z.string().email('Must be valid email')),
  phoneNumbers: z.array(z.string().regex(/^\+?[\d\s-]{10,}$/, 'Invalid phone number')),
  communicationPeriodicity: z.number().min(1, 'Must be at least 1 day'),
  comments: z.string().optional(),
});

/**
 * Communication validation schema
 */
export const communicationSchema = z.object({
  type: z.nativeEnum(CommunicationType),
  date: z.string().datetime(),
  notes: z.string().optional(),
  contactDetails: z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    linkedinProfile: z.string().url().optional(),
  }).optional(),
});

/**
 * Type inference helpers
 */
export type CompanyFormData = z.infer<typeof companySchema>;
export type CommunicationFormData = z.infer<typeof communicationSchema>; 