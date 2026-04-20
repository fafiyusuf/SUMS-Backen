import { NextFunction, Response } from 'express';
import { AuthRequest } from '@/middleware/authMiddleware';
import walletService from './wallet.service';

export class WalletController {
  async getWallet(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const wallet = await walletService.getWallet(userId);
      res.status(200).json({ success: true, message: 'Wallet retrieved', data: wallet });
    } catch (error: any) {
      if (error.message === 'Wallet not found') {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  async topup(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const { amount } = req.body as { amount: number };
      const wallet = await walletService.addBalance(userId, amount);
      res.status(200).json({ success: true, message: 'Top-up initiated', data: wallet });
    } catch (error: any) {
      if (error.message === 'Wallet not found') {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  async telebirrWebhook(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const payload = req.body as any;
      if (payload && payload.out_trade_no && payload.total_amount) {
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
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const page = req.query.page as unknown as number;
      const limit = req.query.limit as unknown as number;
      const offset = (page - 1) * limit;

      const transactions = await walletService.getTransactionHistory(userId, limit, offset);
      res.status(200).json({ success: true, message: 'Transactions retrieved', data: transactions });
    } catch (error) {
      next(error);
    }
  }

  async deduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, amount, description } = req.body as { userId: string; amount: number; description?: string };
      const wallet = await walletService.deductBalance(userId, amount, description || 'Fare deduction');
      res.status(200).json({ success: true, message: 'Deduction successful', data: wallet });
    } catch (error: any) {
      if (error.message === 'Wallet not found' || error.message === 'Insufficient balance') {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

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
      const page = req.query.page as unknown as number;
      const limit = req.query.limit as unknown as number;
      const offset = (page - 1) * limit;
      
      const result = await walletService.getAllTransactions(limit, offset);
      res.status(200).json({ success: true, message: 'All transactions retrieved', data: result });
    } catch (error) {
      next(error);
    }
  }
}

export default new WalletController();
