import { NextFunction, Request, Response } from 'express';
import tapService from './tap.service';

export class TapController {
    async tapIn(req: Request, res: Response, _next: NextFunction) {
        try {
            const result = await tapService.tapIn(req.body);
            res.status(200).json({ success: true, message: 'Tap-in successful', data: result });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async tapOut(req: Request, res: Response, _next: NextFunction) {
        try {
            const result = await tapService.tapOut(req.body);
            res.status(200).json({ success: true, message: 'Tap-out successful', data: result });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async validateCard(req: Request, res: Response, _next: NextFunction) {
        try {
            const { cardId } = req.params;
            const result = await tapService.validateCard(cardId);
            res.status(200).json({ success: true, message: 'Card validation successful', data: result });
        } catch (error: any) {
            res.status(404).json({ success: false, message: error.message });
        }
    }
}

export default new TapController();
