import pkg from 'sequelize'
import { sequelize } from '../connection'
const { DataTypes } = pkg

const ObjectNamedListMappingTable = sequelize.define(
	'object_named_list_mapping_table',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		named_list_id: {
			type: DataTypes.INTEGER,
		},
		object_id: {
			type: DataTypes.INTEGER,
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
		underscored: true,
	}
)

export default ObjectNamedListMappingTable
