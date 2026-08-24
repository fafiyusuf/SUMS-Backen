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
        try {
            // 1. Update Redis Live Cache
            const busKey = `bus:${data.busId}:location`;
            await this.redis.set(busKey, JSON.stringify(data));

            // Update active buses set
            await this.redis.sadd('active:buses', data.busId);

            // Update route-specific bus set
            await this.redis.sadd(`route:${data.routeId}:buses`, data.busId);

            // 2. Broadcast via WebSocket
            const io = socketServer.getIO();
            if (io) {
                // Broadcast to specific bus room
                io.to(`bus-${data.busId}`).emit('location-update', {
                    ...data,
                    timestamp: new Date()
                });

                // Broadcast to all (for fleet view)
                io.emit('all-locations', { [data.busId]: data });

                // Standardized position update event
                io.emit('bus:position_update', data);

                console.debug(`📡 Broadcasting location for bus ${data.busId} at ${data.latitude}, ${data.longitude}`);
            } else {
                console.warn('Socket.io not initialized, skipping broadcast');
            }

            // 3. Queue for persistence and analytics
            await locationPersistenceQueue.add('persist-gps', data);

            // console.debug(`Location updated for bus ${data.busId} at ${data.latitude}, ${data.longitude}`);
        } catch (error) {
            console.error('Error handling location update:', error);
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

    async getAllActiveBuses(): Promise<string[]> {
        return await this.redis.smembers('active:buses');
    }
}

export default new LocationService();
