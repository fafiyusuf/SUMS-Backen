import { NextFunction, Request, Response } from 'express';
import { Stop } from '../models';

export class StopController {

  async getAllStops(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stops = await Stop.findAll({
        order: [['createdAt', 'DESC']]
      });

      res.status(200).json({
        success: true,
        message: 'All stops retrieved',
        data: stops
      });
    } catch (error) {
      next(error);
    }
  }

  async getStop(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const stop = await Stop.findByPk(id);

      if (!stop) {
        res.status(404).json({
          success: false,
          message: 'Stop not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Stop retrieved',
        data: stop
      });
    } catch (error) {
      next(error);
    }
  }

  async createStop(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stopData = req.body;

      const stop = await Stop.create(stopData);

      res.status(201).json({
        success: true,
        message: 'Stop created',
        data: stop
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStop(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const stop = await Stop.findByPk(id);

      if (!stop) {
        res.status(404).json({
          success: false,
          message: 'Stop not found'
        });
        return;
      }

      await stop.update(updateData);

      res.status(200).json({
        success: true,
        message: 'Stop updated',
        data: stop
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new StopController();
