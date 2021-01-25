import pkg from 'sequelize'
import { sequelize } from '../connection'
const { DataTypes } = pkg

const Roles = sequelize.define(
	'roles',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
		},
	},
	{
		timestamps: false,
	}
)

export default Roles
