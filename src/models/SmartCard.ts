// import { DataTypes, Model, Optional } from 'sequelize';
// import { sequelize } from '../config/database';

// export interface SmartCardAttributes {
//   id: string;
//   cardId: string;
//   userId: string;
//   isActive: boolean;
//   lastUsedAt?: Date;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// export interface SmartCardCreationAttributes extends Optional<SmartCardAttributes, 'id'> {}

// export class SmartCard extends Model<SmartCardAttributes, SmartCardCreationAttributes> implements SmartCardAttributes {
//   public id!: string;
//   public cardId!: string;
//   public userId!: string;
//   public isActive!: boolean;
//   public lastUsedAt?: Date;

//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
// }

// SmartCard.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true
//     },
//     cardId: {
//       type: DataTypes.STRING,
//       unique: true,
//       allowNull: false
//     },
//     userId: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       references: {
//         model: 'users',
//         key: 'id'
//       }
//     },
//     isActive: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: true
//     },
//     lastUsedAt: {
//       type: DataTypes.DATE,
//       allowNull: true
//     }
//   },
//   {
//     sequelize,
//     modelName: 'SmartCard',
//     tableName: 'smart_cards'
//   }
// );

// export default SmartCard;
