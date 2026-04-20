import { Trip } from '@/models';

export class TripService {
  async createTrip(tripData: any) {
    return await Trip.create(tripData);
  }

  async getTrip(id: string) {
    const trip = await Trip.findByPk(id);
    if (!trip) throw new Error('Trip not found');
    return trip;
  }

  async getUserTrips(userId: string, page: number, limit: number) {
    const offset = (page - 1) * limit;
    const trips = await Trip.findAll({ where: { userId }, limit, offset, order: [['createdAt', 'DESC']] });
    const total = await Trip.count({ where: { userId } });
    return { trips, total, page, limit };
  }

  async getPassengerHistory(userId: string, page: number, limit: number) {
    const offset = (page - 1) * limit;
    const trips = await Trip.findAll({ where: { userId }, limit, offset, order: [['createdAt', 'DESC']] });
    const total = await Trip.count({ where: { userId } });
    return { trips, total, page, limit };
  }

  async completeTrip(id: string, endStopId: string) {
    const trip = await Trip.findByPk(id);
    if (!trip) throw new Error('Trip not found');
    return await trip.update({ status: 'completed', endStopId, endTime: new Date() });
  }

  async cancelTrip(id: string) {
    const trip = await Trip.findByPk(id);
    if (!trip) throw new Error('Trip not found');
    return await trip.update({ status: 'cancelled' });
  }

  async getAllTrips(page: number, limit: number) {
    const offset = (page - 1) * limit;
    const trips = await Trip.findAll({ limit, offset, order: [['createdAt', 'DESC']] });
    const total = await Trip.count();
    return { trips, total, page, limit };
  }
}

export default new TripService();
