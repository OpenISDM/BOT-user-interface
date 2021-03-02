import { post, del, patch, put } from './utils/request'
import config from '../config'

const monitor = '/data/monitor'

const monitorApis = {
	async getMonitorConfig(type, areaIds) {
		return await post(monitor, {
			type: config.monitorSettingUrlMap[type],
			areaIds,
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
