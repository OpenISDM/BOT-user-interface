import pkg from 'sequelize'
import { sequelize } from '../connection'
const { DataTypes } = pkg

const GeoFenceConfig = sequelize.define(
	'geo_fence_config',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
		},
		enable: {
			type: DataTypes.INTEGER,
		},
		start_time: {
			type: DataTypes.STRING,
		},
		end_time: {
			type: DataTypes.STRING,
		},
		is_active: {
			type: DataTypes.INTEGER,
		},
		area_id: {
			type: DataTypes.INTEGER,
		},
		is_global_fence: {
			type: DataTypes.INTEGER,
		},
		perimeters_number_uuid: {
			type: DataTypes.INTEGER,
		},
		fences_number_uuid: {
			type: DataTypes.INTEGER,
		},
		fences_rssi: {
			type: DataTypes.INTEGER,
		},
		perimeters_rssi: {
			type: DataTypes.INTEGER,
		},
		perimeters_uuid: {
			type: DataTypes.STRING,
		},
		fences_uuid: {
			type: DataTypes.STRING,
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
	}
)

export default GeoFenceConfig
