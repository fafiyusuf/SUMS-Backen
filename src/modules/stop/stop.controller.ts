import { NextFunction, Request, Response } from 'express';
import stopService from './stop.service';

export class StopController {
  async getAllStops(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stops = await stopService.getAllStops();
      res.status(200).json({ success: true, message: 'All stops retrieved', data: stops });
    } catch (error) {
      next(error);
    }
  }

  async getStopsByRoute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { routeId } = req.params;
      const stops = await stopService.getStopsByRoute(routeId);
      res.status(200).json({ success: true, message: 'Stops for route retrieved', data: stops });
    } catch (error) {
      next(error);
    }
  }

  async getStop(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const stop = await stopService.getStop(id);
      res.status(200).json({ success: true, message: 'Stop retrieved', data: stop });
    } catch (error: any) {
      if (error.message === 'Stop not found') {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  async createStop(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stop = await stopService.createStop(req.body);
      res.status(201).json({ success: true, message: 'Stop created', data: stop });
    } catch (error) {
      next(error);
    }
  }

  async updateStop(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const stop = await stopService.updateStop(id, req.body);
      res.status(200).json({ success: true, message: 'Stop updated', data: stop });
    } catch (error: any) {
      if (error.message === 'Stop not found') {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  async deleteStop(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await stopService.deleteStop(id);
      res.status(200).json({ success: true, message: 'Stop deleted successfully' });
    } catch (error: any) {
      if (error.message === 'Stop not found') {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  async updateStopSequence(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await stopService.updateStopSequence(req.body.sequence);
      res.status(200).json({ success: true, message: 'Stops sequence updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getStopETA(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const etas = await stopService.getStopETA(id);
      res.status(200).json({ success: true, message: 'Stop ETA retrieved', data: etas });
    } catch (error: any) {
      if (error.message === 'Stop not found') {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }
}

export default new StopController();
