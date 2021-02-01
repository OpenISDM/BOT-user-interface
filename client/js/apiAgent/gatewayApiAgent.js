import { gateway } from '../dataSrc'
import { get, del, put } from '../helper/httpClient'

export default {
	async getGatewayTable({ locale }) {
		return await get(gateway, {
			locale,
		})
	},

	async deleteGateway({ ids }) {
		return await del(gateway, { ids })
	},

	async putGateway({ formOption }) {
		return await put(gateway, { formOption })
	},
}
