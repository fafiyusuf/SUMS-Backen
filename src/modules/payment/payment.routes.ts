import { IRouter, Router } from 'express';
import verifyToken from '../../middleware/authMiddleware';
import { verifyReceipt } from './payment.controller';

const router: IRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Telebirr receipt verification and wallet top-up
 */

/**
 * @swagger
 * /payments/verify:
 *   post:
 *     summary: Verify a Telebirr receipt and credit the authenticated user's wallet
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiptUrl
 *             properties:
 *               receiptUrl:
 *                 type: string
 *                 example: "https://transactioninfo.ethiotelecom.et/receipt/DFR3BPTZ03"
 *                 description: >
 *                   Full URL of the official Telebirr receipt page.
 *                   Must start with https://transactioninfo.ethiotelecom.et/receipt/
 *     responses:
 *       200:
 *         description: Receipt verified and wallet credited
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Payment verified successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     invoiceNo:
 *                       type: string
 *                       example: DFR3BPTZ03
 *                     sender:
 *                       type: string
 *                       example: LELLO MOHAMMED AHMED
 *                     creditedAmount:
 *                       type: number
 *                       example: 150
 *                     newBalance:
 *                       type: number
 *                       example: 540
 *       400:
 *         description: Invalid receipt URL, payment not completed, receiver mismatch, or payer name does not match account
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Receipt payer name "JOHN DOE" does not match your account name "Jane Doe".'
 *       401:
 *         description: Missing or invalid JWT token
 *       404:
 *         description: User or wallet not found
 *       409:
 *         description: Receipt has already been used
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Receipt already used.
 *       422:
 *         description: Required fields could not be extracted from receipt page
 *       502:
 *         description: Failed to fetch receipt from Telebirr
 */
router.post('/verify', verifyToken, verifyReceipt);

export default router;
