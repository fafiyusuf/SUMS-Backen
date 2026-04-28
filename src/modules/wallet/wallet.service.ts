import { Op } from 'sequelize';
import logger from '../../utils/logger';
import { Transaction } from './transaction.model';
import { Wallet } from './wallet.model';

export interface AddBalanceOptions {
	logTransaction?: boolean;
	description?: string;
}

export class WalletService {
	async getWallet(userId: string): Promise<any> {
		try {
			const wallet = await Wallet.findOne({ where: { userId } });
			if (!wallet) {
				throw new Error('Wallet not found');
			}
			return wallet;
		} catch (error) {
			logger.error(`Get wallet error: ${error}`);
			throw error;
		}
	}

	async addBalance(userId: string, amount: number, options: AddBalanceOptions = {}): Promise<any> {
		try {
			const wallet = await Wallet.findOne({ where: { userId } });
			if (!wallet) {
				throw new Error('Wallet not found');
			}

			const newBalance = parseFloat((wallet as any).balance.toString()) + amount;
			await wallet.update({ balance: newBalance });

			const shouldLogTransaction = options.logTransaction !== false;
			if (shouldLogTransaction) {
				await Transaction.create({
					userId,
					type: 'credit',
					amount,
					description: options.description || 'Balance added',
					status: 'completed'
				} as any);
			}

			logger.info(`Balance added for user ${userId}: ${amount}`);
			return wallet;
		} catch (error) {
			logger.error(`Add balance error: ${error}`);
			throw error;
		}
	}

	async deductBalance(userId: string, amount: number, description: string = 'Trip fare'): Promise<any> {
		try {
			const wallet = await Wallet.findOne({ where: { userId } });
			if (!wallet) {
				throw new Error('Wallet not found');
			}

			const currentBalance = parseFloat((wallet as any).balance.toString());
			if (currentBalance < amount) {
				throw new Error('Insufficient balance');
			}

			const newBalance = currentBalance - amount;
			await wallet.update({ balance: newBalance });

			// Log transaction
			await Transaction.create({
				userId,
				type: 'debit',
				amount,
				description,
				status: 'completed'
			} as any);

			logger.info(`Balance deducted for user ${userId}: ${amount}`);
			return wallet;
		} catch (error) {
			logger.error(`Deduct balance error: ${error}`);
			throw error;
		}
	}

	async getTransactionHistory(userId: string, limit: number = 10, offset: number = 0): Promise<any> {
		try {
			const transactions = await Transaction.findAll({
				where: { userId },
				limit,
				offset,
				order: [['createdAt', 'DESC']]
			});

			const total = await Transaction.count({ where: { userId } });

			return {
				transactions,
				total,
				limit,
				offset
			};
		} catch (error) {
			logger.error(`Get transaction history error: ${error}`);
			throw error;
		}
	}

	async getAllTransactions(limit: number = 20, offset: number = 0): Promise<any> {
		try {
			const transactions = await Transaction.findAll({
				limit,
				offset,
				order: [['createdAt', 'DESC']]
			});

			const total = await Transaction.count();

			return { transactions, total, limit, offset };
		} catch (error) {
			logger.error(`Get all transactions error: ${error}`);
			throw error;
		}
	}

	async getRevenue(startDate?: string, endDate?: string): Promise<any> {
		try {
			const where: any = { type: 'debit', status: 'completed' };
			if (startDate || endDate) {
				where.createdAt = {} as any;
				if (startDate) where.createdAt[Op.gte] = new Date(startDate);
				if (endDate) where.createdAt[Op.lte] = new Date(endDate);
			}

			// Use raw query for sum to keep it simple
			const result: any = await Transaction.sequelize?.model('Transaction').sum('amount', { where }) ?? 0;
			const totalRevenue = Number(result) || 0;

			return { totalRevenue };
		} catch (error) {
			logger.error(`Get revenue error: ${error}`);
			throw error;
		}
	}
}

export default new WalletService();
