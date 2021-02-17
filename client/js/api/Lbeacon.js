import { get, put, del } from './utils/request'

const lbeacon = '/data/lbeacon'

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
