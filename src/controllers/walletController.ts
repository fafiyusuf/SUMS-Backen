import { NextFunction, Response, Request } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import walletService from '../services/walletService';
import telebirrService from '../services/walletTelebirrService';
import logger from '../utils/logger';
import crypto from 'crypto';

class WalletController {
	async getWallet(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user?.userId;

			if (!userId) {
				res.status(401).json({ success: false, message: 'Unauthorized' });
				return;
			}

			const wallet = await walletService.getWallet(userId);

			res.status(200).json({ success: true, message: 'Wallet retrieved', data: wallet });
		} catch (error) {
			next(error);
		}
	}

	async topup(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user?.userId;
			const { amount } = req.body as { amount: number };

			if (!userId) {
				res.status(401).json({ success: false, message: 'Unauthorized' });
				return;
			}

			if (!amount || amount <= 0) {
				res.status(400).json({ success: false, message: 'Invalid amount' });
				return;
			}

			// Initiate Telebirr checkout to top up wallet (creates pending transaction)
			const user = req.user;
			const result = await telebirrService.createWalletTopup(userId as string, amount, (user as any).phone || '');

			res.status(200).json({ success: true, message: 'Top-up initiated', data: result });
		} catch (error) {
			logger.error(`Wallet topup error: ${error}`);
			next(error);
		}
	}

	// Telebirr webhook receiver (public) - verifies signature and forwards to telebirrService
	async telebirrWebhook(req: Request, res: Response): Promise<void> {
		try {
			const payload = req.body as any;

			// Verify signature if secret configured
			const webhookSecret = process.env.TELEBIRR_WEBHOOK_SECRET;
			if (webhookSecret) {
				const signature = (req.headers['x-telebirr-signature'] as string) || '';
				const expected = crypto.createHmac('sha256', webhookSecret).update(JSON.stringify(payload)).digest('hex');
				if (!signature || signature !== expected) {
					res.status(401).json({ success: false, message: 'Invalid webhook signature' });
					return;
				}
			}

			if (!payload.outTradeNo || !payload.status) {
				res.status(400).json({ success: false, message: 'Invalid webhook payload' });
				return;
			}

			await telebirrService.processWebhook({ outTradeNo: payload.outTradeNo, status: payload.status, amount: parseFloat(payload.amount || payload.total_amount || 0) });

			res.status(200).send('OK');
		} catch (error: any) {
			logger.error(`Wallet Telebirr webhook error: ${error.message}`);
			res.status(500).json({ success: false, message: 'Webhook processing failed' });
		}
	}

	// Verify transaction status (Telebirr)
	async telebirrVerify(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { tradeNo } = req.query;
			if (!tradeNo) {
				res.status(400).json({ success: false, message: 'Transaction number is required' });
				return;
			}

			const result = await telebirrService.verifyTransaction(tradeNo as string);
			res.status(200).json(result);
		} catch (error: any) {
			next(error);
		}
	}

	async getTransactionHistory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user?.userId;
			const page = parseInt((req.query.page as string) || '1', 10) || 1;
			const limit = parseInt((req.query.limit as string) || '10', 10) || 10;

			if (!userId) {
				res.status(401).json({ success: false, message: 'Unauthorized' });
				return;
			}

			const offset = (page - 1) * limit;
			const transactions = await walletService.getTransactionHistory(userId, limit, offset);

			res.status(200).json({ success: true, message: 'Transactions retrieved', data: transactions });
		} catch (error) {
			next(error);
		}
	}

	// Internal deduct endpoint - only system internal callers should use this
	async deduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
		try {
			const { userId, amount, description } = req.body as { userId: string; amount: number; description?: string };

			if (!userId || !amount) {
				res.status(400).json({ success: false, message: 'Missing userId or amount' });
				return;
			}

			const wallet = await walletService.deductBalance(userId, amount, description || 'Fare deduction');

			res.status(200).json({ success: true, message: 'Deduction successful', data: wallet });
		} catch (error) {
			next(error);
		}
	}

	// Admin endpoints
	async getRevenue(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
		try {
			const { startDate, endDate } = req.query as any;
			const revenue = await walletService.getRevenue(startDate, endDate);
			res.status(200).json({ success: true, message: 'Revenue retrieved', data: revenue });
		} catch (error) {
			next(error);
		}
	}

	async getAllTransactions(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
		try {
			const page = parseInt((req.query.page as string) || '1', 10) || 1;
			const limit = parseInt((req.query.limit as string) || '20', 10) || 20;
			const offset = (page - 1) * limit;
			const result = await walletService.getAllTransactions(limit, offset);
			res.status(200).json({ success: true, message: 'All transactions retrieved', data: result });
		} catch (error) {
			next(error);
		}
	}
}

export default new WalletController();
