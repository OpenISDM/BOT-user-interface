import { post, put, del } from './utils/request'

const record = {
	editedObject: '/data/record/editedObject',
	shiftChange: '/data/record/shiftChange',
	patientRecord: '/data/record/patientRecord',
}

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
}
