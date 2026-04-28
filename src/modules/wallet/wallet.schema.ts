import { z } from 'zod';

export const topupSchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be greater than 0')
  })
});

export const deductSchema = z.object({
  body: z.object({
    userId: z.string().uuid('Invalid User ID'),
    amount: z.number().positive('Amount must be greater than 0'),
    description: z.string().optional()
  })
});

export const getTransactionsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val, 10) : 1),
    limit: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val, 10) : 10),
  })
});

export const getRevenueSchema = z.object({
  query: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional()
  })
});

export const getAllTransactionsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val, 10) : 1),
    limit: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val, 10) : 20),
  })
});
