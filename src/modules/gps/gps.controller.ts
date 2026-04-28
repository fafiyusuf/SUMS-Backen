import { NextFunction, Request, Response } from 'express';
import gpsService from './gps.service';

export class GPSController {
  async recordGPSData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gpsData = await gpsService.recordGPSData(req.body);

      res.status(201).json({
        success: true,
        message: 'GPS data recorded',
        data: gpsData
      });
    } catch (error) {
      next(error);
    }
  }

  async getLatestGPSData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { busId } = req.params;

      const gpsData = await gpsService.getLatestGPSData(busId);

      res.status(200).json({
        success: true,
        message: 'GPS data retrieved',
        data: gpsData
      });
    } catch (error: any) {
      if (error.message === 'GPS data not found') {
        res.status(404).json({
          success: false,
          message: error.message
        });
        return;
      }
      next(error);
    }
  }

  async getGPSTrack(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { busId } = req.params;
      const minutes = req.query.minutes as unknown as number;

      const track = await gpsService.getGPSTrack(busId, minutes);

      res.status(200).json({
        success: true,
        message: 'GPS track retrieved',
        data: track
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new GPSController();
