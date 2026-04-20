import express from 'express';
import walletController from './wallet.controller';
import verifyToken from '@/middleware/authMiddleware';
import requireRole from '@/middleware/roleMiddleware';
import validate from '@/middleware/validate';
import {
  topupSchema,
  getTransactionsSchema,
  deductSchema,
  getRevenueSchema,
  getAllTransactionsSchema
} from './wallet.schema';

const router = express.Router();

router.get('/', verifyToken, requireRole('passenger', 'admin'), walletController.getWallet);

router.post('/topup', verifyToken, requireRole('passenger'), validate(topupSchema), walletController.topup);

// Note: Ensure webhook validation middleware exists or relies on telebirr signature checks
router.post('/webhook/telebirr', walletController.telebirrWebhook);

router.get('/transactions', verifyToken, requireRole('passenger'), validate(getTransactionsSchema), walletController.getTransactionHistory);

router.post('/deduct', verifyToken, requireRole('admin', 'driver', 'system'), validate(deductSchema), walletController.deduct);

// Admin
router.get('/admin/revenue', verifyToken, requireRole('admin'), validate(getRevenueSchema), walletController.getRevenue);

router.get('/admin/transactions', verifyToken, requireRole('admin'), validate(getAllTransactionsSchema), walletController.getAllTransactions);

export default router;
