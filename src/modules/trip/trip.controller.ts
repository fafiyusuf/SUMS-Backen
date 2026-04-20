import { NextFunction, Request, Response } from 'express';
import tripService from './trip.service';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export class TripController {
  async createTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const trip = await tripService.createTrip(req.body);
      res.status(201).json({ success: true, message: 'Trip created', data: trip });
    } catch (error: any) {
      if (error.message === 'Trip not found') {
         res.status(404).json({ success: false, message: error.message });
         return;
      }
      next(error);
    }
  }

  async getTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const trip = await tripService.getTrip(id);
      res.status(200).json({ success: true, message: 'Trip retrieved', data: trip });
    } catch (error: any) {
      if (error.message === 'Trip not found') {
         res.status(404).json({ success: false, message: error.message });
         return;
      }
      next(error);
    }
  }

  async getUserTrips(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const page = req.query.page as unknown as number;
      const limit = req.query.limit as unknown as number;

      const result = await tripService.getUserTrips(userId, page, limit);

      res.status(200).json({ success: true, message: 'Trips retrieved', data: result });
    } catch (error) {
      next(error);
    }
  }

  async getPassengerHistory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const page = req.query.page as unknown as number;
      const limit = req.query.limit as unknown as number;

      const result = await tripService.getPassengerHistory(userId, page, limit);

      res.status(200).json({ success: true, message: 'History retrieved', data: result });
    } catch (error) {
      next(error);
    }
  }

  async completeTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { endStopId } = req.body;
      
      const trip = await tripService.completeTrip(id, endStopId);
      res.status(200).json({ success: true, message: 'Trip completed', data: trip });
    } catch (error: any) {
      if (error.message === 'Trip not found') {
         res.status(404).json({ success: false, message: error.message });
         return;
      }
      next(error);
    }
  }

  async cancelTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const trip = await tripService.cancelTrip(id);
      res.status(200).json({ success: true, message: 'Trip cancelled', data: trip });
    } catch (error: any) {
      if (error.message === 'Trip not found') {
         res.status(404).json({ success: false, message: error.message });
         return;
      }
      next(error);
    }
  }

  async getAllTrips(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page as unknown as number;
      const limit = req.query.limit as unknown as number;

      const result = await tripService.getAllTrips(page, limit);

      res.status(200).json({ success: true, message: 'All trips retrieved', data: result });
    } catch (error) {
      next(error);
    }
  }
}

export default new TripController();
