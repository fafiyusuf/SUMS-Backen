import { Op } from 'sequelize';
import { Bus } from '../bus/bus.model';
import { Route } from '../route/route.model';
import { Stop } from '../stop/stop.model';
import { Trip } from '../trip/trip.model';

export class DriverService {
  /**
   * Start a driver's trip:
   *  - Finds the bus assigned to the driver
   *  - Ensures the bus has a route assigned
   *  - Ensures no active trip is already in progress for this driver
   *  - Sets bus status to 'active'
   *  - Creates a Trip record (driver session trip — userId is null)
   */
  async startTrip(driverId: string) {
    const bus = await Bus.findOne({ where: { driverId } });
    if (!bus) {
      const error: any = new Error('No bus assigned to driver');
      error.status = 404;
      throw error;
    }

    if (!bus.routeId) {
      const error: any = new Error('Bus has no route assigned. Please assign a route before starting a trip.');
      error.status = 400;
      throw error;
    }

    if (bus.status === 'active') {
      console.log(`DriverService: Bus ${bus.registrationNumber} is already active. Checking for ongoing trip...`);
      const activeTrip = await Trip.findOne({
        where: {
          busId: bus.id,
          status: 'ongoing',
          userId: { [Op.is]: null }
        }
      });

      if (activeTrip) {
        console.log(`DriverService: Ongoing trip ${activeTrip.id} found for bus ${bus.registrationNumber}.`);
        const error: any = new Error('A trip is already in progress. End the current trip before starting a new one.');
        error.status = 400;
        throw error;
      }

      console.log(`DriverService: No ongoing trip found for active bus ${bus.registrationNumber}. Resetting to inactive.`);
      await bus.update({ status: 'inactive' });
    }

    const routeId: string = bus.routeId as string;
    const firstStop = await Stop.findOne({
      where: { routeId },
      order: [['sequenceNumber', 'ASC']]
    });

    if (!firstStop) {
      console.warn(`DriverService: No stops found for route ${routeId}`);
      const error: any = new Error('No stops found for the assigned route.');
      error.status = 400;
      throw error;
    }

    console.log(`DriverService: Starting trip for bus ${bus.registrationNumber} on route ${routeId}...`);
    await bus.update({ status: 'active' });

    try {
      const trip = await Trip.create({
        userId: null,
        busId: bus.id,
        routeId: bus.routeId as string,
        startStopId: firstStop.id,
        startTime: new Date(),
        fare: 0,
        status: 'ongoing'
      });
      console.log(`DriverService: Trip ${trip.id} created successfully.`);
      return {
        id: trip.id,
        busId: bus.id,
        routeId: bus.routeId,
        status: 'active',
        startTime: trip.startTime
      };
    } catch (createError) {
      console.error('DriverService: Failed to create Trip record:', createError);
      // Rollback bus status if trip creation fails
      await bus.update({ status: 'inactive' });
      throw createError;
    }
  }

  /**
   * End a driver's trip:
   *  - Finds the bus assigned to the driver
   *  - Ensures there IS an active trip
   *  - Sets bus status back to 'inactive'
   *  - Completes the Trip record
   */
  async endTrip(driverId: string) {
    const bus = await Bus.findOne({ where: { driverId } });
    if (!bus) {
      const error: any = new Error('No bus assigned to driver');
      error.status = 404;
      throw error;
    }

    if (bus.status !== 'active') {
      const error: any = new Error('No active trip to end.');
      error.status = 400;
      throw error;
    }

    // Find the ongoing trip record for this bus
    const trip = await Trip.findOne({
      where: { busId: bus.id, status: 'ongoing', userId: null },
      order: [['startTime', 'DESC']]
    });

    // Find the last stop of the route
    const routeId: string = bus.routeId as string;
    const lastStop = await Stop.findOne({
      where: { routeId },
      order: [['sequenceNumber', 'DESC']]
    });

    await bus.update({ status: 'inactive' });

    if (trip) {
      await trip.update({
        status: 'completed',
        endTime: new Date(),
        endStopId: lastStop?.id || trip.startStopId
      });
    }

    return {
      busId: bus.id,
      status: 'inactive',
      endTime: trip?.endTime || new Date()
    };
  }

  /**
   * Get currently active trip for the driver.
   */
  async getCurrentTrip(driverId: string) {
    const bus = await Bus.findOne({ where: { driverId } });
    if (!bus || bus.status !== 'active') {
      const error: any = new Error('No active trip');
      error.status = 404;
      throw error;
    }

    // Find the ongoing trip record
    const trip = await Trip.findOne({
      where: { busId: bus.id, status: 'ongoing', userId: null },
      order: [['startTime', 'DESC']]
    });

    if (!trip) {
      const error: any = new Error('No active trip session found');
      error.status = 404;
      throw error;
    }

    return {
      id: trip.id,
      busId: bus.id,
      routeId: bus.routeId,
      status: bus.status,
      startTime: trip.startTime
    };
  }

  /**
   * Get the route assigned to this driver's bus.
   */
  async getAssignedRoute(driverId: string) {
    const bus = await Bus.findOne({ where: { driverId } });
    if (!bus) {
      const error: any = new Error('No bus assigned to your account. Please contact admin.');
      error.status = 404;
      throw error;
    }

    if (!bus.routeId) {
      const error: any = new Error('No route assigned to your bus yet.');
      error.status = 404;
      throw error;
    }

    const route = await Route.findByPk(bus.routeId);
    if (!route) {
      const error: any = new Error('Assigned route details not found');
      error.status = 404;
      throw error;
    }

    return route;
  }

  /**
   * Get the bus assigned to this driver.
   */
  async getAssignedBus(driverId: string) {
    const bus = await Bus.findOne({ where: { driverId } });
    if (!bus) {
      const error: any = new Error('No bus assigned to your account. Please contact admin.');
      error.status = 404;
      throw error;
    }
    return bus;
  }

  /**
   * Get the driver's trip history (session trips on their assigned bus).
   */
  async getHistory(driverId: string, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const bus = await Bus.findOne({ where: { driverId } });
    if (!bus) {
      return { trips: [], total: 0, page, limit };
    }

    const trips = await Trip.findAll({
      where: { busId: bus.id, userId: null },
      include: [
        { model: Bus, as: 'bus', attributes: ['registrationNumber', 'capacity'] },
        { model: Route, as: 'route', attributes: ['name', 'startPoint', 'endPoint', 'distance', 'estimatedDuration'] }
      ],
      limit,
      offset,
      order: [['startTime', 'DESC']]
    });

    const total = await Trip.count({ where: { busId: bus.id, userId: null } });

    const formattedTrips = trips.map((trip: any) => {
      const tripData = trip.toJSON();
      const hoursDriven = trip.endTime
        ? (new Date(trip.endTime).getTime() - new Date(trip.startTime).getTime()) / (1000 * 60 * 60)
        : undefined;
      return { ...tripData, hoursDriven };
    });

    return { trips: formattedTrips, total, page, limit };
  }
}

export default new DriverService();
