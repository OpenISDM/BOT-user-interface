import pkg from 'sequelize'
import { sequelize } from '../connection'
const { DataTypes } = pkg

const NamedList = sequelize.define(
	'named_list',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		areaId: {
			type: DataTypes.INTEGER,
		},
		name: {
			type: DataTypes.STRING,
		},
		type: {
			type: DataTypes.INTEGER,
		},
		isUserDefined: {
			type: DataTypes.BOOLEAN,
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
		underscored: true,
	}
)

export default NamedList
