import { Bus, Route, RoutePathCoordinate, Stop } from '../../modules/models';
import { LocationData, LocationProvider } from '../../types/LocationProvider';

interface CachedPath {
    coordinates: { latitude: number; longitude: number }[];
    totalDistance: number;
    segmentDistances: number[];
}

interface BusState {
    distanceTraveled: number;
    lastUpdate: number;
    status: 'moving' | 'stopping' | 'stopped' | 'accelerating';
    stopDurationLeft: number;
    currentSpeedKmh: number;
    targetSpeedKmh: number;
}

export class RouteReplayProvider implements LocationProvider {
    private updateInterval: NodeJS.Timeout | null = null;
    private busStates: Map<string, BusState> = new Map(); // busId -> extended state
    private pathCache: Map<string, CachedPath> = new Map(); // routeId -> enriched path
    private stopCache: Map<string, Stop[]> = new Map(); // routeId -> stops
    private callback: ((data: LocationData) => void) | null = null;

    // Configurable from environment
    private SIMULATION_UPDATE_MS = Number(process.env.SIMULATION_UPDATE_MS) || 2500;
    private STOP_DURATION_SECONDS = Number(process.env.STOP_DURATION_SECONDS) || 12;

    async start(): Promise<void> {
        if (this.updateInterval) return;

        await this.performStartupValidation();

        console.log(`RouteReplayProvider: Starting simulation loop (${this.SIMULATION_UPDATE_MS}ms updates)...`);

        this.updateInterval = setInterval(() => {
            this.simulateMovement();
        }, this.SIMULATION_UPDATE_MS);
    }

    async stop(): Promise<void> {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    async getCurrentLocation(_busId: string): Promise<LocationData | null> {
        return null; // Not needed for replay mode
    }

    onLocationUpdate(callback: (data: LocationData) => void): void {
        this.callback = callback;
    }

    private async getEnrichedPath(routeId: string): Promise<CachedPath | null> {
        if (this.pathCache.has(routeId)) {
            return this.pathCache.get(routeId)!;
        }

        try {
            const coords = await RoutePathCoordinate.findAll({
                where: { routeId },
                order: [['sequence', 'ASC']]
            });

            if (coords.length < 2) {
                console.warn(`RouteReplayProvider: Route ${routeId} has insufficient coordinates (${coords.length}), skipping simulation.`);
                return null;
            }

            const pathCoords = coords.map(c => ({
                latitude: Number(c.latitude),
                longitude: Number(c.longitude)
            }));

            const subdivided = this.subdividePath(pathCoords, 10);
            const { totalDistance, segmentDistances } = this.calculatePathDistances(subdivided);

            const cachedPath = {
                coordinates: subdivided,
                totalDistance,
                segmentDistances
            };

            this.pathCache.set(routeId, cachedPath);
            return cachedPath;
        } catch (error) {
            console.error(`Failed to load path for route ${routeId}:`, error);
            return null;
        }
    }

    private async getRouteStops(routeId: string): Promise<Stop[]> {
        if (this.stopCache.has(routeId)) {
            return this.stopCache.get(routeId)!;
        }

        try {
            const stops = await Stop.findAll({
                where: { routeId },
                order: [['sequenceNumber', 'ASC']]
            });
            this.stopCache.set(routeId, stops);
            return stops;
        } catch (error) {
            console.error(`Failed to load stops for route ${routeId}:`, error);
            return [];
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
        const R = 6371e3;
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
            const activeBuses = await Bus.findAll({
                where: { status: 'active' },
                include: [{ model: Route, as: 'route' }]
            });
            console.log('--- RouteReplayProvider Startup ---');
            console.log(`Active Buses for Simulation: ${activeBuses.length}`);
            activeBuses.forEach(bus => {
                const route = (bus as any).route;
                console.log(` - Bus ${bus.registrationNumber}: Route ${route?.name || 'Unassigned'}`);
            });
            console.log('-----------------------------------');
        } catch (error) {
            console.error('Startup validation failed:', error);
        }
    }

    private async simulateMovement() {
        try {
            // Simulate all active buses on routes that have coordinates
            const activeBuses = await Bus.findAll({
                where: { status: 'active' },
                include: [{ model: Route, as: 'route' }]
            });

            if (activeBuses.length === 0) return;

            const now = Date.now();

            for (const bus of activeBuses) {
                const route = (bus as any).route;
                if (!route) continue;

                let state = this.busStates.get(bus.id);
                if (!state) {
                    state = {
                        distanceTraveled: Math.random() * 500, // Start at random position for variety
                        lastUpdate: now,
                        status: 'moving',
                        stopDurationLeft: 0,
                        currentSpeedKmh: 35,
                        targetSpeedKmh: 35 + (Math.random() * 5 - 2.5)
                    };
                    this.busStates.set(bus.id, state);
                }

                const cached = await this.getEnrichedPath(route.id);
                const stops = await this.getRouteStops(route.id);
                if (!cached) continue;

                const deltaTime = (now - state.lastUpdate) / 1000;
                state.lastUpdate = now;

                // 1. Determine Status & Speed
                let currentSpeedMs = state.currentSpeedKmh / 3.6;

                if (state.status === 'stopped') {
                    state.stopDurationLeft -= deltaTime;
                    if (state.stopDurationLeft <= 0) {
                        state.status = 'accelerating';
                    }
                    currentSpeedMs = 0;
                } else {
                    const nextStop = this.findNextStop(state.distanceTraveled, stops, cached);
                    if (nextStop && nextStop.distanceToStop < 30 && state.status !== 'stopping') {
                        state.status = 'stopping';
                    }

                    if (state.status === 'stopping') {
                        state.currentSpeedKmh = Math.max(5, state.currentSpeedKmh - (15 * deltaTime));
                        if (nextStop && nextStop.distanceToStop < 2) {
                            state.status = 'stopped';
                            state.stopDurationLeft = this.STOP_DURATION_SECONDS;
                            state.currentSpeedKmh = 0;
                            // Simulate passenger change
                            await bus.update({ currentPassengers: Math.max(0, (bus.currentPassengers || 0) + Math.floor(Math.random() * 11 - 5)) });
                        }
                    } else if (state.status === 'accelerating') {
                        state.currentSpeedKmh = Math.min(state.targetSpeedKmh, state.currentSpeedKmh + (10 * deltaTime));
                        if (state.currentSpeedKmh >= state.targetSpeedKmh) {
                            state.status = 'moving';
                        }
                    } else {
                        if (Math.random() > 0.95) {
                            state.targetSpeedKmh = 35 + (Math.random() * 10 - 5);
                        }
                        if (state.currentSpeedKmh < state.targetSpeedKmh) state.currentSpeedKmh += deltaTime;
                        if (state.currentSpeedKmh > state.targetSpeedKmh) state.currentSpeedKmh -= deltaTime;
                    }
                    currentSpeedMs = state.currentSpeedKmh / 3.6;
                }

                // 2. Update Position
                state.distanceTraveled += (currentSpeedMs * deltaTime);
                if (state.distanceTraveled > cached.totalDistance) {
                    state.distanceTraveled = 0;
                }

                // 3. Calculate Coordinates
                const { latitude, longitude, heading } = this.getPositionOnPath(state.distanceTraveled, cached);

                const locationData: LocationData = {
                    busId: bus.id,
                    latitude,
                    longitude,
                    speed: state.currentSpeedKmh,
                    heading,
                    routeId: route.id,
                    timestamp: new Date().toISOString(),
                    status: 'active',
                    currentPassengers: bus.currentPassengers,
                    capacity: bus.capacity
                };

                if (this.callback) this.callback(locationData);
            }
        } catch (error) {
            console.error('RouteReplayProvider simulation error:', error);
        }
    }

    private findNextStop(dist: number, stops: Stop[], cached: CachedPath) {
        for (const stop of stops) {
            const stopPoint = { latitude: Number(stop.latitude), longitude: Number(stop.longitude) };
            // Find approximate distance of stop on route path
            const stopDistOnPath = this.findClosestDistanceOnPath(stopPoint, cached);

            if (stopDistOnPath > dist) {
                return {
                    stop,
                    distanceToStop: stopDistOnPath - dist
                };
            }
        }
        return null;
    }

    private findClosestDistanceOnPath(point: { latitude: number, longitude: number }, cached: CachedPath): number {
        let minDist = Infinity;
        let bestIdx = 0;
        for (let i = 0; i < cached.coordinates.length; i++) {
            const d = this.haversine(point.latitude, point.longitude, cached.coordinates[i].latitude, cached.coordinates[i].longitude);
            if (d < minDist) {
                minDist = d;
                bestIdx = i;
            }
        }
        return cached.segmentDistances[bestIdx];
    }

    private getPositionOnPath(dist: number, cached: CachedPath) {
        const { coordinates, segmentDistances } = cached;
        let i = 0;
        while (i < segmentDistances.length - 1 && segmentDistances[i + 1] <= dist) {
            i++;
        }

        const start = coordinates[i];
        const end = coordinates[i + 1] || start;
        const segmentStartDist = segmentDistances[i];
        const segmentEndDist = segmentDistances[i + 1] || (segmentStartDist + 1);
        const ratio = (dist - segmentStartDist) / (segmentEndDist - segmentStartDist);

        const latitude = start.latitude + (end.latitude - start.latitude) * ratio;
        const longitude = start.longitude + (end.longitude - start.longitude) * ratio;

        const heading = this.calculateHeading(
            { lat: start.latitude, lng: start.longitude },
            { lat: end.latitude, lng: end.longitude }
        );

        return { latitude, longitude, heading };
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
