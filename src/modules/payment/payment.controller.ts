import { Request, Response } from 'express';
import * as paymentService from './payment.service';
import logger from '../../utils/logger';

export async function verifyReceipt(req: Request, res: Response): Promise<void> {
    try {
        const { receiptUrl } = req.body as { receiptUrl?: string };

        if (!receiptUrl || typeof receiptUrl !== 'string' || !receiptUrl.trim()) {
            res.status(400).json({ success: false, message: 'receiptUrl is required.' });
            return;
        }

        const result = await paymentService.verifyReceipt(receiptUrl.trim());

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully.',
            data: {
                invoiceNo: result.invoiceNo,
                sender: result.sender,
                creditedAmount: result.creditedAmount,
                newBalance: result.newBalance
            }
        });
    } catch (err: any) {
        const status: number = err.status || 500;

        // Sequelize errors often have an empty .message; dig into .original for the real cause
        const message: string =
            (err.message && err.message.trim()) ||
            (err.original?.message && err.original.message.trim()) ||
            err.name ||
            'An unexpected error occurred.';

        logger.error(`[PaymentController] verifyReceipt failed (HTTP ${status}): ${message}`);
        console.error(`[PaymentController] full error:`, {
            name: err.name,
            message: err.message,
            original: err.original?.message,
            status: err.status,
            stack: err.stack
        });

        if (status === 409) {
            res.status(409).json({ success: false, message: 'Receipt already used.' });
            return;
        }

        res.status(status).json({ success: false, message });
    }
}
