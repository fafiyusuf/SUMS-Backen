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
