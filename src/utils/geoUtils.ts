/**
 * Calculates the Haversine distance between two points in meters.
 */
export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

/**
 * Estimates travel time in minutes based on distance (meters) and speed (km/h).
 */
export function estimateTime(distance: number, speedKmh: number = 40): number {
    if (speedKmh <= 0) return 0;
    const speedMs = speedKmh / 3.6;
    const timeSeconds = distance / speedMs;
    return Math.round(timeSeconds / 60);
}
