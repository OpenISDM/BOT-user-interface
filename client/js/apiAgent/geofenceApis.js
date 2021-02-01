import { geofence, geofenceArea } from '../dataSrc'
import { post, put, del, patch, get } from '../helper/httpClient'

const geofenceApis = {
	async getGeofenceConfig({ areaId }) {
		return await post(geofence, {
			areaId,
		})
	},

	async delete({ ids }) {
		return await del(geofence, {
			ids,
		})
	},

	async add({ configPackage }) {
		return await patch(geofence, {
			configPackage,
		})
	},

	async setGeofenceConfig({ configPackage }) {
		return await put(geofence, {
			configPackage,
		})
	},

	async setGeofenceAreaConfig({ areaConfig }) {
		return await post(geofenceArea, {
			areaConfig,
		})
	},

	async getGeofenceAreaConfig({ areaId }) {
		return await get(geofenceArea, {
			areaId,
		})
	},
}

export default geofenceApis
