import { Router, IRouter } from 'express';
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
 *     summary: Verify a Telebirr receipt and credit sender's wallet
 *     tags: [Payments]
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
 *         description: Invalid receipt URL, payment not completed, or receiver mismatch
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
 *                   example: "Payment is not completed. Status: Pending"
 *       404:
 *         description: Card holder (payer) not found in the database
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
 *                   example: Card holder not found.
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
 *         description: Required fields missing from receipt page
 *       502:
 *         description: Failed to fetch receipt from Telebirr
 */
router.post('/verify', verifyReceipt);

export default router;
