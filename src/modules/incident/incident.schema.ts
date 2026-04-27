import { z } from 'zod';

export const reportIncidentSchema = z.object({
  body: z.object({
    busId: z.string().uuid('Invalid Bus ID'),
    type: z.string().min(1, 'Type is required'),
    severity: z.string().min(1, 'Severity is required'),
    description: z.string().min(1, 'Description is required'),
    reportedBy: z.string().uuid('Invalid User ID').optional()
  })
});

export const getIncidentSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Incident ID')
  })
});

export const getAllIncidentsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val, 10) : 1),
    limit: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val, 10) : 10),
    status: z.string().optional(),
    severity: z.string().optional()
  })
});

export const updateIncidentStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Incident ID')
  }),
  body: z.object({
    status: z.string().min(1, 'Status is required')
  })
});
