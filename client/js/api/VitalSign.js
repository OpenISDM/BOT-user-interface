import { get, post } from './utils/request'

const vitalSignConfig = '/data/vitalSignConfig'

export default {
	async getConfig({ areaId }) {
		return await get(vitalSignConfig, { areaId })
	},

	async setConfig({ jsonLogic, statement, areaId, config }) {
		return await post(vitalSignConfig, { jsonLogic, statement, areaId, config })
	},
}
