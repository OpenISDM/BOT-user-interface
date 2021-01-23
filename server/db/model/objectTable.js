import pkg from 'sequelize'
import { sequelize } from '../connection'
const { DataTypes } = pkg

const ObjectTable = sequelize.define(
	'object_table',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		mac_address: {
			type: DataTypes.MACADDR,
		},
		name: {
			type: DataTypes.STRING,
		},
		type: {
			type: DataTypes.STRING,
		},
		status: {
			type: DataTypes.STRING,
		},
		monitor_type: {
			type: DataTypes.INTEGER,
		},
		transferred_location: {
			type: DataTypes.INTEGER,
		},
		asset_control_number: {
			type: DataTypes.STRING,
		},
		registered_timestamp: {
			type: DataTypes.TIME,
		},
		area_id: {
			type: DataTypes.INTEGER,
		},
		note_id: {
			type: DataTypes.INTEGER,
		},
		physician_id: {
			type: DataTypes.INTEGER,
		},
		object_type: {
			type: DataTypes.INTEGER,
		},
		reserved_timestamp: {
			type: DataTypes.TIME,
		},
		reserved_user_id: {
			type: DataTypes.INTEGER,
		},
		room: {
			type: DataTypes.STRING,
		},
		nickname: {
			type: DataTypes.STRING,
		},
		list_id: {
			type: DataTypes.INTEGER,
		},
		type_alias: {
			type: DataTypes.STRING,
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
	}
)

export default ObjectTable
