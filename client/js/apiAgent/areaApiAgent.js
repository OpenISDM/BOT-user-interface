import { area, areaUser } from '../dataSrc'
import { post, get } from '../helper/httpClient'

export default {
	async getAreaTable() {
		return await post(area)
	},
	async getAreaTableByUserId({ userId }) {
		return await get(areaUser, { userId })
	},
}
