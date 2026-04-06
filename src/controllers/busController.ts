// import { NextFunction, Request, Response } from 'express';
// import { Bus } from '../models';

// export class BusController {
//   async createBus(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const busData = req.body;

//       const bus = await Bus.create(busData);

//       res.status(201).json({
//         success: true,
//         message: 'Bus created',
//         data: bus
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   async getBus(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const { id } = req.params;

//       const bus = await Bus.findByPk(id);

//       if (!bus) {
//         res.status(404).json({
//           success: false,
//           message: 'Bus not found'
//         });
//         return;
//       }

//       res.status(200).json({
//         success: true,
//         message: 'Bus retrieved',
//         data: bus
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   async getAllBuses(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const page = parseInt(req.query.page as string) || 1;
//       const limit = parseInt(req.query.limit as string) || 10;

//       const offset = (page - 1) * limit;

//       const buses = await Bus.findAll({
//         limit,
//         offset
//       });

//       const total = await Bus.count();

//       res.status(200).json({
//         success: true,
//         message: 'Buses retrieved',
//         data: {
//           buses,
//           total,
//           page,
//           limit
//         }
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   async updateBus(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const { id } = req.params;
//       const updateData = req.body;

//       const bus = await Bus.findByPk(id);

//       if (!bus) {
//         res.status(404).json({
//           success: false,
//           message: 'Bus not found'
//         });
//         return;
//       }

//       await bus.update(updateData);

//       res.status(200).json({
//         success: true,
//         message: 'Bus updated',
//         data: bus
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   async deleteBus(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const { id } = req.params;

//       const bus = await Bus.findByPk(id);

//       if (!bus) {
//         res.status(404).json({
//           success: false,
//           message: 'Bus not found'
//         });
//         return;
//       }

//       await bus.destroy();

//       res.status(200).json({
//         success: true,
//         message: 'Bus deleted'
//       });
//     } catch (error) {
//       next(error);
//     }
//   }
// }

// export default new BusController();
