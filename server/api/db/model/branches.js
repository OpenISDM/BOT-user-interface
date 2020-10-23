import pkg from 'sequelize'
import { sequelize } from '../connection'
const { DataTypes } = pkg

const Branches = sequelize.define(
	'branches',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
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

export default Branches
