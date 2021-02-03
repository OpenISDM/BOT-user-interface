import pkg from 'sequelize'
import { sequelize } from '../connection'
const { DataTypes } = pkg

const LBeaconTable = sequelize.define(
	'lbeacon_table',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		uuid: {
			type: DataTypes.UUID,
		},
		ip_address: {
			type: DataTypes.INET,
		},
		description: {
			type: DataTypes.STRING,
		},
		health_status: {
			type: DataTypes.INTEGER,
		},
		gateway_ip_address: {
			type: DataTypes.INET,
		},
		registered_timestamp: {
			type: DataTypes.TIME,
		},
		last_report_timestamp: {
			type: DataTypes.TIME,
		},
		danger_area: {
			type: DataTypes.INTEGER,
		},
		room: {
			type: DataTypes.STRING,
		},
		api_version: {
			type: DataTypes.STRING,
		},
		server_time_offset: {
			type: DataTypes.INTEGER,
		},
		product_version: {
			type: DataTypes.STRING,
		},
		comment: {
			type: DataTypes.STRING,
		},
		is_dominated: {
			type: DataTypes.INTEGER,
		},
		cleaning_zone: {
			type: DataTypes.INTEGER,
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
		underscored: true,
	}
)

export default LBeaconTable
