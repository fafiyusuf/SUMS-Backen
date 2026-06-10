import { Stop } from './stop.model';
import { sequelize } from '../../config/database';

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
}

export default new StopService();
