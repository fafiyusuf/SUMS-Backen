import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(1).optional(),
    phone: z.string().optional(),
  })
});

export const updateUserStatusSchema = z.object({
  body: z.object({
    status: z.enum(['active', 'suspended', 'inactive'])
  }),
  params: z.object({
    id: z.string().uuid('Invalid user ID format'),
  })
});

export const getUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID format'),
  })
});

export const getAllUsersSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val, 10) : 1),
    limit: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val, 10) : 10),
  })
});

export const updateUserSchema = z.object({
  body: z.object({
    fullName: z.string().min(1).optional(),
    email: z.string().email('Invalid email address').optional(),
    role: z.enum(['admin', 'driver', 'passenger']).optional(),
    status: z.enum(['active', 'suspended', 'inactive']).optional()
  }),
  params: z.object({
    id: z.string().uuid('Invalid user ID format'),
  })
});

export const createUserSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional().nullable(),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    role: z.enum(['admin', 'driver', 'passenger']),
    status: z.enum(['active', 'suspended', 'inactive']).default('active')
  })
});

