import pkg from 'sequelize'
import { sequelize } from '../connection'
const { DataTypes } = pkg

const NotificationConfig = sequelize.define(
	'notification_config',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		area_id: {
			type: DataTypes.INTEGER,
		},
		sms_contact_list: {
			type: DataTypes.STRING,
		},
		sms_template: {
			type: DataTypes.STRING,
		},
		alert_last_sec: {
			type: DataTypes.INTEGER,
		},
		monitor_type: {
			type: DataTypes.INTEGER,
		},
		active_alert_types: {
			type: DataTypes.INTEGER,
		},
		enable: {
			type: DataTypes.INTEGER,
		},
		start_time: {
			type: DataTypes.TIME,
		},
		end_time: {
			type: DataTypes.TIME,
		},
		name: {
			type: DataTypes.STRING,
		},
		is_active: {
			type: DataTypes.INTEGER,
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
	}
)

export default NotificationConfig
