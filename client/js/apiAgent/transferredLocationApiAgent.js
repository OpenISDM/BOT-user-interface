import { transferredLocation } from '../dataSrc'
import { get, post } from '../helper/httpClient'

export default {
	async getAll() {
		return await get(transferredLocation.getAll)
	},

	async addOne({ name, department }) {
		return await post(transferredLocation.addOne, {
			name,
			department,
		})
	},

	async removeByIds({ transferLocationIds }) {
		return await post(transferredLocation.removeByIds, {
			transferLocationIds,
		})
	},
}
