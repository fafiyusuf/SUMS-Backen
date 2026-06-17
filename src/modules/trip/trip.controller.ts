import { NextFunction, Request, Response } from 'express';
import { Bus } from '../bus/bus.model';
import { Route } from '../route/route.model';
import { Trip } from './trip.model';
import tripService from './trip.service';

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
      const trip = await Trip.findByPk(id, {
        include: [
          { model: Bus, as: 'bus', attributes: ['registrationNumber', 'capacity'] },
          { model: Route, as: 'route', attributes: ['name', 'startPoint', 'endPoint', 'distance', 'estimatedDuration'] }
        ]
      });
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

      const formattedTrips = trips.map((trip: any) => {
        const data = trip.toJSON();
        return {
          ...data,
          startTime: data.startTime || data.start_time,
          endTime: data.endTime || data.end_time,
          routeId: data.routeId || data.route_id,
          busId: data.busId || data.bus_id,
          userId: data.userId || data.user_id,
          startStopId: data.startStopId || data.start_stop_id,
          endStopId: data.endStopId || data.end_stop_id,
          isSimulation: data.isSimulation || data.is_simulation
        };
      });

      res.status(200).json({ success: true, message: 'Trips retrieved', data: { trips: formattedTrips, total, page, limit } });
    } catch (error) {
      next(error);
    }
  }

  async getPassengerHistory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const trips = await Trip.findAll({ where: { userId }, limit, offset, order: [['createdAt', 'DESC']] });
      const total = await Trip.count({ where: { userId } });

      const formattedTrips = trips.map((trip: any) => {
        const data = trip.toJSON();
        return {
          ...data,
          startTime: data.startTime || data.start_time,
          endTime: data.endTime || data.end_time,
          routeId: data.routeId || data.route_id,
          busId: data.busId || data.bus_id,
          userId: data.userId || data.user_id,
          startStopId: data.startStopId || data.start_stop_id,
          endStopId: data.endStopId || data.end_stop_id,
          isSimulation: data.isSimulation || data.is_simulation
        };
      });

      res.status(200).json({ success: true, message: 'History retrieved', data: { trips: formattedTrips, total, page, limit } });
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

      if (!bus.routeId) {
        res.status(404).json({ success: false, message: 'No route assigned to your bus yet.' });
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

  async getDriverTripHistory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const driverId = req.user?.userId;
      if (!driverId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      // Find bus assigned to driver
      const bus = await Bus.findOne({ where: { driverId } });
      if (!bus) {
        res.status(200).json({
          success: true,
          message: 'Driver trip history retrieved',
          data: { trips: [], total: 0, page, limit }
        });
        return;
      }

      // Get trips for this bus with included relations
      const trips = await Trip.findAll({
        where: { busId: bus.id },
        include: [
          { model: Bus, as: 'bus', attributes: ['registrationNumber', 'capacity'] },
          { model: Route, as: 'route', attributes: ['id', 'name', 'startPoint', 'endPoint', 'distance', 'estimatedDuration'] }
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });

      const total = await Trip.count({ where: { busId: bus.id } });

      // Format trips with calculated hoursDriven
      const formattedTrips = trips.map((trip: any) => {
        const tripData = trip.toJSON();
        const hoursDriven = trip.endTime
          ? (new Date(trip.endTime).getTime() - new Date(trip.startTime).getTime()) / (1000 * 60 * 60)
          : undefined;
        return {
          ...tripData,
          hoursDriven,
          startTime: tripData.startTime?.toISOString?.() || tripData.startTime,
          endTime: tripData.endTime?.toISOString?.() || tripData.endTime,
          createdAt: tripData.createdAt?.toISOString?.() || tripData.createdAt,
          updatedAt: tripData.updatedAt?.toISOString?.() || tripData.updatedAt
        };
      });

      res.status(200).json({
        success: true,
        message: 'Driver trip history retrieved',
        data: { trips: formattedTrips, total, page, limit }
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllTrips(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 100; // Increased default limit for monitoring
      const offset = (page - 1) * limit;

      const trips = await Trip.findAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        include: [
          { model: Bus, as: 'bus', attributes: ['id', 'registrationNumber', 'capacity'] },
          { model: Route, as: 'route', attributes: ['id', 'name'] }
        ]
      });
      const total = await Trip.count();

      const formattedTrips = trips.map((trip: any) => {
        const data = trip.toJSON();
        return {
          ...data,
          startTime: data.startTime || data.start_time,
          endTime: data.endTime || data.end_time,
          routeId: data.routeId || data.route_id,
          busId: data.busId || data.bus_id,
          userId: data.userId || data.user_id,
          startStopId: data.startStopId || data.start_stop_id,
          endStopId: data.endStopId || data.end_stop_id,
          isSimulation: data.isSimulation || data.is_simulation
        };
      });

      res.status(200).json({ success: true, message: 'All trips retrieved', data: { trips: formattedTrips, total, page, limit } });
    } catch (error) {
      next(error);
    }
  }

  // --- Simulation Methods ---

  async simulateTapIn(req: Request, res: Response): Promise<void> {
    try {
      const trip = await tripService.simulateTapIn(req.body);
      res.status(201).json({ success: true, message: 'Tap In successful', data: trip });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async simulateTapOut(req: Request, res: Response): Promise<void> {
    try {
      const result = await tripService.simulateTapOut(req.body);
      res.status(200).json({ success: true, message: 'Tap Out successful', data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

export default new TripController();
