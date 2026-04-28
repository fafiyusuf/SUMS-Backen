import { z } from 'zod';

export const recordGPSSchema = z.object({
  body: z.object({
    busId: z.string().uuid('Invalid Bus ID'),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    accuracy: z.number().optional(),
    speed: z.number().optional(),
    heading: z.number().optional()
  })
});

export const getLatestGPSSchema = z.object({
  params: z.object({
    busId: z.string().uuid('Invalid Bus ID')
  })
});

export const getGPSTrackSchema = z.object({
  params: z.object({
    busId: z.string().uuid('Invalid Bus ID')
  }),
  query: z.object({
    minutes: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val, 10) : 60),
  })
});
