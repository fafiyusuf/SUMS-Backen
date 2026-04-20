import { Bus } from '@/models';

export class BusService {
  async createBus(busData: any) {
    return await Bus.create(busData);
  }

  async getBus(id: string) {
    const bus = await Bus.findByPk(id);
    if (!bus) throw new Error('Bus not found');
    return bus;
  }

  async getAllBuses(page: number, limit: number) {
    const offset = (page - 1) * limit;
    const buses = await Bus.findAll({ limit, offset });
    const total = await Bus.count();
    return { buses, total, page, limit };
  }

  async updateBus(id: string, updateData: any) {
    const bus = await Bus.findByPk(id);
    if (!bus) throw new Error('Bus not found');
    return await bus.update(updateData);
  }

  async deleteBus(id: string) {
    const bus = await Bus.findByPk(id);
    if (!bus) throw new Error('Bus not found');
    await bus.destroy();
    return true;
  }
}

export default new BusService();
