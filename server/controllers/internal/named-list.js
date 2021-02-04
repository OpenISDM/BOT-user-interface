import 'dotenv/config'
import { updateOrCreate } from '../../db/connection'
import { NamedList, ObjectNamedListMappingTable } from '../../db/models'

export default {
	getNamedList: async (request, response) => {
		const { areaIds, types, isUserDefined } = request.query
		try {
			const res = await NamedList.findAll({
				where: { areaId: areaIds, type: types, isUserDefined },
				include: {
					model: ObjectNamedListMappingTable,
					attributes: ['object_id'],
					as: 'objectIds',
				},
			})
			response.status(200).json(res)
		} catch (e) {
			console.log('getNamedList error: ', e)
		}
	},
	getNamedListWithoutType: async (request, response) => {
		const { areaIds, isUserDefined } = request.query
		try {
			const res = await NamedList.findAll({
				where: { areaId: areaIds, isUserDefined },
				include: {
					model: ObjectNamedListMappingTable,
					attributes: ['object_id'],
					as: 'objectIds',
				},
			})
			response.status(200).json(res)
		} catch (e) {
			console.log('getNamedListWithoutType error: ', e)
		}
	},
	setNamedList: async (request, response) => {
		const { areaId, name, type, isUserDefined, objectIds } = request.body
		try {
			const { item } = await updateOrCreate({
				model: NamedList,
				where: { areaId, name, type, isUserDefined },
				newItem: { areaId, name, type, isUserDefined },
			})
			const dataToBeAdded = objectIds.map((objectId) => {
				return {
					namedListId: item.id,
					objectId,
				}
			})
			const res = await ObjectNamedListMappingTable.bulkCreate(dataToBeAdded, {
				updateOnDuplicate: ['namedListId', 'objectId'],
			})

			response.status(200).json(res)
		} catch (e) {
			console.log('setNamedList error: ', e)
		}
	},
	removeNamedList: async (request, response) => {
		const { namedListId } = request.body
		try {
			const namedListPromise = NamedList.destroy({ where: { id: namedListId } })
			const objectMappingPromise = ObjectNamedListMappingTable.destroy({
				where: { namedListId },
			})
			await Promise.all([namedListPromise, objectMappingPromise])
			response.status(200).json('OK')
		} catch (e) {
			console.log('removeNamedList error: ', e)
		}
	},
	addObject: async (request, response) => {
		const { namedListId, objectId } = request.body
		try {
			const namedListQueried = await NamedList.findOne({
				where: { id: namedListId },
			})

			if (namedListQueried) {
				await updateOrCreate({
					model: ObjectNamedListMappingTable,
					where: { namedListId, objectId },
					newItem: { namedListId, objectId },
				})
			}

			response.status(200).json('OK')
		} catch (e) {
			console.log('addObject error: ', e)
		}
	},
	removeObject: async (request, response) => {
		const { namedListId, objectId } = request.body
		try {
			await ObjectNamedListMappingTable.destroy({
				where: { namedListId, objectId },
			})

			response.status(200).json('OK')
		} catch (e) {
			console.log('addObject error: ', e)
		}
	},
}
