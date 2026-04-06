// import { DataTypes, Model, Optional } from 'sequelize';
// import { sequelize } from '../config/database';

// export interface GPSCoordinateAttributes {
//   id: string;
//   busId: string;
//   latitude: number;
//   longitude: number;
//   accuracy?: number;
//   speed?: number;
//   heading?: number;
//   timestamp: Date;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// export interface GPSCoordinateCreationAttributes extends Optional<GPSCoordinateAttributes, 'id'> {}

// export class GPSCoordinate extends Model<GPSCoordinateAttributes, GPSCoordinateCreationAttributes> implements GPSCoordinateAttributes {
//   public id!: string;
//   public busId!: string;
//   public latitude!: number;
//   public longitude!: number;
//   public accuracy?: number;
//   public speed?: number;
//   public heading?: number;
//   public timestamp!: Date;

//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
// }

// GPSCoordinate.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true
//     },
//     busId: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       references: {
//         model: 'buses',
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
//     accuracy: {
//       type: DataTypes.FLOAT,
//       allowNull: true
//     },
//     speed: {
//       type: DataTypes.FLOAT,
//       allowNull: true
//     },
//     heading: {
//       type: DataTypes.FLOAT,
//       allowNull: true
//     },
//     timestamp: {
//       type: DataTypes.DATE,
//       allowNull: false,
//       defaultValue: DataTypes.NOW
//     }
//   },
//   {
//     sequelize,
//     modelName: 'GPSCoordinate',
//     tableName: 'gps_coordinates'
//   }
// );

// export default GPSCoordinate;
