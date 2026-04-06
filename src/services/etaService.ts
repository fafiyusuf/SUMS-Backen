// import { GPSCoordinate, Stop } from '../models';
// import { calculateDistance, calculateETA } from '../utils/helpers';
// import logger from '../utils/logger';

// export class ETAService {
//   private averageSpeed = 30; // km/h

//   async calculateETAFromCurrentLocation(
//     busId: string,
//     destinationLat: number,
//     destinationLon: number
//   ): Promise<any> {
//     try {
//       // Get latest GPS coordinate
//       const currentLocation = await GPSCoordinate.findOne({
//         where: { busId },
//         order: [['timestamp', 'DESC']]
//       });

//       if (!currentLocation) {
//         throw new Error('No GPS data available for bus');
//       }

//       const distance = calculateDistance(
//         currentLocation.latitude,
//         currentLocation.longitude,
//         destinationLat,
//         destinationLon
//       );

//       const etaMinutes = calculateETA(distance, this.averageSpeed);

//       const estimatedArrivalTime = new Date(Date.now() + etaMinutes * 60 * 1000);

//       logger.info(`ETA calculated for bus ${busId}: ${etaMinutes} minutes`);

//       return {
//         distance,
//         etaMinutes: Math.round(etaMinutes),
//         estimatedArrivalTime,
//         currentLocation: {
//           latitude: currentLocation.latitude,
//           longitude: currentLocation.longitude
//         }
//       };
//     } catch (error) {
//       logger.error(`ETA calculation error: ${error}`);
//       throw error;
//     }
//   }

//   async calculateETAToStop(busId: string, stopId: string): Promise<any> {
//     try {
//       const stop = await Stop.findByPk(stopId);
//       if (!stop) {
//         throw new Error('Stop not found');
//       }

//       return this.calculateETAFromCurrentLocation(busId, stop.latitude, stop.longitude);
//     } catch (error) {
//       logger.error(`ETA to stop calculation error: ${error}`);
//       throw error;
//     }
//   }

//   updateAverageSpeed(speed: number): void {
//     if (speed > 0 && speed <= 100) {
//       this.averageSpeed = speed;
//     }
//   }

//   getAverageSpeed(): number {
//     return this.averageSpeed;
//   }
// }

// export default new ETAService();
