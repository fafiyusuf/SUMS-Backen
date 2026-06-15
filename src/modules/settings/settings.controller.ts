import { NextFunction, Request, Response } from 'express';
import settingsService from './settings.service';

export class SettingsController {
    async getAllSettings(_req: Request, res: Response, next: NextFunction) {
        try {
            const settings = await settingsService.getAllSettings();
            res.json({ success: true, data: settings });
        } catch (error) {
            next(error);
        }
    }

    async updateSetting(req: Request, res: Response, next: NextFunction) {
        try {
            const { key, value, description } = req.body;
            const adminId = (req as any).user.id;

            const setting = await settingsService.updateSetting(key, value, adminId, description);
            res.json({ success: true, message: `Setting ${key} updated successfully`, data: setting });
        } catch (error) {
            next(error);
        }
    }
}

export default new SettingsController();
