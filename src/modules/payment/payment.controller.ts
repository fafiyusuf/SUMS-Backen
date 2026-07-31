import { Response } from 'express';
import { AuthRequest } from '../../middleware/authMiddleware';
import * as paymentService from './payment.service';
import logger from '../../utils/logger';

export async function verifyReceipt(req: AuthRequest, res: Response): Promise<void> {
    try {
        const { receiptUrl } = req.body as { receiptUrl?: string };
        const userId = req.user?.userId;

        if (!receiptUrl || typeof receiptUrl !== 'string' || !receiptUrl.trim()) {
            res.status(400).json({ success: false, message: 'receiptUrl is required.' });
            return;
        }

        if (!userId) {
            res.status(401).json({ success: false, message: 'Authentication required.' });
            return;
        }

        const result = await paymentService.verifyReceipt({ receiptUrl: receiptUrl.trim(), userId });

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
            status: err.status
        });

        if (status === 409) {
            res.status(409).json({ success: false, message: 'Receipt already used.' });
            return;
        }

        res.status(status).json({ success: false, message });
    }
}
