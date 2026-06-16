import axios from 'axios';
import { Route } from './route.model';
import { RoutePathCoordinate } from '../models';
import { sequelize } from '../../config/database';

export class RouteService {
  async createRoute(routeData: any) {
    return await Route.create(routeData);
  }

  async getRoute(routeId: string) {
    const route = await Route.findByPk(routeId, {
      include: [
        { model: require('../stop/stop.model').Stop, as: 'stops' },
        { model: require('../wallet/RoutePathCoordinate').RoutePathCoordinate, as: 'coordinates' }
      ]
    });
    if (!route) throw new Error('Route not found');
    return route;
  }

  async getAllRoutes(page: number, limit: number, status?: string) {
    const offset = (page - 1) * limit;
    const where: any = {};
    if (status) {
      where.status = status;
    }

    const routes = await Route.findAll({
      where,
      limit,
      offset,
      include: [
        { model: require('../stop/stop.model').Stop, as: 'stops' },
        {
          model: require('../trip/trip.model').Trip,
          as: 'trips',
          where: { status: 'ongoing' },
          required: false,
          include: [{ model: require('../bus/bus.model').Bus, as: 'bus' }]
        }
      ]
    });

    const total = await Route.count({ where });

    const enrichedRoutes = routes.map((route: any) => {
      const activeTrips = route.trips || [];
      const activeBuses = activeTrips.map((t: any) => t.bus).filter(Boolean);

      return {
        ...route.toJSON(),
        stopCount: route.stops?.length || 0,
        activeTripsCount: activeTrips.length,
        activeBusesCount: activeBuses.length,
        stops: route.stops,
        activeTrips: activeTrips
      };
    });

    return { routes: enrichedRoutes, total, page, limit };
  }

  async getRoutePath(routeId: string) {
    try {
      const { Stop } = require('../stop/stop.model');
      const stops = await Stop.findAll({
        where: { routeId },
        order: [['sequenceNumber', 'ASC']]
      });

      if (stops && stops.length >= 2) {
        const coordinates = stops.map((s: any) => `${s.longitude},${s.latitude}`).join(';');
        const url = `http://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;

        const response = await axios.get(url);
        if (response.data && response.data.routes && response.data.routes[0]) {
          const path = response.data.routes[0].geometry.coordinates.map((coord: [number, number]) => ({
            latitude: coord[1],
            longitude: coord[0]
          }));
          return path;
        }
      }
    } catch (error) {
      console.error('OSRM Route Generation Failed:', error);
      // Fallback to coordinates from DB
    }

    return await RoutePathCoordinate.findAll({
      where: { routeId },
      order: [['sequence', 'ASC']]
    });
  }

  async updateRoute(routeId: string, updateData: any) {
    const route = await Route.findByPk(routeId);
    if (!route) throw new Error('Route not found');
    return await route.update(updateData);
  }

  async deleteRoute(routeId: string) {
    const route = await Route.findByPk(routeId);
    if (!route) throw new Error('Route not found');

    const transaction = await sequelize.transaction();
    try {
      const { Stop } = require('../stop/stop.model');
      const { Trip } = require('../trip/trip.model');
      const { Schedule } = require('../schedule/schedule.model');
      const { Bus } = require('../bus/bus.model');
      const { GPSCoordinate } = require('../gps/gps.model');
      const { Incident } = require('../incident/incident.model');

      const buses = await Bus.findAll({ where: { routeId }, transaction });
      const busIds = buses.map((b: any) => b.id);

      if (busIds.length > 0) {
        await Trip.destroy({ where: { busId: busIds }, transaction });
        await GPSCoordinate.destroy({ where: { busId: busIds }, transaction });
        await Incident.destroy({ where: { busId: busIds }, transaction });
        await Schedule.destroy({ where: { busId: busIds }, transaction });
        await Bus.destroy({ where: { routeId }, transaction });
      }

      await Stop.destroy({ where: { routeId }, transaction });
      await Trip.destroy({ where: { routeId }, transaction });
      await Schedule.destroy({ where: { routeId }, transaction });

      await route.destroy({ transaction });
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default new RouteService();
