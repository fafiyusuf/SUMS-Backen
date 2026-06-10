import { z } from 'zod';

export const createBusSchema = z.object({
  body: z.object({
    registrationNumber: z.string().min(1, 'Registration number is required'),
    capacity: z.number().int().min(1, 'Capacity must be at least 1'),
    make: z.string().optional(),
    model: z.string().optional(),
    year: z.number().int().optional(),
    driverId: z.string().uuid().optional(),
    routeId: z.string().uuid().optional(),
    status: z.enum(['active', 'inactive', 'maintenance']).optional()
  })
});

export const updateBusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Bus ID format')
  }),
  body: z.object({
    registrationNumber: z.string().min(1).optional(),
    capacity: z.number().int().min(1).optional(),
    make: z.string().optional(),
    model: z.string().optional(),
    year: z.number().int().optional(),
    driverId: z.string().uuid().optional(),
    routeId: z.string().uuid().optional(),
    status: z.enum(['active', 'inactive', 'maintenance']).optional()
  })
});

export const getBusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Bus ID format')
  })
});

export const getAllBusesSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val, 10) : 1),
    limit: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val, 10) : 10),
  })
});

export const deleteBusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Bus ID format')
  })
});
