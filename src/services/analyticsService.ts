// import { Transaction, Trip } from '../models';
// import logger from '../utils/logger';

// export class AnalyticsService {
//   async getTripStatistics(startDate?: Date, endDate?: Date): Promise<any> {
//     try {
//       const where: any = {};
//       if (startDate && endDate) {
//         where.createdAt = {
//           [require('sequelize').Op.between]: [startDate, endDate]
//         };
//       }

//       const totalTrips = await Trip.count({ where });
//       const completedTrips = await Trip.count({ where: { ...where, status: 'completed' } });
//       const revenues = await Transaction.findAll({
//         where: { ...where, type: 'credit' },
//         raw: true,
//         attributes: [
//           [require('sequelize').fn('SUM', require('sequelize').col('amount')), 'total']
//         ]
//       });

//       return {
//         totalTrips,
//         completedTrips,
//         totalRevenue: revenues[0]?.total || 0,
//         averageTripsPerDay: totalTrips / ((endDate?.getTime() || Date.now()) - (startDate?.getTime() || 0)) * (24 * 60 * 60 * 1000)
//       };
//     } catch (error) {
//       logger.error(`Trip statistics error: ${error}`);
//       throw error;
//     }
//   }

//   async getUserAnalytics(userId: string): Promise<any> {
//     try {
//       const userTrips = await Trip.count({ where: { userId } });
//       const totalSpent = await Transaction.findAll({
//         where: { userId, type: 'debit' },
//         raw: true,
//         attributes: [
//           [require('sequelize').fn('SUM', require('sequelize').col('amount')), 'total']
//         ]
//       });

//       const averageTripFare = userTrips > 0 ? (totalSpent[0]?.total || 0) / userTrips : 0;

//       return {
//         totalTrips: userTrips,
//         totalSpent: totalSpent[0]?.total || 0,
//         averageTripFare: Math.round(averageTripFare * 100) / 100
//       };
//     } catch (error) {
//       logger.error(`User analytics error: ${error}`);
//       throw error;
//     }
//   }

//   async getBusAnalytics(busId: string): Promise<any> {
//     try {
//       const busTrips = await Trip.count({ where: { busId, status: 'completed' } });

//       return {
//         totalTrips: busTrips,
//         operationalStatus: 'active'
//       };
//     } catch (error) {
//       logger.error(`Bus analytics error: ${error}`);
//       throw error;
//     }
//   }
// }

// export default new AnalyticsService();
