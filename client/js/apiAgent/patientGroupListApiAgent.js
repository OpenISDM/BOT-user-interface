import { patientGroupList, patientGruopDetailByAreaId } from '../dataSrc'
import { get, post, put, del } from '../helper/httpClient'

const patientGroupListApis = {
	async addPatientGroupList({ name, areaId }) {
		return await post(patientGroupList, { name, areaId })
	},

	async getPatientGroupList() {
		return await get(patientGroupList)
	},

	async modifyPatientGroupList({ groupId, mode, itemId }) {
		return await put(patientGroupList, {
			groupId,
			mode,
			itemId,
		})
	},

	async deleteGroup({ groupId }) {
		return await del(patientGroupList, { groupId })
	},

	async getDetailByAreaId(areaId) {
		return await get(patientGruopDetailByAreaId, {
			areaId,
		})
	},
}

export default patientGroupListApis
