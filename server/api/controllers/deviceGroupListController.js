/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        objectController.js

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
import _ from 'lodash'
import { sequelize } from '../db/connection'
import DeviceGroupList from '../db/model/deviceGroupList'
import ObjectTable from '../db/model/objectTable'

export default {
	getDeviceGroupList: async (request, response) => {
		try {
			const res = await DeviceGroupList.findAll()
			response.status(200).json(res)
		} catch (e) {
			console.log('getDeviceGroupList error: ', e)
		}
	},
	addDeviceGroupList: async (request, response) => {
		const { name, areaId } = request.body
		try {
			const res = await DeviceGroupList.create({ name, area_id: areaId })
			response.status(200).json(res)
		} catch (e) {
			console.log(`add device group list failed ${e}`)
		}
	},
	modifyDeviceGroupList: async (request, response) => {
		const { groupId, mode, newName, itemId } = request.body
		try {
			const modeIntType = parseInt(mode)
			if (modeIntType === 0) {
				await DeviceGroupList.update(
					{
						items: sequelize.fn('array_append', sequelize.col('items'), itemId),
					},
					{ where: { id: groupId } }
				)
				await ObjectTable.update(
					{ list_id: groupId },
					{
						where: {
							id: itemId,
						},
					}
				)
			} else if (modeIntType === 1) {
				await DeviceGroupList.update(
					{
						items: sequelize.fn('array_remove', sequelize.col('items'), itemId),
					},
					{ where: { id: groupId } }
				)
				await ObjectTable.update(
					{ list_id: null },
					{
						where: {
							id: itemId,
						},
					}
				)
			} else if (modeIntType === 2) {
				// not used for now
				await DeviceGroupList.update(
					{
						name: newName,
					},
					{ where: { id: groupId } }
				)
			}

			response.status(200).json('ok')
		} catch (err) {
			console.log(`modify device list failed ${err}`)
		}
	},
	deleteDeviceGroup: async (request, response) => {
		const { groupId } = request.body
		const { items = [] } = await DeviceGroupList.findByPk(groupId)

		if (items) {
			await ObjectTable.update(
				{ list_id: null },
				{
					where: {
						id: items,
					},
				}
			)
		}

		await DeviceGroupList.destroy({
			where: {
				id: groupId,
			},
		})

		response.status(200).json('ok')
	},
	getDetailByAreaId: async (request, response) => {
		const { areaId } = request.query
		try {
			const gruopList = await DeviceGroupList.findAll({
				where: { area_id: areaId },
			})
			let objectIds = []
			gruopList.forEach(({ items }) => {
				if (items) {
					objectIds = [...objectIds, ...items]
				}
			})
			const objectList = await ObjectTable.findAll({
				where: { id: objectIds },
			})
			response.status(200).json({ gruopList, objectList })
		} catch (e) {
			console.log('get devices group details error: ', e)
		}
	},
}
