import { Request, Response, NextFunction } from 'express';
import telebirrH5Service from './telebirrH5.service';

class TelebirrH5Controller {
  async token(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = await telebirrH5Service.getFabricToken();
      res.json({ success: true, token });
    } catch (err) {
      next(err);
    }
  }

  async authToken(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const fabric = await telebirrH5Service.getFabricToken();
      const auth = await telebirrH5Service.getAuthToken(fabric);
      res.json({ success: true, auth });
    } catch (err) {
      next(err);
    }
  }

  async preOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { amount, subject, outTradeNo, notifyUrl, redirectUrl } = req.body;
      const fabric = await telebirrH5Service.getFabricToken();
      const auth = await telebirrH5Service.getAuthToken(fabric);
      const r = await telebirrH5Service.createPreOrder({ amount, subject, outTradeNo, notifyUrl, redirectUrl }, auth);
      res.json({ success: true, data: r });
    } catch (err) {
      next(err);
    }
  }

  async refund(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { outTradeNo, refundAmount, reason } = req.body;
      const r = await telebirrH5Service.refundOrder(outTradeNo, refundAmount, reason);
      res.json({ success: true, data: r });
    } catch (err) {
      next(err);
    }
  }

  async notify(req: Request, res: Response): Promise<void> {
    const signature = (req.headers['x-telebirr-signature'] as string) || (req.body && (req.body.sign as string));
    const verified = telebirrH5Service.verifyNotify(req.body, signature);
    if (!verified) {
      res.status(400).send('signature verification failed');
      return;
    }

    console.log('Telebirr notify received', req.body);
    res.json({ success: true });
  }
}

export default new TelebirrH5Controller();
