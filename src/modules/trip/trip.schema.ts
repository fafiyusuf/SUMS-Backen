import { z } from 'zod';

export const createTripSchema = z.object({
  body: z.object({
    userId: z.string().uuid('Invalid User ID format'),
    busId: z.string().uuid('Invalid Bus ID format'),
    routeId: z.string().uuid('Invalid Route ID format'),
    startStopId: z.string().uuid('Invalid Start Stop ID format'),
    endStopId: z.string().uuid('Invalid End Stop ID format').optional(),
    fare: z.number().min(0, 'Fare cannot be negative'),
  })
});

export const getTripSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Trip ID format'),
  })
});

export const getUserTripsSchema = z.object({
  params: z.object({
    userId: z.string().uuid('Invalid User ID format'),
  }),
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val, 10) : 1),
    limit: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val, 10) : 10),
  })
});

export const completeTripSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Trip ID format'),
  }),
  body: z.object({
    endStopId: z.string().uuid('Invalid End Stop ID format'),
  })
});

export const cancelTripSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Trip ID format'),
  })
});

export const getPassengerHistorySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val, 10) : 1),
    limit: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val, 10) : 10),
  })
});

export const getAllTripsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val, 10) : 1),
    limit: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val, 10) : 10),
  })
});

export const simulateTapInSchema = z.object({
  body: z.object({
    cardId: z.string().min(1, 'Card ID is required'),
    busId: z.string().uuid('Invalid Bus ID format'),
    routeId: z.string().uuid('Invalid Route ID format'),
    startStopId: z.string().uuid('Invalid Start Stop ID format'),
  })
});

export const simulateTapOutSchema = z.object({
  body: z.object({
    cardId: z.string().min(1, 'Card ID is required'),
    busId: z.string().uuid('Invalid Bus ID format'),
    routeId: z.string().uuid('Invalid Route ID format'),
    endStopId: z.string().uuid('Invalid End Stop ID format'),
    fare: z.number().min(0, 'Fare cannot be negative').optional().default(15), 
  })
});
