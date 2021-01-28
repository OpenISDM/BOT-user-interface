import pkg from 'sequelize'
import { sequelize } from '../connection'
const { DataTypes } = pkg

const UserRole = sequelize.define(
	'user_role',
	{
		user_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		role_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
		underscored: true,
	}
)

export default UserRole
