import { record, monitor } from '../dataSrc'
import { post, put, del, patch } from '../helper/httpClient'

export default {
	async getRecord(type, locale) {
		return await post(record[type], {
			locale,
		})
	},

	async addShiftChangeRecord({ userInfo, pdfPackage, shift, list_id }) {
		return await put(record.shiftChange, {
			userInfo,
			pdfPackage,
			shift,
			list_id,
		})
	},

	async deleteShiftChangeRecord({ idPackage }) {
		return await del(record.shiftChange, {
			idPackage,
		})
	},

	async deleteEditObjectRecord({ idPackage }) {
		return await del(record.editedObject, {
			idPackage,
		})
	},

	async addPatientRecord({ objectPackage }) {
		return await post(record.patientRecord, {
			objectPackage,
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
