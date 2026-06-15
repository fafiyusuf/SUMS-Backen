import { sequelize } from '../../config/database';
import locationService from '../../services/LocationService';
import { estimateTime, getDistance } from '../../utils/geoUtils';
import { Stop } from './stop.model';

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

  async deleteStop(id: string) {
    const stop = await Stop.findByPk(id);
    if (!stop) throw new Error('Stop not found');

    const transaction = await sequelize.transaction();
    try {
      const { Trip } = require('../trip/trip.model');
      const { Op } = require('sequelize');

      // Cascade delete trips referencing this stop as start or end stop
      await Trip.destroy({
        where: {
          [Op.or]: [
            { startStopId: id },
            { endStopId: id }
          ]
        },
        transaction
      });

      await stop.destroy({ transaction });
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateStopSequence(sequence: { id: string; sequenceNumber: number }[]) {
    const transaction = await sequelize.transaction();
    try {
      for (const item of sequence) {
        await Stop.update(
          { sequenceNumber: item.sequenceNumber },
          { where: { id: item.id }, transaction }
        );
      }
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getStopETA(stopId: string) {
    const stop = await Stop.findByPk(stopId, {
      include: [{ model: require('../route/route.model').Route, as: 'route' }]
    });
    if (!stop) throw new Error('Stop not found');

    const routeId = (stop as any).routeId;

    // Find all active buses for the route this stop belongs to
    // We use the redis set managed by LocationService
    const activeBusIds = await (locationService as any).redis.smembers(`route:${routeId}:buses`);

    const etas = [];
    for (const busId of activeBusIds) {
      const location = await locationService.getBusLocation(busId);
      if (location) {
        const distance = getDistance(location.latitude, location.longitude, stop.latitude, stop.longitude);
        const eta = estimateTime(distance, location.speed || 40);

        etas.push({
          busId,
          distance,
          eta,
          lastUpdated: location.timestamp
        });
      }
    }

    return etas.sort((a, b) => a.eta - b.eta);
  }
}

export default new StopService();
