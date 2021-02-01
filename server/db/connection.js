import pkg from 'sequelize'
import pg from 'pg'
import { decrypt } from '../helpers/encrypt'

const { Sequelize } = pkg

export const { Op } = pkg

export const sequelize = new Sequelize(
	process.env.DB_DATABASE,
	process.env.DB_USER,
	decrypt(process.env.DB_PASS),
	{
		host: process.env.DB_HOST,
		dialect: 'postgres',
		logging: process.env.DB_LOGGING === 'true',
	}
)

export const pgClient = new pg.Client(
	`postgres://${process.env.DB_USER}:${decrypt(process.env.DB_PASS)}@${
		process.env.DB_HOST
	}:5432/${process.env.DB_DATABASE}`
)

const config = {
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_DATABASE,
	password: decrypt(process.env.DB_PASS),
	port: process.env.DB_PORT,
}

export const updateOrCreate = async ({ model, where, newItem }) => {
	// First try to find the record
	const foundItem = await model.findOne({ where })
	if (!foundItem) {
		// Item not found, create a new one
		const item = await model.create(newItem)
		return { item, created: true }
	}
	// Found an item, update it
	const [, [item]] = await model.update(newItem, { where, returning: true })
	return { item, created: false }
}

export default new pg.Pool(config)
