import pkg from 'sequelize'
import { sequelize } from '../connection'
const { DataTypes } = pkg

const VitalSignConfig = sequelize.define(
	'vital_sign_config',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		area_id: {
			type: DataTypes.INTEGER,
		},
		condition: {
			type: DataTypes.STRING,
		},
		condition_json: {
			type: DataTypes.JSONB,
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
		underscored: true,
	}
)

export default VitalSignConfig
