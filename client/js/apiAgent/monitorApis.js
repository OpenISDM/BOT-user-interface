import { monitor } from '../dataSrc'
import { post, del, patch, put } from '../helper/httpClient'
import config from '../config'

const monitorApis = {
	async getMonitorConfig(type, areasId, isGetLbeaconPosition = false) {
		return await post(monitor, {
			type: config.monitorSettingUrlMap[type],
			areasId,
			isGetLbeaconPosition,
		})
	},

	async delete(configPackage) {
		return await del(monitor, {
			configPackage,
		})
	},

	async add(configPackage) {
		return await patch(monitor, {
			configPackage,
		})
	},

	async put(configPackage) {
		return await put(monitor, {
			configPackage,
		})
	},
}

export default monitorApis
