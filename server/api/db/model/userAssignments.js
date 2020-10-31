import pkg from 'sequelize'
import { sequelize } from '../connection'
const { DataTypes } = pkg

export const UserAssignmentEnum = {
	STATUS: {
		ON_GOING: 0,
		COMPLETED: 1,
		CANCEL: 2,
	},
}

const UserAssignments = sequelize.define(
	'user_assignments',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		user_id: {
			type: DataTypes.INTEGER,
		},
		assignment_id: {
			type: DataTypes.INTEGER,
		},
		status: {
			type: DataTypes.INTEGER,
		},
		assigned_time: {
			type: DataTypes.TIME,
		},
		completed_time: {
			type: DataTypes.TIME,
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
	}
)

export default UserAssignments
