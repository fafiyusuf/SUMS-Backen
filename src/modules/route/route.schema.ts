import { z } from 'zod';

export const createRouteSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Route name is required'),
    startPoint: z.string().min(1, 'Start point is required'),
    endPoint: z.string().min(1, 'End point is required'),
    distance: z.number().min(0, 'Distance must be a positive number'),
    estimatedDuration: z.number().int().min(1, 'Estimated duration must be positive'),
    status: z.enum(['active', 'inactive']).optional()
  })
});

export const updateRouteSchema = z.object({
  params: z.object({
    routeId: z.string().uuid('Invalid Route ID format')
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    startPoint: z.string().min(1).optional(),
    endPoint: z.string().min(1).optional(),
    distance: z.number().min(0).optional(),
    estimatedDuration: z.number().int().min(1).optional(),
    status: z.enum(['active', 'inactive']).optional()
  })
});

export const getRouteSchema = z.object({
  params: z.object({
    routeId: z.string().uuid('Invalid Route ID format')
  })
});

export const getAllRoutesSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val, 10) : 1),
    limit: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val, 10) : 10),
    status: z.enum(['active', 'inactive']).optional()
  })
});

export const deleteRouteSchema = z.object({
  params: z.object({
    routeId: z.string().uuid('Invalid Route ID format')
  })
});
