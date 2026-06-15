import { z } from 'zod';

export const createScheduleSchema = z.object({
  body: z.object({
    routeId: z.string().uuid({ message: 'Invalid routeId format' }),
    dayOfWeek: z.number().int().min(0).max(6),
    departureTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Invalid time format (HH:mm)' }),
    arrivalTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Invalid time format (HH:mm)' }),
    busId: z.string().uuid({ message: 'Invalid busId format' }).nullable().optional(),
    isActive: z.boolean().optional(),
  })
});

export const updateScheduleSchema = z.object({
  params: z.object({
    scheduleId: z.string().uuid({ message: 'Invalid scheduleId format' }),
  }),
  body: z.object({
    routeId: z.string().uuid({ message: 'Invalid routeId format' }).optional(),
    dayOfWeek: z.number().int().min(0).max(6).optional(),
    departureTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Invalid time format (HH:mm)' }).optional(),
    arrivalTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Invalid time format (HH:mm)' }).optional(),
    busId: z.string().uuid({ message: 'Invalid busId format' }).nullable().optional(),
    isActive: z.boolean().optional(),
  })
});

export const getRouteSchedulesSchema = z.object({
  params: z.object({
    routeId: z.string().uuid({ message: 'Invalid routeId format' }),
  })
});

export const deleteScheduleSchema = z.object({
  params: z.object({
    scheduleId: z.string().uuid({ message: 'Invalid scheduleId format' }),
  })
});
