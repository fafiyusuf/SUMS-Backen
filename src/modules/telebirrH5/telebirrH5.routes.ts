import express from 'express';
import telebirrH5Controller from './telebirrH5.controller';
import validate from '@/middleware/validate';
import { preOrderSchema, refundSchema } from './telebirrH5.schema';

const router = express.Router();

router.post('/token', telebirrH5Controller.token);
router.post('/auth-token', telebirrH5Controller.authToken);

router.post(
  '/preorder',
  validate(preOrderSchema),
  telebirrH5Controller.preOrder
);

router.post(
  '/refund',
  validate(refundSchema),
  telebirrH5Controller.refund
);

// Note: Ensure webhook signatures are verified properly in production
router.post('/notify', telebirrH5Controller.notify);

export default router;
