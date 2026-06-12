import { z } from 'zod';

export const createBusSchema = z.object({
  body: z.object({
    registrationNumber: z.string().min(1, 'Registration number is required'),
    capacity: z.number().int().min(1, 'Capacity must be at least 1'),
    // driverId and routeId are optional at creation — a bus can be added to the fleet
    // first and assigned to a driver/route separately.
    driverId: z.string().uuid('Invalid Driver ID format').optional().nullable(),
    routeId: z.string().uuid('Invalid Route ID format').optional().nullable(),
    status: z.enum(['active', 'inactive', 'maintenance']).optional(),
  })
});

export const updateBusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Bus ID format')
  }),
  body: z.object({
    registrationNumber: z.string().min(1).optional(),
    capacity: z.number().int().min(1).optional(),
    driverId: z.string().uuid('Invalid Driver ID format').optional().nullable(),
    routeId: z.string().uuid('Invalid Route ID format').optional().nullable(),
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
