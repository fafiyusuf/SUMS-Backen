import { NextFunction, Request, Response } from 'express';
import telebirrService from '../services/telebirrService';

class TelebirrController {
  async createCheckoutUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { amount, subject, outTradeNo, timeoutExpress, notifyUrl, redirectUrl } = req.body as {
        amount: number;
        subject?: string;
        outTradeNo?: string;
        timeoutExpress?: string;
        notifyUrl?: string;
        redirectUrl?: string;
      };

      const result = await telebirrService.createCheckoutUrl({
        amount,
        subject,
        outTradeNo,
        timeoutExpress,
        notifyUrl,
        redirectUrl
      });

      res.status(200).json({
        success: true,
        message: 'Telebirr checkout URL generated successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new TelebirrController();
