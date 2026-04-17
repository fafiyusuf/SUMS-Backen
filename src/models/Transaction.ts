import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface TransactionAttributes {
	id: string;
	userId: string;
	type: 'debit' | 'credit';
	amount: number;
	description: string;
	reference?: string;
	status: 'pending' | 'completed' | 'failed';
	createdAt?: Date;
	updatedAt?: Date;
}

export interface TransactionCreationAttributes extends Optional<TransactionAttributes, 'id'> {}

export class Transaction extends Model<TransactionAttributes, TransactionCreationAttributes> implements TransactionAttributes {
	public id!: string;
	public userId!: string;
	public type!: 'debit' | 'credit';
	public amount!: number;
	public description!: string;
	public reference?: string;
	public status!: 'pending' | 'completed' | 'failed';

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Transaction.init(
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
		type: {
			type: DataTypes.ENUM('debit', 'credit'),
			allowNull: false
		},
		amount: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false
		},
		reference: {
			type: DataTypes.STRING,
			allowNull: true
		},
		status: {
			type: DataTypes.ENUM('pending', 'completed', 'failed'),
			defaultValue: 'pending'
		}
	},
	{
		sequelize,
		modelName: 'Transaction',
		tableName: 'transactions'
	}
);

export default Transaction;
