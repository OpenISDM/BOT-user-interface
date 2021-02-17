import { get, del, put } from './utils/request'

const gateway = '/data/gateway'

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
