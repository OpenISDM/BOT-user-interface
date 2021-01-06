import pkg from 'sequelize'
import { sequelize } from '../connection'
const { DataTypes } = pkg

const ObjectNamedListMappingTable = sequelize.define(
	'object_named_list_mapping_table',
	{
		namedListId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		objectId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
		underscored: true,
	}
)

export default ObjectNamedListMappingTable
