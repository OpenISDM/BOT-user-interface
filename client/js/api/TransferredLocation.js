import { get, post } from '../utils/request'

const getAll = '/data/transferredLocation/getAll'
const addOne = '/data/transferredLocation/addOne'
const removeByIds = '/data/transferredLocation/removeByIds'

export default {
	async getAll() {
		return await get(getAll)
	},

	async addOne({ name, department }) {
		return await post(addOne, {
			name,
			department,
		})
	},

	async removeByIds({ transferLocationIds }) {
		return await post(removeByIds, {
			transferLocationIds,
		})
	},
}
