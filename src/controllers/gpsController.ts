// // import { NextFunction, Request, Response } from 'express';
// // import { GPSCoordinate } from '../models';
// 
// // export class GPSController {
// //   async recordGPSData(req: Request, res: Response, next: NextFunction): Promise<void> {
// //     try {
// //       const { busId, latitude, longitude, accuracy, speed, heading } = req.body;
// 
// //       const gpsData = await GPSCoordinate.create({
// //         busId,
// //         latitude,
// //         longitude,
// //         accuracy,
// //         speed,
// //         heading,
// //         timestamp: new Date()
// //       });
// 
// //       res.status(201).json({
// //         success: true,
// //         message: 'GPS data recorded',
// //         data: gpsData
// //       });
// //     } catch (error) {
// //       next(error);
// //     }
// //   }
// 
// //   async getLatestGPSData(req: Request, res: Response, next: NextFunction): Promise<void> {
// //     try {
// //       const { busId } = req.params;
// 
// //       const gpsData = await GPSCoordinate.findOne({
// //         where: { busId },
// //         order: [['timestamp', 'DESC']]
// //       });
// 
// //       if (!gpsData) {
// //         res.status(404).json({
// //           success: false,
// //           message: 'GPS data not found'
// //         });
// //         return;
// //       }
// 
// //       res.status(200).json({
// //         success: true,
// //         message: 'GPS data retrieved',
// //         data: gpsData
// //       });
// //     } catch (error) {
// //       next(error);
// //     }
// //   }
// 
// //   async getGPSTrack(req: Request, res: Response, next: NextFunction): Promise<void> {
// //     try {
// //       const { busId } = req.params;
// //       const minutes = parseInt(req.query.minutes as string) || 60;
// 
// //       const startTime = new Date(Date.now() - minutes * 60 * 1000);
// 
// //       const track = await GPSCoordinate.findAll({
// //         where: {
// //           busId,
// //           timestamp: {
// //             [require('sequelize').Op.gte]: startTime
// //           }
// //         },
// //         order: [['timestamp', 'ASC']]
// //       });
// 
// //       res.status(200).json({
// //         success: true,
// //         message: 'GPS track retrieved',
// //         data: track
// //       });
// //     } catch (error) {
// //       next(error);
// //     }
// //   }
// // }
// 
// // export default new GPSController();
