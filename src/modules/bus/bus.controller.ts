import { NextFunction, Request, Response } from 'express';
import busService from './bus.service';

export class BusController {
  async createBus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bus = await busService.createBus(req.body);
      res.status(201).json({ success: true, message: 'Bus created', data: bus });
    } catch (error: any) {
      if (error.status === 400) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      if (error.status === 404) {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  async getBus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const bus = await busService.getBus(id);
      res.status(200).json({ success: true, message: 'Bus retrieved', data: bus });
    } catch (error: any) {
      if (error.status === 404) {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  async getAllBuses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters = {
        status: req.query.status,
        routeId: req.query.routeId
      };
      const result = await busService.getAllBuses(page, limit, filters);
      res.status(200).json({ success: true, message: 'Buses retrieved', data: result });
    } catch (error) {
      next(error);
    }
  }

  async updateBus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const bus = await busService.updateBus(id, req.body);
      res.status(200).json({ success: true, message: 'Bus updated', data: bus });
    } catch (error: any) {
      if (error.status === 400) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      if (error.status === 404) {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  async deleteBus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await busService.deleteBus(id);
      res.status(200).json({ success: true, message: 'Bus deleted' });
    } catch (error: any) {
      if (error.status === 404) {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }
}

export default new BusController();
