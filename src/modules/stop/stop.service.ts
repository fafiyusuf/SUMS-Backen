import { Stop } from '@/models';

export class StopService {
  async getAllStops() {
    return await Stop.findAll({
      order: [['createdAt', 'DESC']]
    });
  }

  async getStop(id: string) {
    const stop = await Stop.findByPk(id);
    if (!stop) throw new Error('Stop not found');
    return stop;
  }

  async createStop(stopData: any) {
    return await Stop.create(stopData);
  }

  async updateStop(id: string, updateData: any) {
    const stop = await Stop.findByPk(id);
    if (!stop) throw new Error('Stop not found');
    return await stop.update(updateData);
  }
}

export default new StopService();
