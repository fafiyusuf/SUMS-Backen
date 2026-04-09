// // import { NextFunction, Response } from 'express';
// // import { AuthRequest } from '../middleware/authMiddleware';
// // import walletService from '../services/walletService';
// 
// // export class WalletController {
// //   async getWallet(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
// //     try {
// //       const userId = req.user?.userId;
// 
// //       if (!userId) {
// //         res.status(401).json({
// //           success: false,
// //           message: 'Unauthorized'
// //         });
// //         return;
// //       }
// 
// //       const wallet = await walletService.getWallet(userId);
// 
// //       res.status(200).json({
// //         success: true,
// //         message: 'Wallet retrieved',
// //         data: wallet
// //       });
// //     } catch (error) {
// //       next(error);
// //     }
// //   }
// 
// //   async addBalance(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
// //     try {
// //       const userId = req.user?.userId;
// //       const { amount } = req.body;
// 
// //       if (!userId) {
// //         res.status(401).json({
// //           success: false,
// //           message: 'Unauthorized'
// //         });
// //         return;
// //       }
// 
// //       const wallet = await walletService.addBalance(userId, amount);
// 
// //       res.status(200).json({
// //         success: true,
// //         message: 'Balance added successfully',
// //         data: wallet
// //       });
// //     } catch (error) {
// //       next(error);
// //     }
// //   }
// 
// //   async getTransactionHistory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
// //     try {
// //       const userId = req.user?.userId;
// //       const page = parseInt(req.query.page as string) || 1;
// //       const limit = parseInt(req.query.limit as string) || 10;
// 
// //       if (!userId) {
// //         res.status(401).json({
// //           success: false,
// //           message: 'Unauthorized'
// //         });
// //         return;
// //       }
// 
// //       const offset = (page - 1) * limit;
// //       const transactions = await walletService.getTransactionHistory(userId, limit, offset);
// 
// //       res.status(200).json({
// //         success: true,
// //         message: 'Transactions retrieved',
// //         data: transactions
// //       });
// //     } catch (error) {
// //       next(error);
// //     }
// //   }
// // }
// 
// // export default new WalletController();
