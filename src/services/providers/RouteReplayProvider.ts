import { LocationData, LocationProvider } from '../../types/LocationProvider';
import { Bus, Route, RoutePathCoordinate } from '../../models';

interface CachedPath {
    coordinates: { latitude: number; longitude: number }[];
    totalDistance: number;
    segmentDistances: number[];
}

export class RouteReplayProvider implements LocationProvider {
    private updateInterval: NodeJS.Timeout | null = null;
    private busDistances: Map<string, number> = new Map(); // busId (UUID) -> distance traveled in meters
    private pathCache: Map<string, CachedPath> = new Map(); // routeId (UUID) -> enriched path
    private callback: ((data: LocationData) => void) | null = null;
    private lastUpdate: number = Date.now();

    async start(): Promise<void> {
        if (this.updateInterval) return;

        await this.warmPathCache();
        await this.performStartupValidation();

        console.log('RouteReplayProvider: Starting simulation loop...');
        this.lastUpdate = Date.now();
        this.updateInterval = setInterval(() => {
            this.simulateMovement();
        }, 1000);
    }

    async stop(): Promise<void> {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    async getCurrentLocation(_busId: string): Promise<LocationData | null> {
        return null;
    }

    onLocationUpdate(callback: (data: LocationData) => void): void {
        this.callback = callback;
    }

    private async warmPathCache() {
        try {
            const allCoords = await RoutePathCoordinate.findAll({
                order: [['routeId', 'ASC'], ['sequence', 'ASC']]
            });

            this.pathCache.clear();
            const rawPaths: Map<string, { latitude: number; longitude: number }[]> = new Map();

            for (const coord of allCoords) {
                if (!rawPaths.has(coord.routeId)) {
                    rawPaths.set(coord.routeId, []);
                }
                rawPaths.get(coord.routeId)!.push({
                    latitude: Number(coord.latitude),
                    longitude: Number(coord.longitude)
                });
            }

            for (const [routeId, coords] of rawPaths.entries()) {
                const subdivided = this.subdividePath(coords, 50); // Ensuring points every 50m
                const { totalDistance, segmentDistances } = this.calculatePathDistances(subdivided);
                this.pathCache.set(routeId, {
                    coordinates: subdivided,
                    totalDistance,
                    segmentDistances
                });
            }
            console.log(`RouteReplayProvider: Cached and subdivided paths for ${this.pathCache.size} routes.`);
        } catch (error) {
            console.error('Failed to warm path cache:', error);
        }
    }

    private subdividePath(path: { latitude: number, longitude: number }[], maxDist: number) {
        const result: { latitude: number, longitude: number }[] = [];
        for (let i = 0; i < path.length - 1; i++) {
            const start = path[i];
            const end = path[i + 1];
            result.push(start);

            const dist = this.haversine(start.latitude, start.longitude, end.latitude, end.longitude);
            if (dist > maxDist) {
                const numSubsegments = Math.ceil(dist / maxDist);
                for (let j = 1; j < numSubsegments; j++) {
                    const ratio = j / numSubsegments;
                    result.push({
                        latitude: start.latitude + (end.latitude - start.latitude) * ratio,
                        longitude: start.longitude + (end.longitude - start.longitude) * ratio
                    });
                }
            }
        }
        result.push(path[path.length - 1]);
        return result;
    }

    private calculatePathDistances(path: { latitude: number, longitude: number }[]) {
        let totalDistance = 0;
        const segmentDistances: number[] = [0];
        for (let i = 0; i < path.length - 1; i++) {
            const dist = this.haversine(
                path[i].latitude, path[i].longitude,
                path[i + 1].latitude, path[i + 1].longitude
            );
            totalDistance += dist;
            segmentDistances.push(totalDistance);
        }
        return { totalDistance, segmentDistances };
    }

    private haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371e3; // Earth radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    private async performStartupValidation() {
        try {
            const activeBuses = await Bus.count({ where: { status: 'active' } });
            const totalRoutes = await Route.count();
            const routesWithPaths = this.pathCache.size;

            console.log('--- RouteReplayProvider Startup Report ---');
            console.log(`Active Buses: ${activeBuses}`);
            console.log(`Total Routes: ${totalRoutes}`);
            console.log(`Routes with simulation paths: ${routesWithPaths}`);
            console.log(`Routes missing paths: ${totalRoutes - routesWithPaths}`);
            console.log('------------------------------------------');
        } catch (error) {
            console.error('Startup validation failed:', error);
        }
    }

    private async simulateMovement() {
        try {
            const now = Date.now();
            const deltaTime = (now - this.lastUpdate) / 1000; // time in seconds
            this.lastUpdate = now;

            const buses = await Bus.findAll({ where: { status: 'active' } });
            if (buses.length === 0) return;

            for (const bus of buses) {
                if (!bus.routeId) continue;

                let cached = this.pathCache.get(bus.routeId);
                // Lazy loading logic simplified for brevity - in production keep the DB check
                if (!cached) continue;

                const busSpeedKmh = 40; // Default realistic speed
                const busSpeedMs = busSpeedKmh / 3.6;

                let distanceTraveled = (this.busDistances.get(bus.id) || 0) + (busSpeedMs * deltaTime);
                if (distanceTraveled > cached.totalDistance) {
                    distanceTraveled = 0; // Loop back
                    console.log(`Bus ${bus.id} completed route ${bus.routeId}, looping...`);
                }
                this.busDistances.set(bus.id, distanceTraveled);

                // Find position on path
                const { coordinates, segmentDistances } = cached;
                let i = 0;
                while (i < segmentDistances.length - 1 && segmentDistances[i + 1] <= distanceTraveled) {
                    i++;
                }

                const start = coordinates[i];
                const end = coordinates[i + 1] || start;
                const segmentStartDist = segmentDistances[i];
                const segmentEndDist = segmentDistances[i + 1] || (segmentStartDist + 1);
                const ratio = (distanceTraveled - segmentStartDist) / (segmentEndDist - segmentStartDist);

                const latitude = start.latitude + (end.latitude - start.latitude) * ratio;
                const longitude = start.longitude + (end.longitude - start.longitude) * ratio;

                const heading = this.calculateHeading(
                    { lat: start.latitude, lng: start.longitude },
                    { lat: end.latitude, lng: end.longitude }
                );

                const locationData: LocationData = {
                    busId: bus.id,
                    latitude,
                    longitude,
                    speed: busSpeedKmh,
                    heading,
                    routeId: bus.routeId,
                    timestamp: new Date().toISOString(),
                    status: 'active'
                };

                if (this.callback) {
                    this.callback(locationData);
                }
            }
        } catch (error) {
            console.error('RouteReplayProvider simulation error:', error);
        }
    }

    private calculateHeading(start: { lat: number, lng: number }, end: { lat: number, lng: number }): number {
        const lat1 = start.lat * Math.PI / 180;
        const lat2 = end.lat * Math.PI / 180;
        const dLon = (end.lng - start.lng) * Math.PI / 180;

        const y = Math.sin(dLon) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

        let brng = Math.atan2(y, x) * 180 / Math.PI;
        return (brng + 360) % 360;
    }
}
