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
import { sequelize } from '../db/connection'
import PatientGroupList from '../db/model/patientGroupList'
import ObjectTable from '../db/model/objectTable'

export default {
	getPatientGroupList: async (request, response) => {
		try {
			const res = await PatientGroupList.findAll()
			response.status(200).json(res)
		} catch (e) {
			console.log('getPatientGroupList error: ', e)
		}
	},
	addPatientGroupList: async (request, response) => {
		const { name, areaId } = request.body
		try {
			const res = await PatientGroupList.create({ name, area_id: areaId })
			response.status(200).json(res)
		} catch (e) {
			console.log(`add device group list failed ${e}`)
		}
	},
	modifyPatientGroupList: async (request, response) => {
		const { groupId, mode, newName, itemId } = request.body
		try {
			const modeIntType = parseInt(mode)
			if (modeIntType === 0) {
				await PatientGroupList.update(
					{
						patients: sequelize.fn(
							'array_append',
							sequelize.col('patients'),
							itemId
						),
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
				await PatientGroupList.update(
					{
						patients: sequelize.fn(
							'array_remove',
							sequelize.col('patients'),
							itemId
						),
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
				await PatientGroupList.update(
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
	deletePatientGroup: async (request, response) => {
		const { groupId } = request.body
		const { patients = [] } = await PatientGroupList.findByPk(groupId)

		if (patients) {
			await ObjectTable.update(
				{ list_id: null },
				{
					where: {
						id: patients,
					},
				}
			)
		}

		await PatientGroupList.destroy({
			where: {
				id: groupId,
			},
		})

		response.status(200).json('ok')
	},
	getDetailByAreaId: async (request, response) => {
		const { areaId } = request.query
		try {
			const gruopList = await PatientGroupList.findAll({
				where: { area_id: areaId },
				attributes: [
					'id',
					'name',
					'patients', // Add this column to correctly do Object Destructuring
					['patients', 'items'],
					'area_id',
				],
			})
			let objectIds = []
			gruopList.forEach(({ patients }) => {
				if (patients) {
					objectIds = [...objectIds, ...patients]
				}
			})
			const objectList = await ObjectTable.findAll({
				where: { id: objectIds },
			})
			response.status(200).json({ gruopList, objectList })
		} catch (e) {
			console.log('get patients group details error: ', e)
		}
	},
}
