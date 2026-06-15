import { Op, col, fn, literal } from 'sequelize';
import Bus from '../bus/bus.model';
import SmartCard from '../card/smartCard.model';
import Route from '../route/route.model';
import Trip from '../trip/trip.model';
import User from '../user/user.model';
import Transaction from '../wallet/transaction.model';

export class AnalyticsService {
    /**
     * Get basic passenger statistics
     */
    async getPassengerStats() {
        const totalPassengers = await User.count({ where: { role: 'passenger' } });
        const activeCards = await SmartCard.count({ where: { status: 'ACTIVE' } });
        const totalTrips = await Trip.count();

        // New signups in last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newSignups = await User.count({
            where: {
                role: 'passenger',
                createdAt: { [Op.gte]: thirtyDaysAgo }
            }
        });

        return {
            totalPassengers,
            activeCards,
            totalTrips,
            newSignupsLast30Days: newSignups
        };
    }

    /**
     * Analyze peak travel hours based on trip start times
     */
    async getPeakHours() {
        // This uses raw SQL literal to extract hour because Sequelize fn('HOUR', ...) is dialect specific (MySQL vs PostgreSQL)
        // Assuming PostgreSQL for this project based on standard stack
        const peakHours = await Trip.findAll({
            attributes: [
                [literal('EXTRACT(HOUR FROM "startTime")'), 'hour'],
                [fn('COUNT', col('id')), 'count']
            ],
            group: [literal('EXTRACT(HOUR FROM "startTime")') as any],
            order: [[literal('count'), 'DESC']]
        });

        return peakHours;
    }

    /**
     * Calculate route efficiency (Actual vs Estimated Duration)
     */
    async getRouteEfficiency() {
        const efficiency = await Trip.findAll({
            where: { status: 'completed' },
            attributes: [
                'routeId',
                [fn('AVG', literal('EXTRACT(EPOCH FROM ("endTime" - "startTime")) / 60')), 'avgActualDuration'],
            ],
            include: [
                {
                    model: Route,
                    attributes: ['name', 'estimatedDuration']
                }
            ],
            group: ['routeId', 'Route.id', 'Route.name', 'Route.estimatedDuration'],
            raw: true,
            nest: true
        });

        return efficiency.map((e: any) => ({
            routeId: e.routeId,
            routeName: e.Route.name,
            estimatedDuration: e.Route.estimatedDuration,
            avgActualDuration: parseFloat(e.avgActualDuration).toFixed(2),
            delayIndex: (parseFloat(e.avgActualDuration) / e.Route.estimatedDuration).toFixed(2)
        }));
    }

    /**
     * General dashboard summary data
     */
    async getDashboardSummary() {
        const totalRevenue = await Transaction.sum('amount', {
            where: {
                type: 'debit', // Fare deductions are debits from user wallet
                status: 'completed'
            }
        }) || 0;

        const activeBusesCount = await Bus.count({ where: { status: 'active' } });
        const totalTripsCount = await Trip.count();

        // Revenue last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentRevenue = await Transaction.sum('amount', {
            where: {
                type: 'debit',
                status: 'completed',
                createdAt: { [Op.gte]: sevenDaysAgo }
            }
        }) || 0;

        return {
            totalRevenue: parseFloat(totalRevenue.toString()),
            recentRevenue7Days: parseFloat(recentRevenue.toString()),
            activeBuses: activeBusesCount,
            totalTrips: totalTripsCount
        };
    }
}

export default new AnalyticsService();
