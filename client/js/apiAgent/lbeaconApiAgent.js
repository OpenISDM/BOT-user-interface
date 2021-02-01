import { lbeacon } from '../dataSrc'
import { get, put, del } from '../helper/httpClient'

export default {
	async getLbeaconTable({ locale }) {
		return await get(lbeacon, {
			locale,
		})
	},

	async putLbeacon({ formOption }) {
		return await put(lbeacon, {
			formOption,
		})
	},

	async deleteLbeacon({ ids }) {
		return await del(lbeacon, {
			ids,
		})
	},
}
