import { Queue } from 'bullmq';
import Redis from 'ioredis';
import config from '../config/env';

const connection = config.redis.url
    ? new Redis(config.redis.url, { maxRetriesPerRequest: null })
    : new Redis({
        host: config.redis.host,
        port: config.redis.port,
        maxRetriesPerRequest: null,
    });

export const locationPersistenceQueue = new Queue('gps-location-persistence', { connection: connection as any });
export const stationEventQueue = new Queue('station-events', { connection: connection as any });
export const etaCalculationQueue = new Queue('eta-calculation', { connection: connection as any });

console.log('BullMQ Queues initialized');
