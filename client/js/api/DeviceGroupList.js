import { get, post, put, del } from './utils/request'

const deviceGroupList = '/data/deviceGroupList'
const deviceGruopDetailByAreaId = '/data/deviceGruopDetailByAreaId'

const deviceGroupListApis = {
	async addDeviceGroupList({ name, areaId }) {
		return await post(deviceGroupList, {
			name,
			areaId,
		})
	},

	async getDeviceGroupList() {
		return await get(deviceGroupList)
	},

	async modifyDeviceGroupList({ groupId, mode, itemId }) {
		return await put(deviceGroupList, {
			groupId,
			mode,
			itemId,
		})
	},

	async deleteGroup({ groupId }) {
		return await del(deviceGroupList, { groupId })
	},

	async getDetailByAreaId(areaId) {
		return await get(deviceGruopDetailByAreaId, {
			areaId,
		})
	},
}

export default deviceGroupListApis
