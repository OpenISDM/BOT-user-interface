import pkg from 'sequelize'
import { sequelize } from '../connection'
const { DataTypes } = pkg

const AssignmentObject = sequelize.define(
	'assignment_object',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		object_table_id: {
			type: DataTypes.INTEGER,
		},
		assignment_id: {
			type: DataTypes.INTEGER,
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
	}
)

export default AssignmentObject
