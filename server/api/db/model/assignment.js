import pkg from 'sequelize'
import { sequelize } from '../connection'
const { DataTypes } = pkg

export const AssignmentEnum = {
	TYPE: {
		DEVICE: 0,
		PATIENT: 1,
	},
}

const Assignment = sequelize.define(
	'assignment',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
		},
		area_id: {
			type: DataTypes.INTEGER,
		},
		type: {
			type: DataTypes.INTEGER,
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
	}
)

export default Assignment
