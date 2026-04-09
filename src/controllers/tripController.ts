// // import { NextFunction, Request, Response } from 'express';
// // import { Trip } from '../models';
// 
// // export class TripController {
// //   async createTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
// //     try {
// //       const tripData = req.body;
// 
// //       const trip = await Trip.create(tripData);
// 
// //       res.status(201).json({
// //         success: true,
// //         message: 'Trip created',
// //         data: trip
// //       });
// //     } catch (error) {
// //       next(error);
// //     }
// //   }
// 
// //   async getTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
// //     try {
// //       const { id } = req.params;
// 
// //       const trip = await Trip.findByPk(id);
// 
// //       if (!trip) {
// //         res.status(404).json({
// //           success: false,
// //           message: 'Trip not found'
// //         });
// //         return;
// //       }
// 
// //       res.status(200).json({
// //         success: true,
// //         message: 'Trip retrieved',
// //         data: trip
// //       });
// //     } catch (error) {
// //       next(error);
// //     }
// //   }
// 
// //   async getUserTrips(req: Request, res: Response, next: NextFunction): Promise<void> {
// //     try {
// //       const { userId } = req.params;
// //       const page = parseInt(req.query.page as string) || 1;
// //       const limit = parseInt(req.query.limit as string) || 10;
// 
// //       const offset = (page - 1) * limit;
// 
// //       const trips = await Trip.findAll({
// //         where: { userId },
// //         limit,
// //         offset,
// //         order: [['createdAt', 'DESC']]
// //       });
// 
// //       const total = await Trip.count({ where: { userId } });
// 
// //       res.status(200).json({
// //         success: true,
// //         message: 'Trips retrieved',
// //         data: {
// //           trips,
// //           total,
// //           page,
// //           limit
// //         }
// //       });
// //     } catch (error) {
// //       next(error);
// //     }
// //   }
// 
// //   async completeTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
// //     try {
// //       const { id } = req.params;
// //       const { endStopId } = req.body;
// 
// //       const trip = await Trip.findByPk(id);
// 
// //       if (!trip) {
// //         res.status(404).json({
// //           success: false,
// //           message: 'Trip not found'
// //         });
// //         return;
// //       }
// 
// //       await trip.update({
// //         status: 'completed',
// //         endStopId,
// //         endTime: new Date()
// //       });
// 
// //       res.status(200).json({
// //         success: true,
// //         message: 'Trip completed',
// //         data: trip
// //       });
// //     } catch (error) {
// //       next(error);
// //     }
// //   }
// 
// //   async cancelTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
// //     try {
// //       const { id } = req.params;
// 
// //       const trip = await Trip.findByPk(id);
// 
// //       if (!trip) {
// //         res.status(404).json({
// //           success: false,
// //           message: 'Trip not found'
// //         });
// //         return;
// //       }
// 
// //       await trip.update({ status: 'cancelled' });
// 
// //       res.status(200).json({
// //         success: true,
// //         message: 'Trip cancelled',
// //         data: trip
// //       });
// //     } catch (error) {
// //       next(error);
// //     }
// //   }
// // }
// 
// // export default new TripController();
