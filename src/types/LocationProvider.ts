export interface LocationData {
    busId: string;
    latitude: number;
    longitude: number;
    speed: number;
    heading: number;
    routeId: string;
    timestamp: string; // ISO-8601
    status?: string;
    currentPassengers?: number;
    capacity?: number;
}

export interface LocationProvider {
    start(): Promise<void>;
    stop(): Promise<void>;
    getCurrentLocation(busId: string): Promise<LocationData | null>;
    onLocationUpdate(callback: (data: LocationData) => void): void;
}
