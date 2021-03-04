import pkg from 'sequelize'
import { sequelize } from '../connection'
const { DataTypes } = pkg

const GatewayTable = sequelize.define(
	'gateway_table',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		ip_address: {
			type: DataTypes.INET,
		},
		health_status: {
			type: DataTypes.INTEGER,
		},
		registered_timestamp: {
			type: DataTypes.TIME,
		},
		last_report_timestamp: {
			type: DataTypes.TIME,
		},
		api_version: {
			type: DataTypes.STRING,
		},
		product_version: {
			type: DataTypes.STRING,
		},
		abnormal_lbeacon_list: {
			type: DataTypes.STRING,
		},
		comment: {
			type: DataTypes.STRING,
		},
		unique_id: {
			type: DataTypes.STRING,
		},
	},
	{
		freezeTableName: true.valueOf,
		timestamps: false,
		underscored: true,
	}
)

export default GatewayTable
