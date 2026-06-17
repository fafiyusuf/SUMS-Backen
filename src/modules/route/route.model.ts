import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

/**
 * @swagger
 * components:
 *   schemas:
 *     Route:
 *       type: object
 *       required:
 *         - name
 *         - startPoint
 *         - endPoint
 *         - distance
 *         - estimatedDuration
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         startPoint:
 *           type: string
 *         endPoint:
 *           type: string
 *         distance:
 *           type: number
 *           format: float
 *         estimatedDuration:
 *           type: integer
 *           description: Duration in minutes
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
export interface RouteAttributes {
  id: string;
  name: string;
  startPoint: string;
  endPoint: string;
  distance: number;
  estimatedDuration: number;
  // routeType: 'operational' | 'simulation' | 'test';
  // simulationEnabled: boolean;
  status: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RouteCreationAttributes extends Optional<RouteAttributes, 'id' | 'status'> { }

export class Route extends Model<RouteAttributes, RouteCreationAttributes> implements RouteAttributes {
  public id!: string;
  public name!: string;
  public startPoint!: string;
  public endPoint!: string;
  public distance!: number;
  public estimatedDuration!: number;
  // public routeType!: 'operational' | 'simulation' | 'test';
  // public simulationEnabled!: boolean;
  public status!: 'active' | 'inactive';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Route.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    startPoint: {
      type: DataTypes.STRING,
      allowNull: false
    },
    endPoint: {
      type: DataTypes.STRING,
      allowNull: false
    },
    distance: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    estimatedDuration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Duration in minutes'
    },
    /* 
    routeType: {
      type: DataTypes.ENUM('operational', 'simulation', 'test'),
      defaultValue: 'operational'
    },
    simulationEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    */
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    }
  },
  {
    sequelize,
    modelName: 'Route',
    tableName: 'routes'
  }
);

export default Route;
