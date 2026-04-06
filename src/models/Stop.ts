// import { DataTypes, Model, Optional } from 'sequelize';
// import { sequelize } from '../config/database';

// export interface StopAttributes {
//   id: string;
//   name: string;
//   routeId: string;
//   latitude: number;
//   longitude: number;
//   sequenceNumber: number;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// export interface StopCreationAttributes extends Optional<StopAttributes, 'id'> {}

// export class Stop extends Model<StopAttributes, StopCreationAttributes> implements StopAttributes {
//   public id!: string;
//   public name!: string;
//   public routeId!: string;
//   public latitude!: number;
//   public longitude!: number;
//   public sequenceNumber!: number;

//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
// }

// Stop.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     routeId: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       references: {
//         model: 'routes',
//         key: 'id'
//       }
//     },
//     latitude: {
//       type: DataTypes.FLOAT,
//       allowNull: false
//     },
//     longitude: {
//       type: DataTypes.FLOAT,
//       allowNull: false
//     },
//     sequenceNumber: {
//       type: DataTypes.INTEGER,
//       allowNull: false
//     }
//   },
//   {
//     sequelize,
//     modelName: 'Stop',
//     tableName: 'stops'
//   }
// );

// export default Stop;
