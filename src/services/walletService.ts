// import { Wallet, Transaction, User } from '../models';
// import logger from '../utils/logger';

// export class WalletService {
//   async getWallet(userId: string): Promise<any> {
//     try {
//       const wallet = await Wallet.findOne({ where: { userId } });
//       if (!wallet) {
//         throw new Error('Wallet not found');
//       }
//       return wallet;
//     } catch (error) {
//       logger.error(`Get wallet error: ${error}`);
//       throw error;
//     }
//   }

//   async addBalance(userId: string, amount: number): Promise<any> {
//     try {
//       const wallet = await Wallet.findOne({ where: { userId } });
//       if (!wallet) {
//         throw new Error('Wallet not found');
//       }

//       const newBalance = parseFloat(wallet.balance.toString()) + amount;
//       await wallet.update({ balance: newBalance });

//       // Log transaction
//       await Transaction.create({
//         userId,
//         type: 'credit',
//         amount,
//         description: 'Balance added',
//         status: 'completed'
//       });

//       logger.info(`Balance added for user ${userId}: ${amount}`);
//       return wallet;
//     } catch (error) {
//       logger.error(`Add balance error: ${error}`);
//       throw error;
//     }
//   }

//   async deductBalance(userId: string, amount: number, description: string = 'Trip fare'): Promise<any> {
//     try {
//       const wallet = await Wallet.findOne({ where: { userId } });
//       if (!wallet) {
//         throw new Error('Wallet not found');
//       }

//       const currentBalance = parseFloat(wallet.balance.toString());
//       if (currentBalance < amount) {
//         throw new Error('Insufficient balance');
//       }

//       const newBalance = currentBalance - amount;
//       await wallet.update({ balance: newBalance });

//       // Log transaction
//       await Transaction.create({
//         userId,
//         type: 'debit',
//         amount,
//         description,
//         status: 'completed'
//       });

//       logger.info(`Balance deducted for user ${userId}: ${amount}`);
//       return wallet;
//     } catch (error) {
//       logger.error(`Deduct balance error: ${error}`);
//       throw error;
//     }
//   }

//   async getTransactionHistory(userId: string, limit: number = 10, offset: number = 0): Promise<any> {
//     try {
//       const transactions = await Transaction.findAll({
//         where: { userId },
//         limit,
//         offset,
//         order: [['createdAt', 'DESC']]
//       });

//       const total = await Transaction.count({ where: { userId } });

//       return {
//         transactions,
//         total,
//         limit,
//         offset
//       };
//     } catch (error) {
//       logger.error(`Get transaction history error: ${error}`);
//       throw error;
//     }
//   }
// }

// export default new WalletService();
