import { NextFunction, Request, Response } from 'express';
import { AuthRequest } from '../../middleware/authMiddleware';
import cardService from './card.service';

class CardController {
  async activate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId as string;
      const { cardId } = req.body;
      const card = await cardService.activateCard(cardId, userId);
      res.status(200).json({ success: true, message: 'Card activated', data: card });
    } catch (error: any) {
      if (error && error.status) {
         res.status(error.status).json({ success: false, message: error.message });
         return;
      }
      next(error);
    }
  }

  async myCard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId as string;
      const card = await cardService.getMyCard(userId);
      res.status(200).json({ success: true, message: 'Card retrieved', data: card });
    } catch (error: any) {
      if (error && error.status) {
         res.status(error.status).json({ success: false, message: error.message });
         return;
      }
      next(error);
    }
  }

  async linkTelebirr(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId as string;
      const { phone } = req.body;
      const card = await cardService.linkTelebirr(userId, phone);
      res.status(200).json({ success: true, message: 'Telebirr linked', data: card });
    } catch (error: any) {
      if (error && error.status) {
         res.status(error.status).json({ success: false, message: error.message });
         return;
      }
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page as unknown as number;
      const limit = req.query.limit as unknown as number;
      const offset = (page - 1) * limit;
      const result = await cardService.getAllCards(limit, offset);
      res.status(200).json({ success: true, message: 'Cards retrieved', data: result });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { cardId } = req.params;
      const card = await cardService.getCardById(cardId);
      res.status(200).json({ success: true, message: 'Card retrieved', data: card });
    } catch (error: any) {
      if (error && error.status) {
         res.status(error.status).json({ success: false, message: error.message });
         return;
      }
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { cardId } = req.params;
      const { status } = req.body as { status: 'ACTIVE' | 'SUSPENDED' };
      const card = await cardService.updateCardStatus(cardId, status);
      res.status(200).json({ success: true, message: 'Card status updated', data: card });
    } catch (error: any) {
      if (error && error.status) {
         res.status(error.status).json({ success: false, message: error.message });
         return;
      }
      next(error);
    }
  }
}

export default new CardController();
