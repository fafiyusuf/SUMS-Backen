import { Bus } from './bus.model';
import { sequelize } from '../../config/database';
import { Trip } from '../trip/trip.model';
import { GPSCoordinate } from '../gps/gps.model';
import { Incident } from '../incident/incident.model';
import { Schedule } from '../schedule/schedule.model';

export class BusService {
  async createBus(busData: any) {
    const existingBus = await Bus.findOne({ where: { registrationNumber: busData.registrationNumber } });
    if (existingBus) {
      const error: any = new Error('A bus with this plate number already exists.');
      error.status = 400;
      throw error;
    }
    return await Bus.create(busData);
  }

  async getBus(id: string) {
    const bus = await Bus.findByPk(id);
    if (!bus) {
      const error: any = new Error('Bus not found');
      error.status = 404;
      throw error;
    }
    return bus;
  }

  async getAllBuses(page: number, limit: number) {
    const offset = (page - 1) * limit;
    const buses = await Bus.findAll({ limit, offset, order: [['createdAt', 'ASC']] });
    const total = await Bus.count();
    return { buses, total, page, limit };
  }

  async updateBus(id: string, updateData: any) {
    const bus = await Bus.findByPk(id);
    if (!bus) {
      const error: any = new Error('Bus not found');
      error.status = 404;
      throw error;
    }
    if (updateData.registrationNumber && updateData.registrationNumber !== bus.registrationNumber) {
      const existingBus = await Bus.findOne({ where: { registrationNumber: updateData.registrationNumber } });
      if (existingBus) {
        const error: any = new Error('A bus with this plate number already exists.');
        error.status = 400;
        throw error;
      }
    }
    return await bus.update(updateData);
  }

  async deleteBus(id: string) {
    const bus = await Bus.findByPk(id);
    if (!bus) throw new Error('Bus not found');
    
    const transaction = await sequelize.transaction();
    try {
      // Manually delete dependent records to ensure safety across cloud databases (Neon DB constraints)
      await Trip.destroy({ where: { busId: id }, transaction });
      await GPSCoordinate.destroy({ where: { busId: id }, transaction });
      await Incident.destroy({ where: { busId: id }, transaction });
      
      // Deactivate and unassign schedules instead of deleting them so admin can reassign/delete manually
      await Schedule.update(
        { busId: null, isActive: false },
        { where: { busId: id }, transaction }
      );

      await bus.destroy({ transaction });
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default new BusService();
