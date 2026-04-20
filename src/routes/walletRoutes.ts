import express from 'express';
import walletController from '../controllers/walletController';
import verifyToken from '../middleware/authMiddleware';
import requireRole from '../middleware/roleMiddleware';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Wallet
 *     description: Wallet and payment related endpoints
 */

/**
 * @openapi
 * /wallet/balance:
 *   get:
 *     summary: Get current wallet balance
 *     tags:
 *       - Wallet
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Wallet retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 */

// Passenger endpoints
router.get('/balance', verifyToken, requireRole('passenger'), (req, res, next) =>
	walletController.getWallet(req as any, res as any, next as any)
);

/**
 * @openapi
 * /wallet/topup:
 *   post:
 *     summary: Initiate wallet top-up
 *     tags:
 *       - Wallet
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Top-up initiated
 */
router.post('/topup', verifyToken, requireRole('passenger'), (req, res, next) =>
	walletController.topup(req as any, res as any, next as any)
);

/**
 * @openapi
 * /wallet/transactions:
 *   get:
 *     summary: Get wallet transaction history
 *     tags:
 *       - Wallet
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Transactions retrieved
 */
router.get('/transactions', verifyToken, requireRole('passenger'), (req, res, next) =>
	walletController.getTransactionHistory(req as any, res as any, next as any)
);

// Telebirr webhook - public
/**
 * @openapi
 * /wallet/telebirr/webhook:
 *   post:
 *     summary: Telebirr payment webhook (callback)
 *     tags:
 *       - Wallet
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       '200':
 *         description: Webhook received
 */
router.post('/telebirr/webhook', (req, res) => walletController.telebirrWebhook(req as any, res as any));

// Telebirr verify endpoint
router.get('/telebirr/verify', verifyToken, (req, res, next) => walletController.telebirrVerify(req as any, res as any, next as any));
// Internal system endpoint for fare deduction (no role required but could be protected by internal network)
/**
 * @openapi
 * /wallet/deduct:
 *   post:
 *     summary: Deduct fare from wallet (internal)
 *     tags:
 *       - Wallet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Deduction successful
 */
router.post('/deduct', (req, res, next) => walletController.deduct(req as any, res as any, next as any));

// Admin endpoints
/**
 * @openapi
 * /wallet/admin/revenue:
 *   get:
 *     summary: Get revenue reports
 *     tags:
 *       - Wallet
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Revenue retrieved
 */
router.get('/admin/revenue', verifyToken, requireRole('admin'), (req, res, next) =>
	walletController.getRevenue(req as any, res as any, next as any)
);

/**
 * @openapi
 * /wallet/admin/transactions:
 *   get:
 *     summary: Get all transactions (admin)
 *     tags:
 *       - Wallet
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: All transactions retrieved
 */
router.get('/admin/transactions', verifyToken, requireRole('admin'), (req, res, next) =>
	walletController.getAllTransactions(req as any, res as any, next as any)
);

export default router;
