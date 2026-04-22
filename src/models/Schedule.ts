// import { DataTypes, Model, Optional } from 'sequelize';
// import { sequelize } from '../config/database';

// export interface ScheduleAttributes {
//   id: string;
//   routeId: string;
//   dayOfWeek: number;
//   departureTime: string;
//   arrivalTime: string;
//   busId?: string;
//   isActive: boolean;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// export interface ScheduleCreationAttributes extends Optional<ScheduleAttributes, 'id'> {}

// export class Schedule extends Model<ScheduleAttributes, ScheduleCreationAttributes> implements ScheduleAttributes {
//   public id!: string;
//   public routeId!: string;
//   public dayOfWeek!: number;
//   public departureTime!: string;
//   public arrivalTime!: string;
//   public busId?: string;
//   public isActive!: boolean;

//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
// }

// Schedule.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true
//     },
//     routeId: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       references: {
//         model: 'routes',
//         key: 'id'
//       }
//     },
//     dayOfWeek: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       comment: '0 = Sunday, 1 = Monday, ..., 6 = Saturday'
//     },
//     departureTime: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       comment: 'HH:mm format'
//     },
//     arrivalTime: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       comment: 'HH:mm format'
//     },
//     busId: {
//       type: DataTypes.UUID,
//       allowNull: true,
//       references: {
//         model: 'buses',
//         key: 'id'
//       }
//     },
//     isActive: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: true
//     }
//   },
//   {
//     sequelize,
//     modelName: 'Schedule',
//     tableName: 'schedules'
//   }
// );

// export default Schedule;
