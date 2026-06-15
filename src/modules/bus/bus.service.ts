import { Op } from 'sequelize';
import { sequelize } from '../../config/database';
import locationService from '../../services/LocationService';
import { GPSCoordinate } from '../gps/gps.model';
import { Incident } from '../incident/incident.model';
import { Schedule } from '../schedule/schedule.model';
import { Trip } from '../trip/trip.model';
import { User } from '../user/user.model';
import { Bus } from './bus.model';

export class BusService {
  async createBus(busData: any) {
    // 1. Check for duplicate registration number
    const existingByPlate = await Bus.findOne({ where: { registrationNumber: busData.registrationNumber } });
    if (existingByPlate) {
      const error: any = new Error('A bus with this plate number already exists.');
      error.status = 400;
      throw error;
    }

    // 2. If driverId provided, validate the user exists and is a driver
    if (busData.driverId) {
      const driver = await User.findByPk(busData.driverId);
      if (!driver) {
        const error: any = new Error('Driver not found.');
        error.status = 404;
        throw error;
      }
      if (driver.role !== 'driver') {
        const error: any = new Error('The specified user is not a driver.');
        error.status = 400;
        throw error;
      }

      // 3. Enforce one-bus-per-driver: check if this driver is already assigned to another bus
      const existingBusForDriver = await Bus.findOne({ where: { driverId: busData.driverId } });
      if (existingBusForDriver) {
        const error: any = new Error('This driver is already assigned to another bus. A driver can only be assigned to one bus at a time.');
        error.status = 400;
        throw error;
      }
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

  async getAllBuses(page: number, limit: number, filters: any = {}) {
    const offset = (page - 1) * limit;

    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.routeId) where.routeId = filters.routeId;

    const { rows: buses, count: total } = await Bus.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'ASC']],
      include: [
        {
          model: GPSCoordinate,
          as: 'gpsCoordinates',
          limit: 1,
          order: [['timestamp', 'DESC']]
        }
      ]
    });

    // Format the result to include a 'location' property
    const formattedBuses = await Promise.all(buses.map(async (bus: any) => {
      const busJson = bus.toJSON();

      // Try Redis first for live location
      const liveLocation = await locationService.getBusLocation(bus.id);

      if (liveLocation) {
        busJson.location = {
          latitude: liveLocation.latitude,
          longitude: liveLocation.longitude,
          lastUpdated: liveLocation.timestamp
        };
      } else if (busJson.gpsCoordinates && busJson.gpsCoordinates.length > 0) {
        // Fallback to database
        const latest = busJson.gpsCoordinates[0];
        busJson.location = {
          latitude: latest.latitude,
          longitude: latest.longitude,
          lastUpdated: latest.timestamp
        };
      }

      delete busJson.gpsCoordinates;
      return busJson;
    }));

    return { buses: formattedBuses, total, page, limit };
  }

  async updateBus(id: string, updateData: any) {
    const bus = await Bus.findByPk(id);
    if (!bus) {
      const error: any = new Error('Bus not found');
      error.status = 404;
      throw error;
    }

    // Check for duplicate registration number (if changing it)
    if (updateData.registrationNumber && updateData.registrationNumber !== bus.registrationNumber) {
      const existingBus = await Bus.findOne({ where: { registrationNumber: updateData.registrationNumber } });
      if (existingBus) {
        const error: any = new Error('A bus with this plate number already exists.');
        error.status = 400;
        throw error;
      }
    }

    // If reassigning a driverId, validate:
    if (updateData.driverId !== undefined && updateData.driverId !== null) {
      // a) Driver exists and has the 'driver' role
      const driver = await User.findByPk(updateData.driverId);
      if (!driver) {
        const error: any = new Error('Driver not found.');
        error.status = 404;
        throw error;
      }
      if (driver.role !== 'driver') {
        const error: any = new Error('The specified user is not a driver.');
        error.status = 400;
        throw error;
      }

      // b) One-bus-per-driver: the driverId must not already be on a *different* bus
      const existingBusForDriver = await Bus.findOne({
        where: {
          driverId: updateData.driverId,
          id: { [Op.ne]: id }  // exclude the current bus
        }
      });
      if (existingBusForDriver) {
        const error: any = new Error('This driver is already assigned to another bus. A driver can only be assigned to one bus at a time.');
        error.status = 400;
        throw error;
      }
    }

    return await bus.update(updateData);
  }

  async deleteBus(id: string) {
    const bus = await Bus.findByPk(id);
    if (!bus) {
      const error: any = new Error('Bus not found');
      error.status = 404;
      throw error;
    }

    const transaction = await sequelize.transaction();
    try {
      // Manually cascade-delete dependent records
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
