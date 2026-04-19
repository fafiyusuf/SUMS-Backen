import { NextFunction, Request, Response } from 'express';
import { Bus, Route, Trip } from '../models';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export class TripController {
  // --- Passenger Trip Methods ---

  async createTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tripData = req.body;
      const trip = await Trip.create(tripData);
      res.status(201).json({ success: true, message: 'Trip created', data: trip });
    } catch (error) {
      next(error);
    }
  }

  async getTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const trip = await Trip.findByPk(id);
      if (!trip) {
        res.status(404).json({ success: false, message: 'Trip not found' });
        return;
      }
      res.status(200).json({ success: true, message: 'Trip retrieved', data: trip });
    } catch (error) {
      next(error);
    }
  }

  async getUserTrips(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const trips = await Trip.findAll({ where: { userId }, limit, offset, order: [['createdAt', 'DESC']] });
      const total = await Trip.count({ where: { userId } });

      res.status(200).json({ success: true, message: 'Trips retrieved', data: { trips, total, page, limit } });
    } catch (error) {
      next(error);
    }
  }

  async completeTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { endStopId } = req.body;
      const trip = await Trip.findByPk(id);
      if (!trip) {
        res.status(404).json({ success: false, message: 'Trip not found' });
        return;
      }
      await trip.update({ status: 'completed', endStopId, endTime: new Date() });
      res.status(200).json({ success: true, message: 'Trip completed', data: trip });
    } catch (error) {
      next(error);
    }
  }

  async cancelTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const trip = await Trip.findByPk(id);
      if (!trip) {
        res.status(404).json({ success: false, message: 'Trip not found' });
        return;
      }
      await trip.update({ status: 'cancelled' });
      res.status(200).json({ success: true, message: 'Trip cancelled', data: trip });
    } catch (error) {
      next(error);
    }
  }

  // --- Driver Trip Methods ---

  async startDriverTrip(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const driverId = req.user?.userId;
      if (!driverId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const bus = await Bus.findOne({ where: { driverId } });
      if (!bus) {
        res.status(404).json({ success: false, message: 'No bus assigned to driver.' });
        return;
      }
      await bus.update({ status: 'active' }); 
      
      res.status(200).json({
        success: true,
        message: 'Driver trip started',
        data: { busId: bus.id, routeId: bus.routeId, status: 'active', startTime: new Date() }
      });
    } catch (error) {
      next(error);
    }
  }

  async endDriverTrip(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const driverId = req.user?.userId;
      if (!driverId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const bus = await Bus.findOne({ where: { driverId } });
      if (!bus) {
        res.status(404).json({ success: false, message: 'No bus assigned to driver.' });
        return;
      }
      await bus.update({ status: 'inactive' }); 
      
      res.status(200).json({
        success: true,
        message: 'Driver trip ended',
        data: { busId: bus.id, status: 'inactive', endTime: new Date() }
      });
    } catch (error) {
      next(error);
    }
  }

  async getCurrentDriverTrip(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const driverId = req.user?.userId;
      if (!driverId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const bus = await Bus.findOne({ where: { driverId } });
      
      if (!bus || bus.status !== 'active') {
        res.status(404).json({ success: false, message: 'No active trip.' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Current driver trip retrieved',
        data: { busId: bus.id, routeId: bus.routeId, status: bus.status }
      });
    } catch (error) {
      next(error);
    }
  }

  async getAssignedRoute(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const driverId = req.user?.userId;
      if (!driverId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const bus = await Bus.findOne({ where: { driverId } });
      if (!bus) {
        res.status(404).json({ success: false, message: 'No assignment found' });
        return;
      }

      const route = await Route.findByPk(bus.routeId);
      res.status(200).json({
        success: true,
        message: 'Assigned route details retrieved',
        data: route
      });
    } catch (error) {
      next(error);
    }
  }

  async getDriverTripHistory(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const driverId = _req.user?.userId;
      if (!driverId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const page = parseInt(_req.query.page as string) || 1;
      const limit = parseInt(_req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const bus = await Bus.findOne({ where: { driverId } });
      if (!bus) {
        res.status(404).json({ success: false, message: 'No bus assigned to driver.' });
        return;
      }

      const trips = await Trip.findAll({
        where: { busId: bus.id },
        order: [['startTime', 'DESC']],
        limit,
        offset,
      });
      const total = await Trip.count({ where: { busId: bus.id } });

      const routeIds = Array.from(new Set(trips.map((trip) => trip.routeId)));
      const routes = routeIds.length
        ? await Route.findAll({ where: { id: routeIds } })
        : [];

      const routeMap = new Map(routes.map((route) => [route.id, route]));
      const data = trips.map((trip) => {
        const route = routeMap.get(trip.routeId);

        // Calculate hours driven from trip duration
        let hoursDriven = 0;
        if (trip.startTime && trip.endTime) {
          const start = new Date(trip.startTime).getTime();
          const end = new Date(trip.endTime).getTime();
          hoursDriven = Math.round(((end - start) / (1000 * 60 * 60)) * 10) / 10; // Round to 1 decimal
        }

        return {
          id: trip.id,
          busId: trip.busId,
          routeId: trip.routeId,
          startTime: trip.startTime,
          endTime: trip.endTime,
          status: trip.status,
          createdAt: trip.createdAt,
          updatedAt: trip.updatedAt,
          hoursDriven,
          bus: {
            registrationNumber: bus.registrationNumber,
            capacity: bus.capacity,
          },
          route: route
            ? {
                id: route.id,
                name: route.name,
                startPoint: route.startPoint,
                endPoint: route.endPoint,
                distance: route.distance,
                estimatedDuration: route.estimatedDuration,
              }
            : null,
        };
      });

      res.status(200).json({
        success: true,
        message: 'Driver trip history retrieved',
        data: {
          trips: data,
          total,
          page,
          limit,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new TripController();
