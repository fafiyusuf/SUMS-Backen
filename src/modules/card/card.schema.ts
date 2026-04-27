import { z } from 'zod';

export const activateCardSchema = z.object({
  body: z.object({
    cardId: z.string().min(1, 'Card ID is required')
  })
});

export const linkTelebirrSchema = z.object({
  body: z.object({
    phone: z.string().min(1, 'Phone number is required')
  })
});

export const listCardsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val, 10) : 1),
    limit: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val, 10) : 20),
  })
});

export const cardIdParamSchema = z.object({
  params: z.object({
    cardId: z.string().min(1, 'Card ID is required')
  })
});

export const updateCardStatusSchema = z.object({
  params: z.object({
    cardId: z.string().min(1)
  }),
  body: z.object({
    status: z.enum(['ACTIVE', 'SUSPENDED'])
  })
});
