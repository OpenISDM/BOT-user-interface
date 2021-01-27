import pkg from 'sequelize'
import { sequelize } from '../connection'
const { DataTypes } = pkg

const UserArea = sequelize.define(
	'user_area',
	{
		user_id: {
			type: DataTypes.INTEGER,
		},
		area_id: {
			type: DataTypes.INTEGER,
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
		underscored: true,
	}
)

export default UserArea
