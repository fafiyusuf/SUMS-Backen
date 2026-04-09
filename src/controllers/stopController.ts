// // import { NextFunction, Request, Response } from 'express';
// // import { Stop } from '../models';
// 
// // export class StopController {
// //   async createStop(req: Request, res: Response, next: NextFunction): Promise<void> {
// //     try {
// //       const stopData = req.body;
// 
// //       const stop = await Stop.create(stopData);
// 
// //       res.status(201).json({
// //         success: true,
// //         message: 'Stop created',
// //         data: stop
// //       });
// //     } catch (error) {
// //       next(error);
// //     }
// //   }
// 
// //   async getStop(req: Request, res: Response, next: NextFunction): Promise<void> {
// //     try {
// //       const { id } = req.params;
// 
// //       const stop = await Stop.findByPk(id);
// 
// //       if (!stop) {
// //         res.status(404).json({
// //           success: false,
// //           message: 'Stop not found'
// //         });
// //         return;
// //       }
// 
// //       res.status(200).json({
// //         success: true,
// //         message: 'Stop retrieved',
// //         data: stop
// //       });
// //     } catch (error) {
// //       next(error);
// //     }
// //   }
// 
// //   async getRouteStops(req: Request, res: Response, next: NextFunction): Promise<void> {
// //     try {
// //       const { routeId } = req.params;
// 
// //       const stops = await Stop.findAll({
// //         where: { routeId },
// //         order: [['sequenceNumber', 'ASC']]
// //       });
// 
// //       res.status(200).json({
// //         success: true,
// //         message: 'Stops retrieved',
// //         data: stops
// //       });
// //     } catch (error) {
// //       next(error);
// //     }
// //   }
// 
// //   async updateStop(req: Request, res: Response, next: NextFunction): Promise<void> {
// //     try {
// //       const { id } = req.params;
// //       const updateData = req.body;
// 
// //       const stop = await Stop.findByPk(id);
// 
// //       if (!stop) {
// //         res.status(404).json({
// //           success: false,
// //           message: 'Stop not found'
// //         });
// //         return;
// //       }
// 
// //       await stop.update(updateData);
// 
// //       res.status(200).json({
// //         success: true,
// //         message: 'Stop updated',
// //         data: stop
// //       });
// //     } catch (error) {
// //       next(error);
// //     }
// //   }
// 
// //   async deleteStop(req: Request, res: Response, next: NextFunction): Promise<void> {
// //     try {
// //       const { id } = req.params;
// 
// //       const stop = await Stop.findByPk(id);
// 
// //       if (!stop) {
// //         res.status(404).json({
// //           success: false,
// //           message: 'Stop not found'
// //         });
// //         return;
// //       }
// 
// //       await stop.destroy();
// 
// //       res.status(200).json({
// //         success: true,
// //         message: 'Stop deleted'
// //       });
// //     } catch (error) {
// //       next(error);
// //     }
// //   }
// // }
// 
// // export default new StopController();
