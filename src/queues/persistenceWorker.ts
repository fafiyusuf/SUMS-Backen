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

const redis = new Redis(connectionOptions);
const GPS_BATCH_KEY = 'gps:batch:buffer';
const BATCH_SIZE = 50;
const BATCH_FLUSH_INTERVAL_MS = 30000; // 30 seconds

// 1. Worker to buffer GPS data into Redis
export const persistenceWorker = new Worker('gps-location-persistence', async job => {
    const data = job.data as LocationData;
    try {
        await redis.rpush(GPS_BATCH_KEY, JSON.stringify(data));

        // Optional: Check if we reached batch size to trigger early flush
        const length = await redis.llen(GPS_BATCH_KEY);
        if (length >= BATCH_SIZE) {
            await flushGpsBatch();
        }
    } catch (error) {
        console.error('Error buffering GPS data:', error);
    }
}, { connection: connectionOptions });

// 2. Logic to flush batch to Database
async function flushGpsBatch() {
    try {
        // Atomic pop multiple items if possible, or just use a lock
        const batchJson = await redis.lrange(GPS_BATCH_KEY, 0, BATCH_SIZE - 1);
        if (batchJson.length === 0) return;

        console.log(`Flushing GPS batch of ${batchJson.length} records...`);

        const coordinates = batchJson.map(json => {
            const data = JSON.parse(json) as LocationData;
            return {
                busId: data.busId,
                latitude: data.latitude,
                longitude: data.longitude,
                speed: data.speed,
                heading: data.heading,
                timestamp: new Date(data.timestamp)
            };
        });

        await GPSCoordinate.bulkCreate(coordinates);

        // Trim the list after successful write
        await redis.ltrim(GPS_BATCH_KEY, batchJson.length, -1);
    } catch (error) {
        console.error('Failed to flush GPS batch:', error);
    }
}

// 3. Periodic flush (Safety net for low traffic or to meet the 30s requirement)
setInterval(flushGpsBatch, BATCH_FLUSH_INTERVAL_MS);

persistenceWorker.on('failed', (job, err) => {
    console.error(`Persistence job ${job?.id} failed: ${err.message}`);
});
