import { NextFunction, Response } from 'express';
import { AuthRequest } from '../../middleware/authMiddleware';
import driverService from './driver.service';

export class DriverController {
  async startTrip(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const driverId = req.user?.userId;
      if (!driverId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const data = await driverService.startTrip(driverId);
      res.status(200).json({ success: true, message: 'Driver trip started', data });
    } catch (error: any) {
      if (error.message === 'No bus assigned to driver') {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  async endTrip(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const driverId = req.user?.userId;
      if (!driverId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const data = await driverService.endTrip(driverId);
      res.status(200).json({ success: true, message: 'Driver trip ended', data });
    } catch (error: any) {
      if (error.message === 'No bus assigned to driver') {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  async getCurrentTrip(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const driverId = req.user?.userId;
      if (!driverId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const data = await driverService.getCurrentTrip(driverId);
      res.status(200).json({ success: true, message: 'Current driver trip retrieved', data });
    } catch (error: any) {
      if (error.message === 'No active trip') {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  async getAssignedRoute(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const driverId = req.user?.userId;
      if (!driverId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const data = await driverService.getAssignedRoute(driverId);
      res.status(200).json({ success: true, message: 'Assigned route details retrieved', data });
    } catch (error: any) {
       if (error.message === 'No assignment found' || error.message === 'Assigned route details not found') {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  async getHistory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const driverId = req.user?.userId;
      if (!driverId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const data = await driverService.getHistory(driverId);
      res.status(200).json({ success: true, message: 'Driver trip history retrieved', data });
    } catch (error) {
      next(error);
    }
  }
}

export default new DriverController();
