import express from 'express';
import telebirrController from './telebirr.controller';
import validate from '@/middleware/validate';
import { createCheckoutUrlSchema } from './telebirr.schema';

const router = express.Router();

router.post(
  '/checkout-url',
  validate(createCheckoutUrlSchema),
  telebirrController.createCheckoutUrl
);

export default router;
