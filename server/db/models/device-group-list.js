import pkg from 'sequelize'
import { sequelize } from '../connection'
import UserAssignments from './user-assignments'
const { DataTypes } = pkg

const DeviceGroupList = sequelize.define(
	'device_group_list',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
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

UserAssignments.belongsTo(DeviceGroupList, { foreignKey: 'group_list_id' })

export default DeviceGroupList
