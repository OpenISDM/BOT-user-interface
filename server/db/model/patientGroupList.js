import pkg from 'sequelize'
import { sequelize } from '../connection'
import UserAssignments from './userAssignments'
const { DataTypes } = pkg

const PatientGroupList = sequelize.define(
	'patient_group_list',
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
		patients: {
			type: DataTypes.ARRAY(DataTypes.STRING),
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
	}
)

UserAssignments.belongsTo(PatientGroupList, { foreignKey: 'group_list_id' })

export default PatientGroupList
