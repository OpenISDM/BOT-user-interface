import 'dotenv/config'
import dbQueries from '../../db/gatewayQueries'
import pool from '../../db/connection'
import {GatewayTable} from '../../db/models'
export default {
	getAllGateway: async (request, response) => {
		try {
			const res = await GatewayTable.findAll()
			console.log('get gateway table succeed')
			response.status(200).json(res)
		} catch (e) {
			console.log(`get gateway table failed ${e}`)
		}
	},

	deleteGateway: async (request, response) => {
		const { ids } = request.body
		try {
			const res = await pool.query(dbQueries.deleteGateway(ids))
			console.log('delete Gateway record succeed')
			response.status(200).json(res)
		} catch (e) {
			console.log(`delete gateway failed ${e}`)
		}
	},

	editGateway: async (request, response) => {
		const { formOption } = request.body
		try {
			const res = await pool.query(dbQueries.editGateway(formOption))
			console.log('edit gateway succeed')
			response.status(200).json(res)
		} catch (e) {
			console.log(`edit gateway failed ${e}`)
		}
	},
}
