import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface TapAttributes {
    id: string;
    cardId: string;
    busId: string;
    stopId: string;
    type: 'tap-in' | 'tap-out';
    timestamp: Date;
}

export interface TapCreationAttributes extends Optional<TapAttributes, 'id'> { }

export class Tap extends Model<TapAttributes, TapCreationAttributes> implements TapAttributes {
    public id!: string;
    public cardId!: string;
    public busId!: string;
    public stopId!: string;
    public type!: 'tap-in' | 'tap-out';
    public timestamp!: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Tap.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        cardId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'smart_cards',
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
        stopId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'stops',
                key: 'id'
            }
        },
        type: {
            type: DataTypes.ENUM('tap-in', 'tap-out'),
            allowNull: false
        },
        timestamp: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        sequelize,
        modelName: 'Tap',
        tableName: 'taps'
    }
);

export default Tap;
