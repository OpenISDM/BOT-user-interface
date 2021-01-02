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
		name: {
			type: DataTypes.STRING,
		},
		type: {
			type: DataTypes.INTEGER,
		},
		is_user_defined: {
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
