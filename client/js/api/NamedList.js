import { get, post, del } from './utils/request'

const namedList = '/data/namedList'
const namedListObject = '/data/namedList/object'
const namedListWithoutType = '/data/namedList/without/type'

export default {
	async getNamedList({ areaIds, types, isUserDefined }) {
		return await get(namedList, {
			areaIds,
			types,
			isUserDefined,
		})
	},
	async getNamedListWithoutType({ areaIds, isUserDefined }) {
		return await get(namedListWithoutType, {
			areaIds,
			isUserDefined,
		})
	},
	async setNamedList({ areaId, name, type, isUserDefined, objectIds }) {
		return await post(namedList, {
			areaId,
			name,
			type,
			isUserDefined,
			objectIds,
		})
	},
	async removeNamedList({ namedListId }) {
		return await del(namedList, {
			namedListId,
		})
	},
	async addObject({ namedListId, objectId }) {
		return await post(namedListObject, {
			namedListId,
			objectId,
		})
	},
	async removeObject({ namedListId, objectId }) {
		return await del(namedListObject, {
			namedListId,
			objectId,
		})
	},
}
