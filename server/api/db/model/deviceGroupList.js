import pkg from 'sequelize'
import { sequelize } from '../connection'
const { DataTypes } = pkg

const DeviceGroupList = sequelize.define(
	'device_group_list',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
		},
		area_id: {
			type: DataTypes.INTEGER,
		},
		items: {
			type: DataTypes.ARRAY(DataTypes.STRING),
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
	}
)

export default DeviceGroupList
