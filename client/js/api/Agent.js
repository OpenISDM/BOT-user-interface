import { get, del, put } from '../utils/request'

const agent = '/data/agent'

export default {
	async getAllAgents() {
		return await get(agent)
	},

	async deleteAgent({ ids }) {
		return await del(agent, { ids })
	},

	async editAgent({ id, comment }) {
		return await put(agent, { id, comment })
	},
}
