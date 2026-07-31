import express from 'express';
import validate from '../../middleware/validate';
import telebirrController from './telebirr.controller';
import { createCheckoutUrlSchema } from './telebirr.schema';

const router: express.IRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Telebirr
 *   description: Telebirr Payment API integration
 */

/**
 * @swagger
 * /telebirr/checkout-url:
 *   post:
 *     summary: Generate a Telebirr checkout URL
 *     tags: [Telebirr]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - notifyUrl
 *               - returnUrl
 *               - shortCode
 *               - subject
 *             properties:
 *               amount:
 *                 type: string
 *               notifyUrl:
 *                 type: string
 *               returnUrl:
 *                 type: string
 *               shortCode:
 *                 type: string
 *               subject:
 *                 type: string
 *               timeoutExpress:
 *                 type: string
 *               totalAmount:
 *                 type: string
 *               appId:
 *                 type: string
 *               appKey:
 *                 type: string
 *               receiveName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Checkout URL generated
 *       400:
 *         description: Validation error
 */

router.post(
  '/checkout-url',
  validate(createCheckoutUrlSchema),
  telebirrController.createCheckoutUrl
);

export default router;
