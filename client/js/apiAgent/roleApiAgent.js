import { role } from '../dataSrc'
import { get } from '../helper/httpClient'

export default {
	async getAllRole() {
		return await get(role)
	},
}
