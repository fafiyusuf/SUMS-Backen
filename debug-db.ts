import { Bus } from './src/modules/bus/bus.model';
import './src/modules/models'; // initialization
import { Route } from './src/modules/route/route.model';
import { User } from './src/modules/user/user.model';

async function debugData() {
    const drivers = await User.findAll({ where: { role: 'driver' } });
    console.log('Drivers:', drivers.map(d => ({ id: d.id, email: d.email })));

    const buses = await Bus.findAll();
    console.log('Buses:', buses.map(b => ({ id: b.id, driverId: b.driverId, routeId: b.routeId })));

    const routes = await Route.findAll();
    console.log('Routes:', routes.map(r => ({ id: r.id, name: r.name })));
}

debugData().then(() => process.exit(0));
