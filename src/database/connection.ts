// import { sequelize } from '../config/database';
// import {
//     Bus,
//     GPSCoordinate,
//     Incident,
//     Route,
//     Schedule,
//     SmartCard,
//     Stop,
//     TapEvent,
//     Transaction,
//     Trip,
//     User,
//     Wallet
// } from '../models';

// // Define associations
// export function initializeAssociations(): void {
//   // User associations
//   User.hasOne(Wallet, { foreignKey: 'userId' });
//   User.hasMany(SmartCard, { foreignKey: 'userId' });
//   User.hasMany(Transaction, { foreignKey: 'userId' });
//   User.hasMany(Trip, { foreignKey: 'userId' });
//   User.hasMany(TapEvent, { foreignKey: 'userId' });

//   // SmartCard associations
//   SmartCard.belongsTo(User, { foreignKey: 'userId' });
//   SmartCard.hasMany(TapEvent, { foreignKey: 'cardId' });

//   // Wallet associations
//   Wallet.belongsTo(User, { foreignKey: 'userId' });

//   // Transaction associations
//   Transaction.belongsTo(User, { foreignKey: 'userId' });

//   // Bus associations
//   Bus.hasMany(Trip, { foreignKey: 'busId' });
//   Bus.hasMany(GPSCoordinate, { foreignKey: 'busId' });
//   Bus.hasMany(TapEvent, { foreignKey: 'busId' });
//   Bus.hasMany(Incident, { foreignKey: 'busId' });
//   Bus.hasMany(Schedule, { foreignKey: 'busId' });

//   // Route associations
//   Route.hasMany(Bus, { foreignKey: 'routeId' });
//   Route.hasMany(Stop, { foreignKey: 'routeId' });
//   Route.hasMany(Trip, { foreignKey: 'routeId' });
//   Route.hasMany(Schedule, { foreignKey: 'routeId' });

//   // Stop associations
//   Stop.belongsTo(Route, { foreignKey: 'routeId' });
//   Stop.hasMany(Trip, { foreignKey: 'startStopId' });
//   Stop.hasMany(Trip, { foreignKey: 'endStopId' });
//   Stop.hasMany(TapEvent, { foreignKey: 'stopId' });

//   // Trip associations
//   Trip.belongsTo(User, { foreignKey: 'userId' });
//   Trip.belongsTo(Bus, { foreignKey: 'busId' });
//   Trip.belongsTo(Route, { foreignKey: 'routeId' });

//   // TapEvent associations
//   TapEvent.belongsTo(User, { foreignKey: 'userId' });
//   TapEvent.belongsTo(SmartCard, { foreignKey: 'cardId' });
//   TapEvent.belongsTo(Bus, { foreignKey: 'busId' });
//   TapEvent.belongsTo(Stop, { foreignKey: 'stopId' });

//   // GPSCoordinate associations
//   GPSCoordinate.belongsTo(Bus, { foreignKey: 'busId' });

//   // Incident associations
//   Incident.belongsTo(Bus, { foreignKey: 'busId' });

//   // Schedule associations
//   Schedule.belongsTo(Route, { foreignKey: 'routeId' });
//   Schedule.belongsTo(Bus, { foreignKey: 'busId', allowNull: true });
// }

// export default sequelize;
