import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface TelebirrPaymentAttributes {
    id: string;
    invoiceNo: string;
    receiptUrl: string;
    senderName: string;
    receiverName: string;
    receiverAccount: string;
    totalPaid: number;
    creditedAmount: number;
    status: string;
    verifiedAt: Date;
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface TelebirrPaymentCreationAttributes
    extends Optional<TelebirrPaymentAttributes, 'id'> { }

export class TelebirrPayment
    extends Model<TelebirrPaymentAttributes, TelebirrPaymentCreationAttributes>
    implements TelebirrPaymentAttributes {
    public id!: string;
    public invoiceNo!: string;
    public receiptUrl!: string;
    public senderName!: string;
    public receiverName!: string;
    public receiverAccount!: string;
    public totalPaid!: number;
    public creditedAmount!: number;
    public status!: string;
    public verifiedAt!: Date;
    public userId!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

TelebirrPayment.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        invoiceNo: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        receiptUrl: {
            type: DataTypes.STRING,
            allowNull: false
        },
        senderName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        receiverName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        receiverAccount: {
            type: DataTypes.STRING,
            allowNull: false
        },
        totalPaid: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        creditedAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        verifiedAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        modelName: 'TelebirrPayment',
        tableName: 'telebirr_payments'
    }
);

export default TelebirrPayment;
