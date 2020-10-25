import pkg from 'sequelize'
import { sequelize } from '../connection'
const { DataTypes } = pkg

export const UserAssignmentEnum = {
	ASSIGNMENT_TYPE: {
		DEVICE: 0,
		PATIENT: 1,
	},
	STATUS: {
		ON_GOING: 0,
		COMPLETED: 1,
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
		group_list_id: {
			type: DataTypes.INTEGER,
		},
		assignment_type: {
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
