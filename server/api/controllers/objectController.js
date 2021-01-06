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
import dbQueries from '../db/objectQueries'
import recordQueries from '../db/recordQueries'
import pool, { sequelize, Op } from '../db/connection'
import pdf from 'html-pdf'
import path from 'path'
import { reloadGeofenceConfig } from '../service/IPCService'
import { ObjectTable } from '../db/model'

export default {
	getObject: (request, response) => {
		const { areas_id, objectType } = request.query

		pool
			.query(dbQueries.getObject(objectType, areas_id))
			.then((res) => {
				console.log('get object table succeed')
				response.status(200).json(res)
			})
			.catch((err) => {
				console.log(`get object table failed ${err}`)
			})
	},

	addDevice: (request, response) => {
		const { formOption } = request.body

		pool
			.query(dbQueries.addObject(formOption))
			.then((res) => {
				console.log('add device succeed')
				response.status(200).json(res)
			})
			.catch((err) => {
				console.log(`add device failed ${err}`)
			})
	},

	addPerson: (request, response) => {
		const { formOption } = request.body

		pool
			.query(dbQueries.addPerson(formOption))
			.then((res) => {
				console.log('add person succeed')
				response.status(200).json(res)
			})
			.catch((err) => {
				console.log(`add person failed ${err}`)
			})
	},

	editDevice: (request, response) => {
		const { formOption } = request.body
		const { area_id } = formOption

		pool
			.query(dbQueries.editDevice(formOption))
			.then((res) => {
				reloadGeofenceConfig(area_id)
				response.status(200).json(res)
			})
			.catch((err) => {
				console.log(`editDevice failed ${err}`)
			})
	},

	editPerson: (request, response) => {
		const { formOption } = request.body
		const { area_id } = formOption

		pool
			.query(dbQueries.editPersona(formOption))
			.then((res) => {
				reloadGeofenceConfig(area_id)
				response.status(200).json(res)
			})
			.catch((err) => {
				console.log(`editPerson failed ${err}`)
			})
	},

	deleteObject: (request, response) => {
		const { formOption } = request.body

		pool
			.query(dbQueries.deleteObject(formOption))
			.then((res) => {
				console.log('delete object succeed')

				const mac_address_original_arr = formOption
					.filter((item) => item.mac_address)
					.map((item) => item.mac_address)

				if (mac_address_original_arr.length !== 0) {
					pool
						.query(
							dbQueries.deleteObjectSummaryRecord(mac_address_original_arr)
						)
						.then((res) => {
							response.status(200).json(res)
						})
						.catch((err) => {
							console.log(`delete object summary record failed ${err}`)
						})
				} else {
					response.status(200).json(res)
				}
			})
			.catch((err) => {
				console.log(`delete object failed ${err}`)
			})
	},

	disassociate: (request, response) => {
		const { formOption } = request.body

		pool
			.query(dbQueries.disassociate(formOption))
			.then((res) => {
				const mac_address_original_arr = res.rows.map(
					(item) => item.mac_address
				)

				pool
					.query(dbQueries.deleteObjectSummaryRecord(mac_address_original_arr))
					.then((res) => {
						console.log('disassociate succeed')
						response.status(200).json(res)
					})
					.catch((err) => {
						console.log(`delete object summary record failed ${err}`)
					})
			})
			.catch((err) => {
				console.log(`disassociate failed ${err}`)
			})
	},

	editObjectPackage: async (request, response) => {
		const { formOption, username, pdfPackage, reservedTimestamp } = request.body
		try {
			let getPdfFailed = false

			if (pdfPackage) {
				pdf
					.create(pdfPackage.pdf, pdfPackage.options)
					.toFile(
						path.join(process.env.LOCAL_FILE_PATH, pdfPackage.path),
						function (err) {
							if (err) {
								getPdfFailed = true
							}
						}
					)
			}

			const res = await pool.query(
				recordQueries.addEditObjectRecord(formOption, username, pdfPackage.path)
			)
			const record_id = res.rows[0].id
			pool.query(
				dbQueries.editObjectPackage(
					formOption,
					username,
					record_id,
					reservedTimestamp
				)
			)

			if (getPdfFailed) {
				response.status(500).send('Something broke!')
			} else {
				console.log('edit object package succeed')
				response.status(200).json()
			}
		} catch (e) {
			console.log(`edit object package failed ${e}`)
		}
	},

	getIdleMacaddr: (request, response) => {
		pool
			.query(dbQueries.getIdleMacaddr())
			.then((res) => {
				console.log('get idle mac address succeed')
				response.status(200).json(res)
			})
			.catch((err) => {
				console.log(`get idle mac address failed ${err}`)
			})
	},

	getAliases: async (request, response) => {
		const { objectType, areaId } = request.query
		try {
			const alias = await ObjectTable.findAll({
				attributes: [
					[sequelize.fn('DISTINCT', sequelize.col('type')), 'type'],
					'type_alias',
					'object_type',
				],
				where: {
					object_type: objectType,
					area_id: areaId,
				},
				order: [['type', 'ASC']],
			})
			console.log('get object type alias succeed')
			response.status(200).json(alias)
		} catch (e) {
			console.log(`get object type alias failed ${e}`)
		}
	},

	editAlias: async (request, response) => {
		const { objectType, alias, areaId } = request.body
		try {
			const res = ObjectTable.update(
				{ type_alias: alias },
				{
					where: {
						type: objectType,
						area_id: areaId,
					},
				}
			)
			console.log('edit object type alias succeed')

			response.status(200).json(res)
		} catch (e) {
			console.log(`edit object type alias failed ${e}`)
		}
	},

	editAliases: async (request, response) => {
		const { objectTypeList, areaId } = request.body
		try {
			const promises = objectTypeList.map((item) => {
				const { type, type_alias } = item
				return ObjectTable.update(
					{ type_alias },
					{
						where: {
							type,
							area_id: areaId,
						},
					}
				)
			})
			await Promise.all(promises)
			console.log('edit object type alias succeed')
			response.status(200).send('OK')
		} catch (e) {
			console.log(`edit object type alias failed ${e}`)
		}
	},

	editNickname: async (request, response) => {
		const { personList } = request.body
		try {
			const promises = personList.map((item) => {
				const { id, nickname } = item
				return ObjectTable.update(
					{ nickname },
					{
						where: {
							id,
						},
					}
				)
			})
			await Promise.all(promises)
			console.log('edit nickname succeed')
			response.status(200).send('OK')
		} catch (e) {
			console.log(`edit nickname failed ${e}`)
		}
	},
}
