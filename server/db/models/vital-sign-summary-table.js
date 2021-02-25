import pkg from 'sequelize'
import { sequelize } from '../connection'
const { DataTypes } = pkg

const VitalSignSummaryTable = sequelize.define(
	'vital_sign_summary_table',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		mac_address: {
			type: DataTypes.MACADDR,
		},
		last_reported_timestamp: {
			type: DataTypes.TIME,
		},
		temperature: {
			type: DataTypes.INTEGER,
		},
		heart_rate: {
			type: DataTypes.INTEGER,
		},
		systolic_blood_pressure: {
			type: DataTypes.INTEGER,
		},
		diastolic_blood_pressure: {
			type: DataTypes.INTEGER,
		},
		blood_oxygen: {
			type: DataTypes.INTEGER,
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
		underscored: true,
	}
)

export default VitalSignSummaryTable
