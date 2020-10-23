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
import dbQueries from '../db/deviceGroupListQueries'
import pool from '../db/connection'
import DeviceGroupList from '../db/model/deviceGroupList'
import ObjectTable from '../db/model/objectTable'

export default {
	getDeviceGroupList: async (request, response) => {
		const { groupId } = request.body
		try {
			let res
			if (groupId) {
				res = await DeviceGroupList.findByPk(groupId)
			} else {
				res = await DeviceGroupList.findAll()
			}
			response.status(200).json(res)
		} catch (e) {
			console.log('getDeviceGroupList error: ', e)
		}
	},
	addDeviceGroupList: (request, response) => {
		const { name, areaId } = request.body
		const query = dbQueries.addDeviceGroup(name, areaId)

		pool
			.query(query)
			.then((res) => {
				console.log('add device list succeed')
				response.status(200).json(res.rows[0].id)
			})
			.catch((err) => {
				console.log(`add device list failed ${err}`)
			})
	},
	modifyDeviceGroupList: (request, response) => {
		const { groupId, mode, newName, itemId } = request.body

		let query = null
		if (mode == 0) {
			query = dbQueries.modifyDeviceGroup({ groupId, mode, itemId })
		} else if (mode == 1) {
			query = dbQueries.modifyDeviceGroup({ groupId, mode, itemId })
		} else if (mode == 2) {
			query = dbQueries.modifyDeviceGroup({ groupId, mode, newName })
		}

		pool
			.query(query)
			.then((res) => {
				response.status(200).json('ok')
			})
			.catch((err) => {
				console.log(`modify device list failed ${err}`)
			})
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
}
