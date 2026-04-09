// // import { NextFunction, Request, Response } from 'express';
// // import { Route } from '../models';
// 
// // export class RouteController {
// //   async createRoute(req: Request, res: Response, next: NextFunction): Promise<void> {
// //     try {
// //       const routeData = req.body;
// 
// //       const route = await Route.create(routeData);
// 
// //       res.status(201).json({
// //         success: true,
// //         message: 'Route created',
// //         data: route
// //       });
// //     } catch (error) {
// //       next(error);
// //     }
// //   }
// 
// //   async getRoute(req: Request, res: Response, next: NextFunction): Promise<void> {
// //     try {
// //       const { id } = req.params;
// 
// //       const route = await Route.findByPk(id);
// 
// //       if (!route) {
// //         res.status(404).json({
// //           success: false,
// //           message: 'Route not found'
// //         });
// //         return;
// //       }
// 
// //       res.status(200).json({
// //         success: true,
// //         message: 'Route retrieved',
// //         data: route
// //       });
// //     } catch (error) {
// //       next(error);
// //     }
// //   }
// 
// //   async getAllRoutes(req: Request, res: Response, next: NextFunction): Promise<void> {
// //     try {
// //       const page = parseInt(req.query.page as string) || 1;
// //       const limit = parseInt(req.query.limit as string) || 10;
// //       const status = req.query.status as string;
// 
// //       const offset = (page - 1) * limit;
// //       const where: any = {};
// 
// //       if (status) {
// //         where.status = status;
// //       }
// 
// //       const routes = await Route.findAll({
// //         where,
// //         limit,
// //         offset
// //       });
// 
// //       const total = await Route.count({ where });
// 
// //       res.status(200).json({
// //         success: true,
// //         message: 'Routes retrieved',
// //         data: {
// //           routes,
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
// //   async updateRoute(req: Request, res: Response, next: NextFunction): Promise<void> {
// //     try {
// //       const { id } = req.params;
// //       const updateData = req.body;
// 
// //       const route = await Route.findByPk(id);
// 
// //       if (!route) {
// //         res.status(404).json({
// //           success: false,
// //           message: 'Route not found'
// //         });
// //         return;
// //       }
// 
// //       await route.update(updateData);
// 
// //       res.status(200).json({
// //         success: true,
// //         message: 'Route updated',
// //         data: route
// //       });
// //     } catch (error) {
// //       next(error);
// //     }
// //   }
// 
// //   async deleteRoute(req: Request, res: Response, next: NextFunction): Promise<void> {
// //     try {
// //       const { id } = req.params;
// 
// //       const route = await Route.findByPk(id);
// 
// //       if (!route) {
// //         res.status(404).json({
// //           success: false,
// //           message: 'Route not found'
// //         });
// //         return;
// //       }
// 
// //       await route.destroy();
// 
// //       res.status(200).json({
// //         success: true,
// //         message: 'Route deleted'
// //       });
// //     } catch (error) {
// //       next(error);
// //     }
// //   }
// // }
// 
// // export default new RouteController();
