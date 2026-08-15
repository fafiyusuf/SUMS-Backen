import express from 'express';
import verifyToken from '../../middleware/authMiddleware';
import requireRole from '../../middleware/roleMiddleware';
import validate from '../../middleware/validate';
import walletController from './wallet.controller';
import {
    deductSchema,
    getAllTransactionsSchema,
    getRevenueSchema,
    getTransactionsSchema,
    // topupSchema, // [LEGACY] — used by /topup route below
} from './wallet.schema';

const router: express.IRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: Digital wallet and transactions API
 */

/**
 * @swagger
 * /wallet:
 *   get:
 *     summary: Get wallet balance
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet balance details
 *       404:
 *         description: Wallet not found
 */

router.get('/', verifyToken, requireRole('passenger', 'admin'), walletController.getWallet);

// ─── LEGACY: Telebirr Checkout API ────────────────────────────────────────────
// These routes belong to the old Telebirr checkout API flow.
// The current top-up method uses receipt URL verification via POST /payments/verify.
// Uncomment to re-enable when the checkout flow is needed again.
//
// /**
//  * @swagger
//  * /wallet/topup:
//  *   post:
//  *     summary: Initiate a top-up transaction (Telebirr checkout)
//  *     tags: [Wallet]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - amount
//  *             properties:
//  *               amount:
//  *                 type: number
//  *     responses:
//  *       200:
//  *         description: Topup initiated
//  *       400:
//  *         description: Validation error
//  */
// router.post('/topup', verifyToken, requireRole('passenger'), validate(topupSchema), walletController.topup);
//
// /**
//  * @swagger
//  * /wallet/webhook/telebirr:
//  *   post:
//  *     summary: Telebirr webhook listener (Telebirr checkout)
//  *     tags: [Wallet]
//  *     responses:
//  *       200:
//  *         description: Webhook received
//  */
// router.post('/webhook/telebirr', walletController.telebirrWebhook);
// ─── END LEGACY ───────────────────────────────────────────────────────────────

/**
 * @swagger
 * /wallet/transactions:
 *   get:
 *     summary: Get transaction history for current user
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of transactions
 */
router.get('/transactions', verifyToken, requireRole('passenger'), validate(getTransactionsSchema), walletController.getTransactionHistory);

/**
 * @swagger
 * /wallet/deduct:
 *   post:
 *     summary: Deduct amount from user wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - amount
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Amount deducted
 *       400:
 *         description: Insufficient funds or invalid request
 */
router.post('/deduct', verifyToken, requireRole('admin', 'driver', 'system'), validate(deductSchema), walletController.deduct);

// Admin
/**
 * @swagger
 * /wallet/admin/revenue:
 *   get:
 *     summary: Get overall revenue (Admin)
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Revenue statistics
 */
router.get('/admin/revenue', verifyToken, requireRole('admin'), validate(getRevenueSchema), walletController.getRevenue);

/**
 * @swagger
 * /wallet/admin/transactions:
 *   get:
 *     summary: Get all transactions globally (Admin)
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of global transactions
 */
router.get('/admin/transactions', verifyToken, requireRole('admin'), validate(getAllTransactionsSchema), walletController.getAllTransactions);

export default router;
