import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface WalletAttributes {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WalletCreationAttributes extends Optional<WalletAttributes, 'id'> {}

export class Wallet extends Model<WalletAttributes, WalletCreationAttributes> implements WalletAttributes {
  public id!: string;
  public userId!: string;
  public balance!: number;
  public currency!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Wallet.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'ETB'
    }
  },
  {
    sequelize,
    modelName: 'Wallet',
    tableName: 'wallets'
  }
);

export default Wallet;
