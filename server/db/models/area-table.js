import pkg from 'sequelize'
import { sequelize } from '../connection'
const { DataTypes } = pkg

const AreaTable = sequelize.define(
	'area_table',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
		},
		readable_name: {
			type: DataTypes.STRING,
		},
		is_proximity_detection: {
			type: DataTypes.INTEGER,
		},
		top_n_lbeacons: {
			type: DataTypes.INTEGER,
		},
		left_bottom_corner: {
			type: DataTypes.GEOMETRY('POINT', 4326),
		},
		right_upper_corner: {
			type: DataTypes.GEOMETRY('POINT', 4326),
		},
		map_image_path: {
			type: DataTypes.STRING,
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
		underscored: true,
	}
)

export default AreaTable
