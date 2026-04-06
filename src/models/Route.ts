// import { DataTypes, Model, Optional } from 'sequelize';
// import { sequelize } from '../config/database';

// export interface RouteAttributes {
//   id: string;
//   name: string;
//   startPoint: string;
//   endPoint: string;
//   distance: number;
//   estimatedDuration: number;
//   status: 'active' | 'inactive';
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// export interface RouteCreationAttributes extends Optional<RouteAttributes, 'id'> {}

// export class Route extends Model<RouteAttributes, RouteCreationAttributes> implements RouteAttributes {
//   public id!: string;
//   public name!: string;
//   public startPoint!: string;
//   public endPoint!: string;
//   public distance!: number;
//   public estimatedDuration!: number;
//   public status!: 'active' | 'inactive';

//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
// }

// Route.init(
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
//     startPoint: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     endPoint: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     distance: {
//       type: DataTypes.FLOAT,
//       allowNull: false
//     },
//     estimatedDuration: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       comment: 'Duration in minutes'
//     },
//     status: {
//       type: DataTypes.ENUM('active', 'inactive'),
//       defaultValue: 'active'
//     }
//   },
//   {
//     sequelize,
//     modelName: 'Route',
//     tableName: 'routes'
//   }
// );

// export default Route;
