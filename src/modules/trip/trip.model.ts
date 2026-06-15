import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface TripAttributes {
  id: string;
  userId: string;
  busId: string;
  routeId: string;
  startStopId: string;
  endStopId?: string | null;
  startTime: Date;
  endTime?: Date | null;
  fare: number;
  status: 'ongoing' | 'completed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TripCreationAttributes extends Optional<TripAttributes, 'id'> {}

export class Trip extends Model<TripAttributes, TripCreationAttributes> implements TripAttributes {
  public id!: string;
  public userId!: string;
  public busId!: string;
  public routeId!: string;
  public startStopId!: string;
  public endStopId?: string | null;
  public startTime!: Date;
  public endTime?: Date | null;
  public fare!: number;
  public status!: 'ongoing' | 'completed' | 'cancelled';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Trip.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    busId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'buses',
        key: 'id'
      }
    },
    routeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'routes',
        key: 'id'
      }
    },
    startStopId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'stops',
        key: 'id'
      }
    },
    endStopId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'stops',
        key: 'id'
      }
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fare: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('ongoing', 'completed', 'cancelled'),
      defaultValue: 'ongoing'
    }
  },
  {
    sequelize,
    modelName: 'Trip',
    tableName: 'trips'
  }
);

export default Trip;
