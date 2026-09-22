import Redis from 'ioredis';
import config from '../config/env';
import { locationPersistenceQueue } from '../queues';
import { LocationData, LocationProvider } from '../types/LocationProvider';
import socketServer from '../websocket/socketServer';
import { RouteReplayProvider } from './providers/RouteReplayProvider';

export class LocationService {
    private provider: LocationProvider | null = null;
    private redis: Redis;

    constructor() {
        this.redis = config.redis.url
            ? new Redis(config.redis.url)
            : new Redis({
                host: config.redis.host,
                port: config.redis.port,
            });
    }

    public async start() {
        if (this.provider) return; // Already started
        this.initializeProvider();
    }

    private initializeProvider() {
        const providerType = process.env.LOCATION_PROVIDER || 'ROUTE_REPLAY';

        switch (providerType) {
            case 'ROUTE_REPLAY':
                this.provider = new RouteReplayProvider();
                break;
            case 'MOBILE_GPS':
                // this.provider = new MobileGPSProvider();
                console.warn('MobileGPSProvider not yet implemented');
                break;
            default:
                this.provider = new RouteReplayProvider();
        }

        if (this.provider) {
            this.provider.onLocationUpdate((data) => this.handleLocationUpdate(data));
            this.provider.start();
            console.log(`Location Provider started: ${providerType}`);
        }
    }

    private async handleLocationUpdate(data: LocationData) {
        // 1. Broadcast via WebSocket FIRST (this drives the live map)
        const io = socketServer.getIO();
        if (io) {
            io.to(`bus-${data.busId}`).emit('location-update', {
                ...data,
                timestamp: new Date()
            });
            io.emit('all-locations', { [data.busId]: data });
            io.emit('bus:position_update', data);
        }

        // 2. Update Redis Live Cache (non-blocking for simulation)
        try {
            const busKey = `bus:${data.busId}:location`;
            await this.redis.set(busKey, JSON.stringify(data));
            await this.redis.sadd('active:buses', data.busId);
            await this.redis.sadd(`route:${data.routeId}:buses`, data.busId);
        } catch (error) {
            // Redis may be unavailable; log but don't block simulation
            console.error('Redis cache update failed (simulation continues):', (error as Error).message);
        }

        // 3. Queue for persistence (non-blocking for simulation)
        try {
            await locationPersistenceQueue.add('persist-gps', data);
        } catch (error) {
            console.error('BullMQ persistence queue failed (simulation continues):', (error as Error).message);
        }
    }

    async getBusLocation(busId: string): Promise<LocationData | null> {
        try {
            const data = await this.redis.get(`bus:${busId}:location`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Failed to fetch live location from Redis for bus ${busId}:`, error);
            return null;
        }
    }

    async getMultipleBusLocations(busIds: string[]): Promise<Record<string, LocationData>> {
        if (!busIds.length) return {};
        try {
            const keys = busIds.map(id => `bus:${id}:location`);
            const data = await this.redis.mget(...keys);
            const result: Record<string, LocationData> = {};
            data.forEach((locStr, index) => {
                if (locStr) {
                    result[busIds[index]] = JSON.parse(locStr);
                }
            });
            return result;
        } catch (error) {
            console.error('Failed to fetch multiple live locations from Redis:', error);
            return {};
        }
    }

    async getAllActiveBuses(): Promise<string[]> {
        return await this.redis.smembers('active:buses');
    }
}

export default new LocationService();
