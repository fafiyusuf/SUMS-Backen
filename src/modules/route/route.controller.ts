import { NextFunction, Request, Response } from 'express';
import routeService from './route.service';

export class RouteController {
  async createRoute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const route = await routeService.createRoute(req.body);
      res.status(201).json({ success: true, message: 'Route created', data: route });
    } catch (error) {
      next(error);
    }
  }

  async getRoute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { routeId } = req.params;
      const route = await routeService.getRoute(routeId);
      res.status(200).json({ success: true, message: 'Route retrieved', data: route });
    } catch (error: any) {
      if (error.message === 'Route not found') {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  async getAllRoutes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Parse query params as integers with defaults
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string | undefined;

      const result = await routeService.getAllRoutes(page, limit, status);
      res.status(200).json({ success: true, message: 'Routes retrieved', data: result });
    } catch (error) {
      next(error);
    }
  }

  async updateRoute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { routeId } = req.params;
      const route = await routeService.updateRoute(routeId, req.body);
      res.status(200).json({ success: true, message: 'Route updated', data: route });
    } catch (error: any) {
      if (error.message === 'Route not found') {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  async deleteRoute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { routeId } = req.params;
      await routeService.deleteRoute(routeId);
      res.status(200).json({ success: true, message: 'Route deleted' });
    } catch (error: any) {
      if (error.message === 'Route not found') {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }
}

export default new RouteController();
