import pkg from 'sequelize'
import { sequelize } from '../connection'
const { DataTypes } = pkg

const AgentTable = sequelize.define(
	'agent_table',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		area_id: {
			type: DataTypes.INTEGER,
		},
		unique_id: {
			type: DataTypes.STRING,
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
		comment: {
			type: DataTypes.STRING,
		},
		port: {
			type: DataTypes.INTEGER,
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
		underscored: true,
	}
)

export default AgentTable
