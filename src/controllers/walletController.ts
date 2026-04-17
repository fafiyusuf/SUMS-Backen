import { NextFunction, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import walletService from '../services/walletService';

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

			const wallet = await walletService.addBalance(userId, amount);

			res.status(200).json({ success: true, message: 'Top-up initiated', data: wallet });
		} catch (error) {
			next(error);
		}
	}

	// Telebirr webhook receiver (public) - called by Telebirr system
	async telebirrWebhook(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
		try {
			// For now, just acknowledge and record a transaction if provided
			const payload = req.body as any;

			// Expected fields may include: out_trade_no, prepay_id, total_amount, status, buyer_id, reference
			if (payload && payload.out_trade_no && payload.total_amount) {
				// Try to map to a user via stored mapping (not implemented) - best-effort
				// We'll store a pending transaction record if userId provided
				const userId = payload.userId || payload.buyer_id || null;
				await walletService.addBalance(userId as any, parseFloat(payload.total_amount) || 0);
			}

			res.status(200).json({ success: true, message: 'Webhook received' });
		} catch (error) {
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
