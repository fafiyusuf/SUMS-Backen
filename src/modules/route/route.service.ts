import { Route } from './route.model';
import { sequelize } from '../../config/database';

export class RouteService {
  async createRoute(routeData: any) {
    return await Route.create(routeData);
  }

  async getRoute(routeId: string) {
    const route = await Route.findByPk(routeId);
    if (!route) throw new Error('Route not found');
    return route;
  }

  async getAllRoutes(page: number, limit: number, status?: string) {
    const offset = (page - 1) * limit;
    const where: any = {};
    if (status) {
      where.status = status;
    }

    const routes = await Route.findAll({ where, limit, offset });
    const total = await Route.count({ where });

    return { routes, total, page, limit };
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
