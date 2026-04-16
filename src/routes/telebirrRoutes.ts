import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import telebirrController from '../controllers/telebirrController';
import { handleValidationErrors } from '../utils/validators';

const router = express.Router();

/**
 * @swagger
 * /telebirr/checkout-url:
 *   post:
 *     summary: Generate Telebirr checkout URL for frontend payment redirect
 *     tags: [Telebirr]
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
 *                 example: Project Payment
 *               outTradeNo:
 *                 type: string
 *               timeoutExpress:
 *                 type: string
 *                 example: 30m
 *               notifyUrl:
 *                 type: string
 *                 format: uri
 *               redirectUrl:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Checkout URL generated
 */
router.post(
  '/checkout-url',
  [
    body('amount').isFloat({ gt: 0 }).withMessage('amount must be a positive number'),
    body('subject').optional().isString().trim().notEmpty().withMessage('subject must be a non-empty string'),
    body('outTradeNo').optional().isString().trim().notEmpty().withMessage('outTradeNo must be a non-empty string'),
    body('timeoutExpress').optional().isString().trim().notEmpty().withMessage('timeoutExpress must be a non-empty string'),
    body('notifyUrl').optional().isURL({ require_protocol: true }).withMessage('notifyUrl must be a valid URL with protocol'),
    body('redirectUrl').optional().isURL({ require_protocol: true }).withMessage('redirectUrl must be a valid URL with protocol'),
    handleValidationErrors
  ],
  (req: Request, res: Response, next: NextFunction) => telebirrController.createCheckoutUrl(req, res, next)
);

export default router;
