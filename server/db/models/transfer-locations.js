import pkg from 'sequelize'
import { sequelize } from '../connection'
const { DataTypes } = pkg

const TransferLocations = sequelize.define(
	'transfer_locations',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
		},
		department: {
			type: DataTypes.STRING,
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
	}
)

export default TransferLocations
