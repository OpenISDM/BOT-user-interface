/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        namedListController.js

    File Description:
        BOT UI component

    Version:
        1.0, 20200601

    Abstract:
        BeDIS uses LBeacons to deliver 3D coordinates and textual descriptions of
        their locations to users' devices. Basically, a LBeacon is an inexpensive,
        Bluetooth device. The 3D coordinates and location description of every
        LBeacon are retrieved from BeDIS (Building/environment Data and Information
        System) and stored locally during deployment and maintenance times. Once
        initialized, each LBeacon broadcasts its coordinates and location
        description to Bluetooth enabled user devices within its coverage area. It
        also scans Bluetooth low-energy devices that advertise to announced their
        presence and collect their Mac addresses.

    Authors:
        Tony Yeh, LT1stSoloMID@gmail.com
        Wayne Kang, b05505028@ntu.edu.tw
        Edward Chen, r08921a28@ntu.edu.tw
        Joe Chou, jjoe100892@gmail.com
*/

import 'dotenv/config'
import { updateOrCreate } from '../../db/connection'
import { NamedList, ObjectNamedListMappingTable } from '../../db/models'

export default {
	getNamedList: async (request, response) => {
		const { areaId, types, isUserDefined } = request.query
		try {
			const res = await NamedList.findAll({
				where: { areaId, type: types, isUserDefined },
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
