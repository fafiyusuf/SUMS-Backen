import { Route } from '@/models';

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
    await route.destroy();
    return true;
  }
}

export default new RouteService();
