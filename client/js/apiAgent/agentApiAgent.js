import { agent } from '../dataSrc'
import { get, del, put } from '../helper/httpClient'

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
