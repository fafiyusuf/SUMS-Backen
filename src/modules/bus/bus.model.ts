import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

/**
 * @swagger
 * components:
 *   schemas:
 *     Bus:
 *       type: object
 *       required:
 *         - registrationNumber
 *         - capacity
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         registrationNumber:
 *           type: string
 *           unique: true
 *         driverId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: The driver currently assigned to this bus (one bus = one driver)
 *         routeId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: The route this bus is currently assigned to
 *         capacity:
 *           type: integer
 *         currentPassengers:
 *           type: integer
 *           default: 0
 *         status:
 *           type: string
 *           enum: [active, inactive, maintenance]
 *           default: inactive
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
export interface BusAttributes {
  id: string;
  registrationNumber: string;
  driverId: string | null;
  routeId: string | null;
  capacity: number;
  currentPassengers: number;
  status: 'active' | 'inactive' | 'maintenance';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BusCreationAttributes extends Optional<BusAttributes, 'id'> { }

export class Bus extends Model<BusAttributes, BusCreationAttributes> implements BusAttributes {
  public id!: string;
  public registrationNumber!: string;
  public driverId!: string | null;
  public routeId!: string | null;
  public capacity!: number;
  public currentPassengers!: number;
  public status!: 'active' | 'inactive' | 'maintenance';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Bus.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    registrationNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    driverId: {
      type: DataTypes.UUID,
      // UNIQUE enforces one-driver-per-bus at the DB level.
      // allowNull: true means a bus can exist without a driver assigned yet.
      unique: true,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    routeId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'routes',
        key: 'id'
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    currentPassengers: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'maintenance'),
      defaultValue: 'inactive'
    }
  },
  {
    sequelize,
    modelName: 'Bus',
    tableName: 'buses'
  }
);

export default Bus;
