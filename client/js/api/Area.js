import { post, get } from '../utils/request'

const area = '/data/area'
const areaUser = '/data/area/user'

export default {
	async getAreaTable() {
		return await post(area)
	},
	async getAreaTableByUserId({ userId }) {
		return await get(areaUser, { userId })
	},
}
