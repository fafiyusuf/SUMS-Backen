import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import telebirrH5Controller from '../controllers/telebirrH5Controller';
import { handleValidationErrors } from '../utils/validators';

const router = express.Router();
/**
 * @swagger
 * /telebirr/h5/token:
 *   post:
 *     summary: Obtain a Fabric token from SuperApp (used for server-server calls)
 *     tags: [TelebirrH5]
 *     responses:
 *       200:
 *         description: Fabric token returned
 */
router.post('/token', (req: Request, res: Response, next: NextFunction) => telebirrH5Controller.token(req, res, next));
/**
 * @swagger
 * /telebirr/h5/auth-token:
 *   post:
 *     summary: Obtain an auth token for H5 integrations (authToken)
 *     tags: [TelebirrH5]
 *     responses:
 *       200:
 *         description: Auth token returned
 */
router.post('/auth-token', (req: Request, res: Response, next: NextFunction) => telebirrH5Controller.authToken(req, res, next));

/**
 * @swagger
 * /telebirr/h5/preorder:
 *   post:
 *     summary: Create a merchant preOrder (returns prepay_id and rawRequest for H5)
 *     tags: [TelebirrH5]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 10
 *               subject:
 *                 type: string
 *               outTradeNo:
 *                 type: string
 *               notifyUrl:
 *                 type: string
 *                 format: uri
 *               redirectUrl:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: PreOrder created; returns provider response, prepayId and rawRequest
 */
router.post(
  '/preorder',
  [
    body('amount').isFloat({ gt: 0 }).withMessage('amount must be a positive number'),
    body('notifyUrl').optional().isURL({ require_protocol: true }).withMessage('notifyUrl must be a valid url'),
    handleValidationErrors
  ],
  (req: Request, res: Response, next: NextFunction) => telebirrH5Controller.preOrder(req, res, next)
);

/**
 * @swagger
 * /telebirr/h5/refund:
 *   post:
 *     summary: Refund an order through SuperApp merchant refund API
 *     tags: [TelebirrH5]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [outTradeNo, refundAmount]
 *             properties:
 *               outTradeNo:
 *                 type: string
 *               refundAmount:
 *                 type: string
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Refund accepted (provider response included)
 */
router.post(
  '/refund',
  [body('outTradeNo').isString().notEmpty(), body('refundAmount').isString().notEmpty(), handleValidationErrors],
  (req: Request, res: Response, next: NextFunction) => telebirrH5Controller.refund(req, res, next)
);

/**
 * @swagger
 * /telebirr/h5/notify:
 *   post:
 *     summary: Notification endpoint for SuperApp asynchronous payment result callbacks
 *     tags: [TelebirrH5]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Notification processed
 */
router.post('/notify', (req: Request, res: Response) => telebirrH5Controller.notify(req, res));

export default router;
