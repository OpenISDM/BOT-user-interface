import pkg from 'sequelize'
import { sequelize } from '../connection'
const { DataTypes } = pkg

const ObjectSummaryTable = sequelize.define(
	'object_summary_table',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		mac_address: {
			type: DataTypes.MACADDR,
		},
		uuid: {
			type: DataTypes.UUID,
		},
		rssi: {
			type: DataTypes.INTEGER,
		},
		first_seen_timestamp: {
			type: DataTypes.TIME,
		},
		last_seen_timestamp: {
			type: DataTypes.TIME,
		},
		last_reported_timestamp: {
			type: DataTypes.TIME,
		},
		panic_violation_timestamp: {
			type: DataTypes.TIME,
		},
		geofence_violation_timestamp: {
			type: DataTypes.TIME,
		},
		location_violation_timestamp: {
			type: DataTypes.TIME,
		},
		battery_voltage: {
			type: DataTypes.INTEGER,
		},
		base_x: {
			type: DataTypes.INTEGER,
		},
		base_y: {
			type: DataTypes.INTEGER,
		},
		updated_by_area: {
			type: DataTypes.TIME,
		},
		updated_by_n_lbeacons: {
			type: DataTypes.INTEGER,
		},
		push_button_timestamp: {
			type: DataTypes.TIME,
		},
		clear_bed: {
			type: DataTypes.INTEGER,
		},
		payload: {
			type: DataTypes.STRING,
		},
		activity_violation_timestamp: {
			type: DataTypes.TIME,
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
	}
)

export default ObjectSummaryTable
