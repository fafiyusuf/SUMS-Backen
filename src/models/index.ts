// // Models index file - export all models
export { default as Bus, BusAttributes, BusCreationAttributes } from './Bus';
// export { default as GPSCoordinate, GPSCoordinateAttributes, GPSCoordinateCreationAttributes } from './GPSCoordinate';
// export { default as Incident, IncidentAttributes, IncidentCreationAttributes } from './Incident';
export { default as Route, RouteAttributes, RouteCreationAttributes } from './Route';
// export { default as Schedule, ScheduleAttributes, ScheduleCreationAttributes } from './Schedule';
export { default as SmartCard, SmartCardAttributes, SmartCardCreationAttributes } from './SmartCard';
export { default as Stop, StopAttributes, StopCreationAttributes } from './Stop';
// export { default as TapEvent, TapEventAttributes, TapEventCreationAttributes } from './TapEvent';
export { default as Transaction, TransactionAttributes, TransactionCreationAttributes } from './Transaction';
export { default as Trip, TripAttributes, TripCreationAttributes } from './Trip';
export { default as User, UserAttributes, UserCreationAttributes } from './User';
export { default as Wallet, WalletAttributes, WalletCreationAttributes } from './Wallet';


import SmartCard from './SmartCard';
import Transaction from './Transaction';
import User from './User';
import Wallet from './Wallet';

// Define associations
User.hasOne(Wallet, { foreignKey: 'userId', as: 'wallet' });
Wallet.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(SmartCard, { foreignKey: 'userId', as: 'cards' });
SmartCard.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { sequelize } from '../config/database';

export * from './SmartCard';
export * from './User';
export * from './Wallet';

