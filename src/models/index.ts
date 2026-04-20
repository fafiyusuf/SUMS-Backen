import Bus from './Bus';
import Route from './Route';
import SmartCard from './SmartCard';
import Stop from './Stop';
import Transaction from './Transaction';
import Trip from './Trip';
import User from './User';
import Wallet from './Wallet';
import Incident from './Incident';
import GPSCoordinate from './GPSCoordinate';

// Export all models
export { Bus, Route, SmartCard, Stop, Transaction, Trip, User, Wallet, Incident, GPSCoordinate };

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
Route.hasMany(Stop, { foreignKey: 'routeId', as: 'stops' });
Stop.belongsTo(Route, { foreignKey: 'routeId', as: 'route' });

// Route & Bus (1:N)
Route.hasMany(Bus, { foreignKey: 'routeId', as: 'buses' });
Bus.belongsTo(Route, { foreignKey: 'routeId', as: 'route' });

// Bus & Driver (User) (1:1)
User.hasOne(Bus, { foreignKey: 'driverId', as: 'assignedBus' });
Bus.belongsTo(User, { foreignKey: 'driverId', as: 'driver' });

// Trip associations
Trip.belongsTo(User, { foreignKey: 'userId', as: 'passenger' });
Trip.belongsTo(Bus, { foreignKey: 'busId', as: 'bus' });
Trip.belongsTo(Route, { foreignKey: 'routeId', as: 'route' });
Trip.belongsTo(Stop, { foreignKey: 'startStopId', as: 'startStop' });
Trip.belongsTo(Stop, { foreignKey: 'endStopId', as: 'endStop' });

export { sequelize } from '../config/database';
