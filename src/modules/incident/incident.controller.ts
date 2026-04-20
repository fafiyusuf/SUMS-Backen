import { NextFunction, Response, Request } from 'express';
import incidentService from './incident.service';
import { AuthRequest } from '@/middleware/authMiddleware';

export class IncidentController {
  async reportIncident(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = { ...req.body, reportedBy: req.user?.userId || req.body.reportedBy };
      const incident = await incidentService.reportIncident(data);
      res.status(201).json({ success: true, message: 'Incident reported', data: incident });
    } catch (error) {
      next(error);
    }
  }

  async getIncident(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const incident = await incidentService.getIncident(id);
      res.status(200).json({ success: true, message: 'Incident retrieved', data: incident });
    } catch (error: any) {
      if (error.message === 'Incident not found') {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  async getAllIncidents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page as unknown as number;
      const limit = req.query.limit as unknown as number;
      const status = req.query.status as string | undefined;
      const severity = req.query.severity as string | undefined;

      const result = await incidentService.getAllIncidents(page, limit, status, severity);
      res.status(200).json({ success: true, message: 'Incidents retrieved', data: result });
    } catch (error) {
      next(error);
    }
  }

  async updateIncidentStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const incident = await incidentService.updateIncidentStatus(id, status);
      res.status(200).json({ success: true, message: 'Incident updated', data: incident });
    } catch (error: any) {
      if (error.message === 'Incident not found') {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }
}

export default new IncidentController();
