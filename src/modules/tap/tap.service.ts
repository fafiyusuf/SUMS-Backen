import { getDistance } from '../../utils/geoUtils';
import { Bus } from '../bus/bus.model';
import { SmartCard } from '../card/smartCard.model';
import { Stop } from '../stop/stop.model';
import { Trip } from '../trip/trip.model';
import { Wallet } from '../wallet/wallet.model';
import walletService from '../wallet/wallet.service';
import { Tap } from './tap.model';

export class TapService {
    async tapIn(data: { cardId: string; busId: string; stopId: string }) {
        const card = await SmartCard.findOne({ where: { cardId: data.cardId } });
        if (!card) throw new Error('Invalid card');
        if (card.status !== 'ACTIVE') throw new Error('Card is suspended');

        const wallet = await Wallet.findOne({ where: { userId: card.userId } });
        if (!wallet || (wallet as any).balance < 10) {
            throw new Error('Insufficient balance. Minimum 10 ETB required to board.');
        }

        // Check if user already has an ongoing trip
        const existingTrip = await Trip.findOne({
            where: { userId: card.userId, status: 'ongoing' }
        });
        if (existingTrip) {
            throw new Error('User already has an active trip. Please tap out first.');
        }

        const bus = await Bus.findByPk(data.busId);
        if (!bus) throw new Error('Bus not found');
        if (!bus.routeId) throw new Error('This bus is not currently assigned to a route');

        const tap = await Tap.create({
            cardId: card.id,
            busId: data.busId,
            stopId: data.stopId,
            type: 'tap-in',
            timestamp: new Date()
        });

        const trip = await Trip.create({
            userId: card.userId,
            busId: data.busId,
            routeId: bus.routeId,
            startStopId: data.stopId,
            startTime: new Date(),
            status: 'ongoing',
            fare: 0
        });

        await card.update({ lastUsedAt: new Date() });

        return { tap, trip };
    }

    async tapOut(data: { cardId: string; busId: string; stopId: string }) {
        const card = await SmartCard.findOne({ where: { cardId: data.cardId } });
        if (!card) throw new Error('Invalid card');

        const trip = await Trip.findOne({
            where: { userId: card.userId, status: 'ongoing' },
            order: [['startTime', 'DESC']]
        });

        if (!trip) throw new Error('No active trip found for this card');

        const startStop = await Stop.findByPk(trip.startStopId);
        const endStop = await Stop.findByPk(data.stopId);

        if (!startStop || !endStop) throw new Error('Stop information missing');

        // Calculate fare
        const distanceMeters = getDistance(
            startStop.latitude,
            startStop.longitude,
            endStop.latitude,
            endStop.longitude
        );
        const distanceKm = distanceMeters / 1000;

        // 2 ETB per KM, min 5 ETB
        const calculatedFare = Math.max(5, Math.ceil(distanceKm * 2));

        await walletService.deductBalance(card.userId, calculatedFare, `Bus trip: ${startStop.name} to ${endStop.name}`);

        await trip.update({
            endStopId: data.stopId,
            endTime: new Date(),
            fare: calculatedFare,
            status: 'completed'
        });

        const tap = await Tap.create({
            cardId: card.id,
            busId: data.busId,
            stopId: data.stopId,
            type: 'tap-out',
            timestamp: new Date()
        });

        return { tap, trip, fare: calculatedFare, distanceKm };
    }

    async validateCard(cardId: string) {
        const card = await SmartCard.findOne({ where: { cardId } });
        if (!card) throw new Error('Card not found');

        const wallet = await Wallet.findOne({ where: { userId: card.userId } });
        return {
            cardId: card.cardId,
            status: card.status,
            balance: wallet ? (wallet as any).balance : 0,
            isValid: card.status === 'ACTIVE' && (wallet ? (wallet as any).balance >= 5 : false)
        };
    }
}

export default new TapService();
