import { get } from './utils/request'

const role = '/data/role'

export default {
	async getAllRole() {
		return await get(role)
	},
}
