import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface ScheduleAttributes {
  id: string;
  routeId: string;
  busId?: string | null;
  dayOfWeek: number;
  departureTime: string;
  arrivalTime: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ScheduleCreationAttributes extends Optional<ScheduleAttributes, 'id' | 'isActive'> { }

export class Schedule extends Model<ScheduleAttributes, ScheduleCreationAttributes> implements ScheduleAttributes {
  public id!: string;
  public routeId!: string;
  public busId!: string | null;
  public dayOfWeek!: number;
  public departureTime!: string;
  public arrivalTime!: string;
  public isActive!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Schedule.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    routeId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    busId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    dayOfWeek: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    departureTime: {
      type: DataTypes.STRING,
      allowNull: false
    },
    arrivalTime: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    sequelize,
    modelName: 'Schedule',
    tableName: 'schedules'
  }
);

export default Schedule;
