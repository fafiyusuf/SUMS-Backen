import { z } from 'zod';

export const preOrderSchema = z.object({
  body: z.object({
    amount: z.number().positive('amount must be a positive number'),
    notifyUrl: z.string().url('notifyUrl must be a valid url').optional(),
    subject: z.string().optional(),
    outTradeNo: z.string().optional(),
    redirectUrl: z.string().url().optional()
  })
});

export const refundSchema = z.object({
  body: z.object({
    outTradeNo: z.string().min(1, 'outTradeNo is required'),
    refundAmount: z.string().min(1, 'refundAmount is required'),
    reason: z.string().optional()
  })
});
