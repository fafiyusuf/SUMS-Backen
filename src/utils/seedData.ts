import { Bus, Route, User, RoutePathCoordinate } from '../modules/models';
import bcrypt from 'bcryptjs';

export const seedAdamaData = async () => {
    try {
        // 1. Ensure a Driver exists
        let driver = await User.findOne({ where: { role: 'driver' } });
        if (!driver) {
            driver = await User.create({
                fullName: 'Adama Driver One',
                email: 'driver1@sum-transport.com',
                password: await bcrypt.hash('Driver@123', 10),
                role: 'driver',
                status: 'active'
            });
            console.log('Seeded default driver');
        }

        // 2. Define Adama Routes and Geometry
        const adamaRoutes = [
            {
                name: 'Route A',
                startPoint: 'Bus Terminal',
                endPoint: 'ASTU Main Gate',
                distance: 5.2,
                estimatedDuration: 15,
                status: 'active' as const,
                coordinates: [
                    { lat: 8.5414, lng: 39.2689 }, // Adama Bus Terminal
                    { lat: 8.5432, lng: 39.2705 }, // Post Office Junction
                    { lat: 8.5445, lng: 39.2741 }, // Franko
                    { lat: 8.5460, lng: 39.2780 }, // Near Stadium
                    { lat: 8.5482, lng: 39.2815 }, // Near Hospital
                    { lat: 8.5520, lng: 39.2830 }, // Curve towards ASTU
                    { lat: 8.5558, lng: 39.2848 }, // ASTU Main Gate
                ]
            },
            {
                name: 'Route B',
                startPoint: 'Bus Terminal',
                endPoint: 'Kebele 05',
                distance: 4.8,
                estimatedDuration: 12,
                status: 'active' as const,
                coordinates: [
                    { lat: 8.5414, lng: 39.2689 }, // Adama Bus Terminal
                    { lat: 8.5390, lng: 39.2695 }, // Towards Mebrat Hail
                    { lat: 8.5367, lng: 39.2712 }, // Mebrat Hail
                    { lat: 8.5340, lng: 39.2750 }, // Near Market
                    { lat: 8.5312, lng: 39.2785 }, // Kebele 05
                ]
            },
            {
                name: 'Route C', // REVERSE Route A
                startPoint: 'ASTU Main Gate',
                endPoint: 'Bus Terminal',
                distance: 5.2,
                estimatedDuration: 15,
                status: 'active' as const,
                coordinates: [
                    { lat: 8.5558, lng: 39.2848 }, // ASTU Main Gate
                    { lat: 8.5520, lng: 39.2830 },
                    { lat: 8.5482, lng: 39.2815 },
                    { lat: 8.5460, lng: 39.2780 },
                    { lat: 8.5445, lng: 39.2741 },
                    { lat: 8.5432, lng: 39.2705 },
                    { lat: 8.5414, lng: 39.2689 }, // Adama Bus Terminal
                ]
            }
        ];

        for (const routeData of adamaRoutes) {
            const { coordinates, ...rest } = routeData;
            const [route, created] = await Route.findOrCreate({
                where: { name: rest.name },
                defaults: rest
            });

            if (created) {
                console.log(`Seeded route: ${route.name}`);
                // Seed coordinates for the newly created route
                for (let i = 0; i < coordinates.length; i++) {
                    await RoutePathCoordinate.create({
                        routeId: route.id,
                        sequence: i,
                        latitude: coordinates[i].lat,
                        longitude: coordinates[i].lng
                    });
                }
            } else {
                // UPDATE: Re-seed coordinates to ensure new path data is applied
                await RoutePathCoordinate.destroy({ where: { routeId: route.id } });
                console.log(`Updating coordinates for route: ${route.name}`);
                for (let i = 0; i < coordinates.length; i++) {
                    await RoutePathCoordinate.create({
                        routeId: route.id,
                        sequence: i,
                        latitude: coordinates[i].lat,
                        longitude: coordinates[i].lng
                    });
                }
            }

            // 3. Ensure a Bus exists for each route
            const busRegMap: Record<string, string> = {
                'Route A': 'ET-101',
                'Route B': 'ET-102',
                'Route C': 'ET-103'
            };
            const busReg = busRegMap[route.name];

            const [bus, busCreated] = await Bus.findOrCreate({
                where: { registrationNumber: busReg },
                defaults: {
                    registrationNumber: busReg,
                    driverId: driver.id,
                    routeId: route.id,
                    capacity: 50,
                    currentPassengers: 0,
                    status: 'active'
                }
            });
            if (busCreated) console.log(`Seeded bus: ${bus.registrationNumber} for ${route.name}`);
        }
    } catch (error) {
        console.error('Error seeding Adama data:', error);
    }
};
