import 'dotenv/config'
import { AgentTable } from '../../db/models'

export default {
	getAllAgents: async (request, response) => {
		try {
			const res = await AgentTable.findAll()
			console.log('get agent table succeed')
			response.status(200).json(res)
		} catch (e) {
			console.log(`get agent table failed ${e}`)
		}
	},

	deleteAgent: async (request, response) => {
		const { ids } = request.body
		try {
			const res = await AgentTable.destroy({ where: { id: ids } })
			console.log('delete Agents record succeed')
			response.status(200).json(res)
		} catch (e) {
			console.log(`delete agents failed ${e}`)
		}
	},

	editAgent: async (request, response) => {
		const { comment, id } = request.body.formOption
		try {
			const res = await AgentTable.update({ comment }, { where: { id } })
			console.log('edit Agents succeed')
			response.status(200).json(res)
		} catch (e) {
			console.log(`edit Agents failed ${e}`)
		}
	},
}
