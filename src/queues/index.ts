import { Queue } from 'bullmq';
import config from '../config/env';

const connectionOptions = {
    host: config.redis.host,
    port: config.redis.port,
    maxRetriesPerRequest: null,
};

export const locationPersistenceQueue = new Queue('gps-location-persistence', { connection: connectionOptions });
export const stationEventQueue = new Queue('station-events', { connection: connectionOptions });
export const etaCalculationQueue = new Queue('eta-calculation', { connection: connectionOptions });

console.log('BullMQ Queues initialized');
