// Export all models from their respective modules
export { Bus } from '../bus/bus.model';
export { SmartCard } from '../card/smartCard.model';
export { GPSCoordinate } from '../gps/gps.model';
export { Incident } from '../incident/incident.model';
export { Route } from '../route/route.model';
export { Schedule } from '../schedule/schedule.model';
export { SystemSetting } from '../settings/settings.model';
export { Stop } from '../stop/stop.model';
export { Tap } from '../tap/tap.model';
export { Trip } from '../trip/trip.model';
export { User } from '../user/user.model';
export { RoutePathCoordinate } from '../wallet/RoutePathCoordinate';
export { Transaction } from '../wallet/transaction.model';
export { Wallet } from '../wallet/wallet.model';
export { TelebirrPayment } from '../payment/telebirrPayment.model';

// Import models for associations
import { Bus } from '../bus/bus.model';
import { SmartCard } from '../card/smartCard.model';
import { GPSCoordinate } from '../gps/gps.model';
import { Incident } from '../incident/incident.model';
import { Route } from '../route/route.model';
import { Schedule } from '../schedule/schedule.model';
import { SystemSetting } from '../settings/settings.model';
import { Stop } from '../stop/stop.model';
import { Tap } from '../tap/tap.model';
import { Trip } from '../trip/trip.model';
import { User } from '../user/user.model';
import { Transaction } from '../wallet/transaction.model';
import { Wallet } from '../wallet/wallet.model';
import { TelebirrPayment } from '../payment/telebirrPayment.model';

// --- Define associations ---

// User & Wallet (1:1)
User.hasOne(Wallet, { foreignKey: 'userId', as: 'wallet' });
Wallet.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User & SmartCard (1:N)
User.hasMany(SmartCard, { foreignKey: 'userId', as: 'cards' });
SmartCard.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User & Transaction (1:N)
User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Route & Stop (1:N)
Route.hasMany(Stop, { foreignKey: 'routeId', as: 'stops', onDelete: 'CASCADE' });
Stop.belongsTo(Route, { foreignKey: 'routeId', as: 'route', onDelete: 'CASCADE' });

// Route & Bus (1:N)
Route.hasMany(Bus, { foreignKey: 'routeId', as: 'buses', onDelete: 'CASCADE' });
Bus.belongsTo(Route, { foreignKey: 'routeId', as: 'route', onDelete: 'CASCADE' });

// Bus & Driver (User) (1:1)
User.hasOne(Bus, { foreignKey: 'driverId', as: 'assignedBus' });
Bus.belongsTo(User, { foreignKey: 'driverId', as: 'driver' });

// Trip associations
Trip.belongsTo(User, { foreignKey: 'userId', as: 'passenger' });
Trip.belongsTo(Bus, { foreignKey: 'busId', as: 'bus', onDelete: 'CASCADE' });
Trip.belongsTo(Route, { foreignKey: 'routeId', as: 'route', onDelete: 'CASCADE' });
Trip.belongsTo(Stop, { foreignKey: 'startStopId', as: 'startStop' });
Trip.belongsTo(Stop, { foreignKey: 'endStopId', as: 'endStop' });

// Reverse associations for queries
Bus.hasMany(Trip, { foreignKey: 'busId', as: 'trips', onDelete: 'CASCADE' });
Route.hasMany(Trip, { foreignKey: 'routeId', as: 'trips', onDelete: 'CASCADE' });
User.hasMany(Trip, { foreignKey: 'userId', as: 'trips' });

// Bus & GPS Coordinates (1:N)
Bus.hasMany(GPSCoordinate, { foreignKey: 'busId', as: 'gpsCoordinates', onDelete: 'CASCADE' });
GPSCoordinate.belongsTo(Bus, { foreignKey: 'busId', as: 'bus', onDelete: 'CASCADE' });

// Bus & Incidents (1:N)
Bus.hasMany(Incident, { foreignKey: 'busId', as: 'incidents', onDelete: 'CASCADE' });
Incident.belongsTo(Bus, { foreignKey: 'busId', as: 'bus', onDelete: 'CASCADE' });

// Route & Schedule (1:N)
Route.hasMany(Schedule, { foreignKey: 'routeId', as: 'schedules', onDelete: 'CASCADE' });
Schedule.belongsTo(Route, { foreignKey: 'routeId', as: 'route', onDelete: 'CASCADE' });

// Bus & Schedule (1:N)
Bus.hasMany(Schedule, { foreignKey: 'busId', as: 'schedules', onDelete: 'CASCADE' });
Schedule.belongsTo(Bus, { foreignKey: 'busId', as: 'bus', onDelete: 'CASCADE' });

// Tap associations
Tap.belongsTo(SmartCard, { foreignKey: 'cardId', as: 'card' });
Tap.belongsTo(Bus, { foreignKey: 'busId', as: 'bus' });
Tap.belongsTo(Stop, { foreignKey: 'stopId', as: 'stop' });

// Settings
SystemSetting.belongsTo(User, { foreignKey: 'updatedBy', as: 'admin' });

// TelebirrPayment associations
TelebirrPayment.belongsTo(User, { foreignKey: 'userId', as: 'payer' });
User.hasMany(TelebirrPayment, { foreignKey: 'userId', as: 'telebirrPayments' });

export { sequelize } from '../../config/database';
