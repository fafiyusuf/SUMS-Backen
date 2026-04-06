// import { DataTypes, Model, Optional } from 'sequelize';
// import { sequelize } from '../config/database';

// export interface BusAttributes {
//   id: string;
//   registrationNumber: string;
//   driverId: string;
//   routeId: string;
//   capacity: number;
//   currentPassengers: number;
//   status: 'active' | 'inactive' | 'maintenance';
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// export interface BusCreationAttributes extends Optional<BusAttributes, 'id'> {}

// export class Bus extends Model<BusAttributes, BusCreationAttributes> implements BusAttributes {
//   public id!: string;
//   public registrationNumber!: string;
//   public driverId!: string;
//   public routeId!: string;
//   public capacity!: number;
//   public currentPassengers!: number;
//   public status!: 'active' | 'inactive' | 'maintenance';

//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
// }

// Bus.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true
//     },
//     registrationNumber: {
//       type: DataTypes.STRING,
//       unique: true,
//       allowNull: false
//     },
//     driverId: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       references: {
//         model: 'users',
//         key: 'id'
//       }
//     },
//     routeId: {
//       type: DataTypes.UUID,
//       allowNull: false
//     },
//     capacity: {
//       type: DataTypes.INTEGER,
//       allowNull: false
//     },
//     currentPassengers: {
//       type: DataTypes.INTEGER,
//       defaultValue: 0
//     },
//     status: {
//       type: DataTypes.ENUM('active', 'inactive', 'maintenance'),
//       defaultValue: 'active'
//     }
//   },
//   {
//     sequelize,
//     modelName: 'Bus',
//     tableName: 'buses'
//   }
// );

// export default Bus;
