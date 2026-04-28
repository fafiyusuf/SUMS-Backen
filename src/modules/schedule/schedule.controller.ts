import { Request, Response, NextFunction } from 'express';
import scheduleService from './schedule.service';

class ScheduleController {
  async getRouteSchedules(req: Request, res: Response, next: NextFunction) {
    try {
      const { routeId } = req.params;
      const schedules = await scheduleService.getSchedulesByRoute(routeId);
      res.status(200).json({ success: true, data: schedules });
    } catch (error) {
      next(error);
    }
  }

  async createSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const schedule = await scheduleService.createSchedule(req.body);
      res.status(201).json({ success: true, data: schedule, message: 'Schedule created successfully' });
    } catch (error) {
      next(error);
    }
  }

  async updateSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const { scheduleId } = req.params;
      const schedule = await scheduleService.updateSchedule(scheduleId, req.body);
      res.status(200).json({ success: true, data: schedule, message: 'Schedule updated successfully' });
    } catch (error: any) {
      if (error.message === 'Schedule not found') {
        res.status(404).json({ success: false, message: 'Schedule not found' });
      } else {
        next(error);
      }
    }
  }
}

export default new ScheduleController();
