// import { NextFunction, Request, Response } from 'express';
// import { Incident } from '../models';
// import logger from '../utils/logger';

// export class IncidentController {
//   async reportIncident(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const { busId, type, severity, description, reportedBy } = req.body;

//       const incident = await Incident.create({
//         busId,
//         type,
//         severity,
//         description,
//         reportedBy,
//         status: 'open'
//       });

//       logger.info(`Incident reported: ${incident.id} - ${severity}`);

//       res.status(201).json({
//         success: true,
//         message: 'Incident reported',
//         data: incident
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   async getIncident(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const { id } = req.params;

//       const incident = await Incident.findByPk(id);

//       if (!incident) {
//         res.status(404).json({
//           success: false,
//           message: 'Incident not found'
//         });
//         return;
//       }

//       res.status(200).json({
//         success: true,
//         message: 'Incident retrieved',
//         data: incident
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   async getAllIncidents(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const page = parseInt(req.query.page as string) || 1;
//       const limit = parseInt(req.query.limit as string) || 10;
//       const status = req.query.status as string;
//       const severity = req.query.severity as string;

//       const offset = (page - 1) * limit;
//       const where: any = {};

//       if (status) where.status = status;
//       if (severity) where.severity = severity;

//       const incidents = await Incident.findAll({
//         where,
//         limit,
//         offset,
//         order: [['createdAt', 'DESC']]
//       });

//       const total = await Incident.count({ where });

//       res.status(200).json({
//         success: true,
//         message: 'Incidents retrieved',
//         data: {
//           incidents,
//           total,
//           page,
//           limit
//         }
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   async updateIncidentStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const { id } = req.params;
//       const { status } = req.body;

//       const incident = await Incident.findByPk(id);

//       if (!incident) {
//         res.status(404).json({
//           success: false,
//           message: 'Incident not found'
//         });
//         return;
//       }

//       await incident.update({ status });

//       res.status(200).json({
//         success: true,
//         message: 'Incident updated',
//         data: incident
//       });
//     } catch (error) {
//       next(error);
//     }
//   }
// }

// export default new IncidentController();
