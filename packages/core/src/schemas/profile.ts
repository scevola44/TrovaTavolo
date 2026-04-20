import { z } from 'zod';
import {
  PROFILE_BIO_MAX,
  PROFILE_CONTACT_HANDLE_MAX,
  PROFILE_CONTACT_HANDLE_MIN,
  PROFILE_DISPLAY_NAME_MAX,
  PROFILE_DISPLAY_NAME_MIN,
} from '../constants';

export const updateProfileSchema = z.object({
  display_name: z.string().trim().min(PROFILE_DISPLAY_NAME_MIN).max(PROFILE_DISPLAY_NAME_MAX),
  bio: z.string().trim().max(PROFILE_BIO_MAX).optional().or(z.literal('')),
  contact_handle: z
    .string()
    .trim()
    .min(PROFILE_CONTACT_HANDLE_MIN)
    .max(PROFILE_CONTACT_HANDLE_MAX)
    .optional()
    .or(z.literal('')),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const signupSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(72),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export type LoginInput = z.infer<typeof loginSchema>;
