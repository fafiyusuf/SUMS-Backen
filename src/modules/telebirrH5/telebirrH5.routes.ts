import express from 'express';
import validate from '../../middleware/validate';
import telebirrH5Controller from './telebirrH5.controller';
import { preOrderSchema, refundSchema } from './telebirrH5.schema';

const router: express.IRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: TelebirrH5
 *   description: TelebirrH5 (In-App) Payment API integration
 */

/**
 * @swagger
 * /telebirr-h5/token:
 *   post:
 *     summary: Request access token from Telebirr
 *     tags: [TelebirrH5]
 *     responses:
 *       200:
 *         description: Token retrieved successfully
 */
router.post('/token', telebirrH5Controller.token);
/**
 * @swagger
 * /telebirr-h5/auth-token:
 *   post:
 *     summary: Exchange token for Auth token
 *     tags: [TelebirrH5]
 *     responses:
 *       200:
 *         description: Auth token retrieved
 */
router.post('/auth-token', telebirrH5Controller.authToken);

/**
 * @swagger
 * /telebirr-h5/preorder:
 *   post:
 *     summary: Create a preorder payment request
 *     tags: [TelebirrH5]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - title
 *             properties:
 *               amount:
 *                 type: string
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Preorder payment initiated
 */
router.post(
  '/preorder',
  validate(preOrderSchema),
  telebirrH5Controller.preOrder
);

/**
 * @swagger
 * /telebirr-h5/refund:
 *   post:
 *     summary: Process a refund
 *     tags: [TelebirrH5]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - outTradeNo
 *               - amount
 *             properties:
 *               outTradeNo:
 *                 type: string
 *               amount:
 *                 type: string
 *     responses:
 *       200:
 *         description: Refund processed
 */
router.post(
  '/refund',
  validate(refundSchema),
  telebirrH5Controller.refund
);

// Note: Ensure webhook signatures are verified properly in production
/**
 * @swagger
 * /telebirr-h5/notify:
 *   post:
 *     summary: Payment notification webhook from TelebirrH5
 *     tags: [TelebirrH5]
 *     responses:
 *       200:
 *         description: Notification received
 */
router.post('/notify', telebirrH5Controller.notify);

export default router;
