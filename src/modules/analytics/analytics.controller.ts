import { NextFunction, Request, Response } from 'express';
import analyticsService from './analytics.service';

export class AnalyticsController {
    async getPassengerStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const stats = await analyticsService.getPassengerStats();
            res.status(200).json({ success: true, data: stats });
        } catch (error) {
            next(error);
        }
    }

    async getPeakHours(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await analyticsService.getPeakHours();
            res.status(200).json({ success: true, data: data });
        } catch (error) {
            next(error);
        }
    }

    async getRouteEfficiency(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await analyticsService.getRouteEfficiency();
            res.status(200).json({ success: true, data: data });
        } catch (error) {
            next(error);
        }
    }

    async getDashboardSummary(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await analyticsService.getDashboardSummary();
            res.status(200).json({ success: true, data: data });
        } catch (error) {
            next(error);
        }
    }
}

export default new AnalyticsController();
