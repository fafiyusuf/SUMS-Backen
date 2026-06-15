import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface SystemSettingAttributes {
    id: string;
    key: string;
    value: string;
    description: string | null;
    updatedBy: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface SystemSettingCreationAttributes extends Optional<SystemSettingAttributes, 'id' | 'description' | 'updatedBy'> { }

export class SystemSetting extends Model<SystemSettingAttributes, SystemSettingCreationAttributes> implements SystemSettingAttributes {
    public id!: string;
    public key!: string;
    public value!: string;
    public description!: string | null;
    public updatedBy!: string | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

SystemSetting.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        updatedBy: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        modelName: 'SystemSetting',
        tableName: 'system_settings'
    }
);

export default SystemSetting;
