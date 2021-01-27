import pkg from 'sequelize'
import { sequelize } from '../connection'
const { DataTypes } = pkg

const UserTable = sequelize.define(
	'user_table',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
		},
		password: {
			type: DataTypes.STRING,
		},
		registered_timestamp: {
			type: DataTypes.TIME,
		},
		last_visit_timestamp: {
			type: DataTypes.TIME,
		},
		locale_id: {
			type: DataTypes.INTEGER,
		},
		max_search_history_count: {
			type: DataTypes.INTEGER,
		},
		username_sha256: {
			type: DataTypes.STRING,
		},
		password_sha256: {
			type: DataTypes.STRING,
		},
		email: {
			type: DataTypes.STRING,
		},
		keyword_type: {
			type: DataTypes.INTEGER,
		},
		list_id: {
			type: DataTypes.INTEGER,
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
		underscored: true,
	}
)

export default UserTable
