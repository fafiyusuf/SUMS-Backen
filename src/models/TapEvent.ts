// import { DataTypes, Model, Optional } from 'sequelize';
// import { sequelize } from '../config/database';

// export interface TapEventAttributes {
//   id: string;
//   userId: string;
//   cardId: string;
//   busId: string;
//   stopId: string;
//   tapType: 'entry' | 'exit';
//   timestamp: Date;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// export interface TapEventCreationAttributes extends Optional<TapEventAttributes, 'id'> {}

// export class TapEvent extends Model<TapEventAttributes, TapEventCreationAttributes> implements TapEventAttributes {
//   public id!: string;
//   public userId!: string;
//   public cardId!: string;
//   public busId!: string;
//   public stopId!: string;
//   public tapType!: 'entry' | 'exit';
//   public timestamp!: Date;

//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
// }

// TapEvent.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true
//     },
//     userId: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       references: {
//         model: 'users',
//         key: 'id'
//       }
//     },
//     cardId: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       references: {
//         model: 'smart_cards',
//         key: 'id'
//       }
//     },
//     busId: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       references: {
//         model: 'buses',
//         key: 'id'
//       }
//     },
//     stopId: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       references: {
//         model: 'stops',
//         key: 'id'
//       }
//     },
//     tapType: {
//       type: DataTypes.ENUM('entry', 'exit'),
//       allowNull: false
//     },
//     timestamp: {
//       type: DataTypes.DATE,
//       allowNull: false,
//       defaultValue: DataTypes.NOW
//     }
//   },
//   {
//     sequelize,
//     modelName: 'TapEvent',
//     tableName: 'tap_events'
//   }
// );

// export default TapEvent;
