import pkg from 'sequelize'
import { sequelize } from '../connection'
const { DataTypes } = pkg

const Roles = sequelize.define(
	'roles',
	{
		name: {
			type: DataTypes.STRING,
		},
	},
	{
		timestamps: false,
	}
)

export default Roles
