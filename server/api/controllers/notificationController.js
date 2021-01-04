/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        notificationController.js

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
import moment from 'moment-timezone'
import { Op, sequelize } from '../db/connection'
import {
	NotificationTable,
	NotificationConfig,
	ObjectSummaryTable,
	ObjectTable,
} from '../db/model'

const NOTIFICATION_ENUM = {
	LOW_BATTERY: 'LOW_BATTERY',
	SOS: 'SOS',
}

export default {
	getAllNotifications: async (request, response) => {
		const { areaId } = request.query
		try {
			const objectTableQueried = await ObjectTable.findAll({
				where: {
					area_id: areaId,
				},
				include: [
					{
						model: ObjectSummaryTable,
						as: 'extend',
						required: false,
					},
				],
				raw: true,
			})

			// const notificationConfigQueried = await NotificationConfig.findOne({
			// 	where: {
			// 		area_id: areaId,
			// 		enable: 1,
			// 		active_alert_types: sequelize.where(
			// 			sequelize.literal('active_alert_types & 1'),
			// 			1
			// 		),
			// 		start_time: {
			// 			[Op.lte]: moment().format('hh:mm:ss'),
			// 		},
			// 		end_time: {
			// 			[Op.gte]: moment().format('hh:mm:ss'),
			// 		},
			// 	},
			// 	raw: true,
			// })

			const lowBatteryData = objectTableQueried
				.filter((object) => {
					const batteryVoltage = object[`extend.battery_voltage`]
					return (
						batteryVoltage > 0 &&
						batteryVoltage <= parseInt(process.env.BATTERY_VOLTAGE_INDICATOR)
					)
				})
				.map((object) => {
					return {
						type: NOTIFICATION_ENUM.LOW_BATTERY,
						item: object,
					}
				})

			const sosData = objectTableQueried
				.filter((object) => {
					const objectType = parseInt(object.object_type)
					const panicTimestamp = object[`extend.panic_violation_timestamp`]
					return (
						objectType !== 0 &&
						moment().diff(panicTimestamp, 'second') <
							process.env.PANIC_TIME_INTERVAL_IN_SEC
					)
				})
				.map((object) => {
					return {
						type: NOTIFICATION_ENUM.SOS,
						item: object,
					}
				})

			//geo
			// {
			// 	type: 'geo'
			// 	item: objectItem
			// }

			// response.status(200).json(notificationConfigQueried)
			response.status(200).json([...lowBatteryData, ...sosData])
		} catch (e) {
			console.log(e)
		}
	},
}
