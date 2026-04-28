import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Please provide a valid email address'),
    phone: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  })
});

export const loginSchema = z.object({
  body: z.object({
    phone: z.string().min(1, 'Phone number is required'),
    password: z.string().min(1, 'Password is required'),
  })
});

export const createDriverSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Please provide a valid email address'),
    phone: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    licenseNumber: z.string().min(1, 'License number is required'),
  })
});
