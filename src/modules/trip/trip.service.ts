import { Trip } from './trip.model';
import { SmartCard } from '../card/smartCard.model';
import { Wallet } from '../wallet/wallet.model';
import { sequelize } from '../../config/database';

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

  // --- Simulation Methods ---
  async simulateTapIn(data: { cardId: string; busId: string; routeId: string; startStopId: string }) {
    const transaction = await sequelize.transaction();
    try {
      // 1. Find the card by cardId
      const card = await SmartCard.findOne({ where: { cardId: data.cardId }, transaction });
      if (!card) throw new Error('Smart Card not found');
      if (card.status !== 'ACTIVE') throw new Error('Smart Card is not active');

      // 2. Check for an ongoing trip
      const existingTrip = await Trip.findOne({ 
        where: { userId: card.userId, status: 'ongoing' }, 
        transaction 
      });
      if (existingTrip) throw new Error('Passenger is already on an active trip (Tap out missing)');

      // 3. Check wallet balance (minimum 15 ETB required to start a trip, for example)
      const wallet: any = await Wallet.findOne({ where: { userId: card.userId }, transaction });
      if (!wallet) throw new Error('Wallet not found for this user');
      if (parseFloat(wallet.balance) < 15) {
        throw new Error('Insufficient balance to start a trip. Please top up.');
      }

      // 4. Create the ongoing trip
      const trip = await Trip.create({
        userId: card.userId,
        busId: data.busId,
        routeId: data.routeId,
        startStopId: data.startStopId,
        startTime: new Date(),
        fare: 0,
        status: 'ongoing'
      } as any, { transaction });

      // Update card last used time
      await card.update({ lastUsedAt: new Date() }, { transaction });

      await transaction.commit();
      return trip;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async simulateTapOut(data: { cardId: string; busId: string; routeId: string; endStopId: string; fare?: number }) {
    const transaction = await sequelize.transaction();
    try {
      // 1. Find the card
      const card = await SmartCard.findOne({ where: { cardId: data.cardId }, transaction });
      if (!card) throw new Error('Smart Card not found');

      // 2. Find the ongoing trip
      const trip = await Trip.findOne({ 
        where: { userId: card.userId, status: 'ongoing', busId: data.busId },
        transaction 
      });
      if (!trip) throw new Error('No active trip found for this passenger on this bus');

      // 3. Process the fare (defaults to 15 for simulation)
      const fareAmount = data.fare || 15;
      
      const wallet: any = await Wallet.findOne({ where: { userId: card.userId }, transaction });
      if (!wallet) throw new Error('Wallet not found');

      const currentBalance = parseFloat(wallet.balance);
      if (currentBalance < fareAmount) {
        // Here we could handle negative balance, but for now we'll allow it or throw
        // A real system might let the balance go negative for one trip or require payment.
        // Let's just deduct it for the simulation.
      }

      // Decrement the wallet 
      await wallet.update({ balance: currentBalance - fareAmount }, { transaction });

      // 4. Complete the trip
      await trip.update({
        endStopId: data.endStopId,
        endTime: new Date(),
        fare: fareAmount,
        status: 'completed'
      } as any, { transaction });

      await card.update({ lastUsedAt: new Date() }, { transaction });

      await transaction.commit();
      
      return {
        trip,
        fareCharged: fareAmount,
        remainingBalance: parseFloat(wallet.balance) - fareAmount
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default new TripService();
