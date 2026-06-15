import { Worker } from 'bullmq';
import Redis from 'ioredis';
import config from '../config/env';
import { GPSCoordinate } from '../modules/models';
import { LocationData } from '../types/LocationProvider';

const connectionOptions = {
    host: config.redis.host,
    port: config.redis.port,
    maxRetriesPerRequest: null,
};

const PERSISTENCE_TIME_THRESHOLD = 60000; // 1 minute

export const persistenceWorker = new Worker('gps-location-persistence', async job => {
    const data = job.data as LocationData;
    const busId = data.busId;

    const redis = new Redis(connectionOptions);

    try {
        const lastStateKey = `bus:${busId}:last_persisted`;
        const lastStateRaw = await redis.get(lastStateKey);
        const lastState = lastStateRaw ? JSON.parse(lastStateRaw) : null;

        const now = Date.now();
        const shouldPersist = !lastState ||
            (now - new Date(lastState.timestamp).getTime() > PERSISTENCE_TIME_THRESHOLD);

        if (shouldPersist) {
            await GPSCoordinate.create({
                busId: data.busId,
                latitude: data.latitude,
                longitude: data.longitude,
                speed: data.speed,
                heading: data.heading,
                timestamp: new Date(data.timestamp)
            });

            await redis.set(lastStateKey, JSON.stringify(data));
        }
    } catch (error) {
        console.error(`Failed to persist GPS for bus ${busId}:`, error);
    } finally {
        await redis.quit();
    }
}, { connection: connectionOptions });

persistenceWorker.on('failed', (job, err) => {
    console.error(`Persistence job ${job?.id} failed: ${err.message}`);
});
