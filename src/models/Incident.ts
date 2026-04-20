import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface IncidentAttributes {
  id: string;
  busId: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  reportedBy: string;
  status: 'open' | 'acknowledged' | 'resolved';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IncidentCreationAttributes extends Optional<IncidentAttributes, 'id'> {}

export class Incident extends Model<IncidentAttributes, IncidentCreationAttributes> implements IncidentAttributes {
  public id!: string;
  public busId!: string;
  public type!: string;
  public severity!: 'low' | 'medium' | 'high' | 'critical';
  public description!: string;
  public reportedBy!: string;
  public status!: 'open' | 'acknowledged' | 'resolved';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Incident.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    busId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'buses',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    severity: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    reportedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('open', 'acknowledged', 'resolved'),
      defaultValue: 'open'
    }
  },
  {
    sequelize,
    modelName: 'Incident',
    tableName: 'incidents'
  }
);

export default Incident;
