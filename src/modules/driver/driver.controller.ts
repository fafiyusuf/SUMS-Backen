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
      res.status(200).json({ success: true, message: 'Trip started successfully', data });
    } catch (error: any) {
      if (error.status === 404) {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      if (error.status === 400) {
        res.status(400).json({ success: false, message: error.message });
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
      res.status(200).json({ success: true, message: 'Trip ended successfully', data });
    } catch (error: any) {
      if (error.status === 404) {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      if (error.status === 400) {
        res.status(400).json({ success: false, message: error.message });
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
      res.status(200).json({ success: true, message: 'Current trip retrieved', data });
    } catch (error: any) {
      if (error.status === 404) {
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
      if (error.status === 404) {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  async getAssignedBus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const driverId = req.user?.userId;
      if (!driverId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const data = await driverService.getAssignedBus(driverId);
      res.status(200).json({ success: true, message: 'Assigned bus details retrieved', data });
    } catch (error: any) {
      if (error.status === 404) {
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
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const data = await driverService.getHistory(driverId, page, limit);
      res.status(200).json({ success: true, message: 'Driver trip history retrieved', data });
    } catch (error) {
      next(error);
    }
  }
}

export default new DriverController();
