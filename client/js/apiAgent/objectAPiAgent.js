import { object, objectPackage } from '../dataSrc'
import { get, put, post, patch, del } from '../helper/httpClient'

export default {
	async getObjectTable({ areas_id, objectTypes }) {
		return await get(object.object, {
			areas_id,
			objectTypes,
		})
	},

	async getAliases({ objectType, areaId }) {
		return await get(object.alias, {
			objectType,
			areaId,
		})
	},

	async editAlias({ objectType, alias, areaId }) {
		return await put(object.alias, {
			objectType,
			alias,
			areaId,
		})
	},

	async editAliases({ objectTypeList, areaId }) {
		return await put(object.aliases, {
			objectTypeList,
			areaId,
		})
	},

	async post({ formOption, mode }) {
		return await post(object[mode], {
			formOption,
		})
	},

	async put({ formOption, mode }) {
		return await put(object[mode], {
			formOption,
		})
	},

	async editObjectPackage(
		locale,
		formOption,
		username,
		pdfPackage,
		reservedTimestamp
	) {
		return await put(objectPackage, {
			locale,
			formOption,
			username,
			pdfPackage,
			reservedTimestamp,
		})
	},

	async deleteObject({ formOption }) {
		return await del(object.object, {
			formOption,
		})
	},

	async disassociate({ formOption }) {
		return await patch(object.object, {
			formOption,
		})
	},

	async getIdleMacaddr() {
		return await post(object.idleMacaddr)
	},

	async getAcnSet() {
		return await get(object.acn)
	},

	async editNickname({ personList }) {
		return await post(object.nickname, { personList })
	},
}
