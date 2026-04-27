import { z } from 'zod';

export const createCheckoutUrlSchema = z.object({
  body: z.object({
    amount: z.number().positive('amount must be a positive number'),
    subject: z.string().min(1, 'subject must be a non-empty string').optional(),
    outTradeNo: z.string().min(1, 'outTradeNo must be a non-empty string').optional(),
    timeoutExpress: z.string().min(1, 'timeoutExpress must be a non-empty string').optional(),
    notifyUrl: z.string().url('notifyUrl must be a valid URL with protocol').optional(),
    redirectUrl: z.string().url('redirectUrl must be a valid URL with protocol').optional(),
  })
});
