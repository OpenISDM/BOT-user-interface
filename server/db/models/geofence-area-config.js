import pkg from 'sequelize'
import { sequelize } from '../connection'
const { DataTypes } = pkg

const GeoFenceAreaConfig = sequelize.define(
	'geo_fence_area_config',
	{
		area_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		monitored_object_types: {
			type: DataTypes.STRING,
		},
		monitored_patient_named_list_ids: {
			type: DataTypes.STRING,
		},
		monitored_device_named_list_ids: {
			type: DataTypes.STRING,
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
	}
)

export default GeoFenceAreaConfig
