import { z } from 'zod';

export const createStopSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Stop name is required'),
    routeId: z.string().uuid('Invalid Route ID format'),
    latitude: z.number().min(-90).max(90, 'Invalid latitude'),
    longitude: z.number().min(-180).max(180, 'Invalid longitude'),
    sequenceNumber: z.number().int().min(1, 'Sequence number must be at least 1')
  })
});

export const updateStopSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Stop ID format')
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    routeId: z.string().uuid().optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    sequenceNumber: z.number().int().min(1).optional()
  })
});

export const getStopSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Stop ID format')
  })
});

export const deleteStopSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Stop ID format')
  })
});

export const updateStopSequenceSchema = z.object({
  body: z.object({
    sequence: z.array(
      z.object({
        id: z.string().uuid('Invalid Stop ID format'),
        sequenceNumber: z.number().int().min(1)
      })
    )
  })
});
