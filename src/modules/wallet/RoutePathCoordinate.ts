import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface RoutePathCoordinateAttributes {
    id: string;
    routeId: string;
    sequence: number;
    latitude: number;
    longitude: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface RoutePathCoordinateCreationAttributes extends Optional<RoutePathCoordinateAttributes, 'id'> { }

export class RoutePathCoordinate extends Model<RoutePathCoordinateAttributes, RoutePathCoordinateCreationAttributes> implements RoutePathCoordinateAttributes {
    public id!: string;
    public routeId!: string;
    public sequence!: number;
    public latitude!: number;
    public longitude!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

RoutePathCoordinate.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        routeId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'routes',
                key: 'id'
            }
        },
        sequence: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'RoutePathCoordinate',
        tableName: 'route_path_coordinates'
    }
);

export default RoutePathCoordinate;
