import { Request, Response, NextFunction } from 'express';
import cardService from '../services/cardService';
import { AuthRequest } from '../middleware/authMiddleware';

class CardController {
  async activate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId as string;
      const { cardId } = req.body;
      const card = await cardService.activateCard(cardId, userId);
      res.status(200).json({ success: true, message: 'Card activated', data: card });
    } catch (error) {
      next(error);
    }
  }

  async myCard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId as string;
      const card = await cardService.getMyCard(userId);
      res.status(200).json({ success: true, message: 'Card retrieved', data: card });
    } catch (error) {
      next(error);
    }
  }

  async linkTelebirr(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId as string;
      const { phone } = req.body;
      const card = await cardService.linkTelebirr(userId, phone);
      res.status(200).json({ success: true, message: 'Telebirr linked', data: card });
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt((req.query.page as string) || '1', 10);
      const limit = parseInt((req.query.limit as string) || '20', 10);
      const offset = (page - 1) * limit;
      const result = await cardService.getAllCards(limit, offset);
      res.status(200).json({ success: true, message: 'Cards retrieved', data: result });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { cardId } = req.params;
      const card = await cardService.getCardById(cardId);
      res.status(200).json({ success: true, message: 'Card retrieved', data: card });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { cardId } = req.params;
      const { status } = req.body as { status: 'ACTIVE' | 'SUSPENDED' };
      const card = await cardService.updateCardStatus(cardId, status);
      res.status(200).json({ success: true, message: 'Card status updated', data: card });
    } catch (error) {
      next(error);
    }
  }
}

export default new CardController();
