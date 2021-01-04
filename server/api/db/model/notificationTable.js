import pkg from 'sequelize'
import { sequelize } from '../connection'
const { DataTypes } = pkg

const NotificationTable = sequelize.define(
	'notification_table',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		area_id: {
			type: DataTypes.INTEGER,
		},
		monitor_type: {
			type: DataTypes.INTEGER,
		},
		mac_address: {
			type: DataTypes.MACADDR,
		},
		uuid: {
			type: DataTypes.UUID,
		},
		violation_timestamp: {
			type: DataTypes.TIME,
		},
		processed: {
			type: DataTypes.INTEGER,
		},
		web_processed: {
			type: DataTypes.INTEGER,
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
	}
)

export default NotificationTable
