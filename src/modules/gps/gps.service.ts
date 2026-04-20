import GPSCoordinate from '@/models/GPSCoordinate';
import { Op } from 'sequelize';

export class GPSService {
  async recordGPSData(data: { busId: string; latitude: number; longitude: number; accuracy?: number; speed?: number; heading?: number; }) {
    return await GPSCoordinate.create({
      ...data,
      timestamp: new Date()
    });
  }

  async getLatestGPSData(busId: string) {
    const gpsData = await GPSCoordinate.findOne({
      where: { busId },
      order: [['timestamp', 'DESC']]
    });

    if (!gpsData) {
      throw new Error('GPS data not found');
    }

    return gpsData;
  }

  async getGPSTrack(busId: string, minutes: number) {
    const startTime = new Date(Date.now() - minutes * 60 * 1000);

    return await GPSCoordinate.findAll({
      where: {
        busId,
        timestamp: {
          [Op.gte]: startTime
        }
      },
      order: [['timestamp', 'ASC']]
    });
  }
}

export default new GPSService();
