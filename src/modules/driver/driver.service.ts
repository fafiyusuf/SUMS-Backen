import { Bus, Route } from '@/models';

export class DriverService {
  async startTrip(driverId: string) {
    const bus = await Bus.findOne({ where: { driverId } });
    if (!bus) throw new Error('No bus assigned to driver');
    
    await bus.update({ status: 'active' }); 
    return { busId: bus.id, routeId: bus.routeId, status: 'active', startTime: new Date() };
  }

  async endTrip(driverId: string) {
    const bus = await Bus.findOne({ where: { driverId } });
    if (!bus) throw new Error('No bus assigned to driver');
    
    await bus.update({ status: 'inactive' }); 
    return { busId: bus.id, status: 'inactive', endTime: new Date() };
  }

  async getCurrentTrip(driverId: string) {
    const bus = await Bus.findOne({ where: { driverId } });
    if (!bus || bus.status !== 'active') throw new Error('No active trip');

    return { busId: bus.id, routeId: bus.routeId, status: bus.status };
  }

  async getAssignedRoute(driverId: string) {
    const bus = await Bus.findOne({ where: { driverId } });
    if (!bus) throw new Error('No assignment found');

    const route = await Route.findByPk(bus.routeId);
    if (!route) throw new Error('Assigned route details not found');
    return route;
  }

  async getHistory(_driverId: string) {
    // Return empty history for now as per original code
    return [];
  }
}

export default new DriverService();
