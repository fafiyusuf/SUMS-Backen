import bcrypt from 'bcryptjs';
import { Bus, Route, RoutePathCoordinate, Stop, SystemSetting, User } from '../modules/models';

export const seedAdamaData = async () => {
    try {
        // 1. Ensure a Passenger exists for testing
        let passenger = await User.findOne({ where: { role: 'passenger' } });
        if (!passenger) {
            passenger = await User.create({
                fullName: 'Adama Passenger',
                email: 'passenger@sum-transport.com',
                password: await bcrypt.hash('Passenger@123', 10),
                role: 'passenger',
                status: 'active'
            });
            console.log('Seeded default passenger');
        }

        // 2. Define Adama Routes (Operational and Simulation)
        const adamaRoutes = [
            {
                name: 'Adama Bus Terminal → ASTU',
                startPoint: 'Bus Terminal',
                endPoint: 'ASTU Main Gate',
                distance: 5.2,
                estimatedDuration: 15,
                routeType: 'operational' as const,
                simulationEnabled: true,
                status: 'active' as const,
                coordinates: [
                    { lat: 8.5414, lng: 39.2689 },
                    { lat: 8.5432, lng: 39.2705 },
                    { lat: 8.5445, lng: 39.2741 },
                    { lat: 8.5460, lng: 39.2780 },
                    { lat: 8.5482, lng: 39.2815 },
                    { lat: 8.5520, lng: 39.2830 },
                    { lat: 8.5558, lng: 39.2848 },
                ],
                stops: [
                    { name: 'Adama Bus Terminal', lat: 8.5414, lng: 39.2689 },
                    { name: 'Franko', lat: 8.5445, lng: 39.2741 },
                    { name: 'ASTU Main Gate', lat: 8.5558, lng: 39.2848 }
                ]
            },
            {
                name: 'Posta → Medhanialem',
                startPoint: 'Posta',
                endPoint: 'Medhanialem',
                distance: 4.8,
                estimatedDuration: 12,
                routeType: 'operational' as const,
                simulationEnabled: true,
                status: 'active' as const,
                coordinates: [
                    { lat: 8.5414, lng: 39.2689 },
                    { lat: 8.5390, lng: 39.2695 },
                    { lat: 8.5367, lng: 39.2712 },
                    { lat: 8.5340, lng: 39.2750 },
                    { lat: 8.5312, lng: 39.2785 },
                ],
                stops: [
                    { name: 'Posta Terminal', lat: 8.5414, lng: 39.2689 },
                    { name: 'Mebrat Hail', lat: 8.5367, lng: 39.2712 },
                    { name: 'Medhanialem Kebele 05', lat: 8.5312, lng: 39.2785 }
                ]
            },
            {
                name: 'Old Bus Station → Kebele 04',
                startPoint: 'Old Bus Station',
                endPoint: 'Kebele 04',
                distance: 8.1,
                estimatedDuration: 26,
                routeType: 'operational' as const,
                simulationEnabled: true,
                status: 'active' as const,
                coordinates: [
                    { lat: 8.5414, lng: 39.2689 },
                    { lat: 8.5400, lng: 39.2720 },
                    { lat: 8.5380, lng: 39.2750 },
                    { lat: 8.5360, lng: 39.2780 },
                    { lat: 8.5340, lng: 39.2810 },
                ],
                stops: [
                    { name: 'Old Bus Station', lat: 8.5414, lng: 39.2689 },
                    { name: 'Shewa Dabo', lat: 8.5380, lng: 39.2750 },
                    { name: 'Kebele 04', lat: 8.5340, lng: 39.2810 }
                ]
            }
        ];

        for (const routeData of adamaRoutes) {
            const { coordinates, stops, ...rest } = routeData;
            const [route, created] = await Route.findOrCreate({
                where: { name: rest.name },
                defaults: rest
            });

            if (created) {
                console.log(`Seeded new route: ${route.name}`);
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
                // console.log(`Updating coordinates for route: ${route.name}`);
                for (let i = 0; i < coordinates.length; i++) {
                    await RoutePathCoordinate.create({
                        routeId: route.id,
                        sequence: i,
                        latitude: coordinates[i].lat,
                        longitude: coordinates[i].lng
                    });
                }
            }

            // Seed key stops for this route (Start and End)
            await Stop.findOrCreate({
                where: { name: rest.startPoint, routeId: route.id },
                defaults: {
                    name: rest.startPoint,
                    routeId: route.id,
                    latitude: coordinates[0].lat,
                    longitude: coordinates[0].lng,
                    sequenceNumber: 0
                }
            });

            await Stop.findOrCreate({
                where: { name: rest.endPoint, routeId: route.id },
                defaults: {
                    name: rest.endPoint,
                    routeId: route.id,
                    latitude: coordinates[coordinates.length - 1].lat,
                    longitude: coordinates[coordinates.length - 1].lng,
                    sequenceNumber: coordinates.length - 1
                }
            });

            // 3. Ensure a unique Driver and Bus exists for each route
            const busRegMap: Record<string, string> = {
                'Adama Bus Terminal → ASTU': 'ET-101',
                'Posta → Medhanialem': 'ET-102',
                'Old Bus Station → Kebele 04': 'OR-3-12045'
            };
            const busReg = busRegMap[route.name];

            // Reuse driver if bus already has one, or find/create a new one
            const existingBus = await Bus.findOne({ where: { registrationNumber: busReg } });
            let driverId;

            if (existingBus) {
                driverId = existingBus.driverId;
            } else {
                const driverEmail = `driver-${busReg.toLowerCase()}@sum-transport.com`;
                const [driver] = await User.findOrCreate({
                    where: { email: driverEmail },
                    defaults: {
                        fullName: `Driver for ${busReg}`,
                        email: driverEmail,
                        password: await bcrypt.hash('Driver@123', 10),
                        role: 'driver',
                        status: 'active'
                    }
                });
                driverId = driver.id;
            }

            const [bus, busCreated] = await Bus.findOrCreate({
                where: { registrationNumber: busReg },
                defaults: {
                    registrationNumber: busReg,
                    driverId: driverId,
                    routeId: route.id,
                    capacity: 50,
                    currentPassengers: 0,
                    status: 'inactive'
                }
            });
            if (busCreated) console.log(`Seeded bus: ${bus.registrationNumber} for ${route.name}`);
        }

        // 4. Seed Default Pricing Settings
        await SystemSetting.findOrCreate({
            where: { key: 'BASE_FARE' },
            defaults: {
                key: 'BASE_FARE',
                value: '5',
                description: 'Minimum fare for any bus trip (ETB)'
            }
        });

        await SystemSetting.findOrCreate({
            where: { key: 'PER_KM_RATE' },
            defaults: {
                key: 'PER_KM_RATE',
                value: '2',
                description: 'Fare rate per kilometer traveled (ETB)'
            }
        });

    } catch (error) {
        console.error('Error seeding Adama data:', error);
    }
};
