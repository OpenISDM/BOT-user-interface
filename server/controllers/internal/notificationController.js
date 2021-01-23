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
import _ from 'lodash'
import { Op } from '../../db/connection'
import {
	NotificationTable,
	ObjectSummaryTable,
	ObjectTable,
} from '../../db/model'
import { common, ipc } from '../../helper'

const NOTIFICATION_ENUM = {
	LOW_BATTERY: 'LOW_BATTERY',
	PANIC: 'PANIC',
	GEO_FENCE: 'GEO_FENCE',
}

const MONITOR_TYPE = {
	NORMAL: 0,
	GEO_FENCE: 1,
	PANIC: 2,
	ACTIVITY: 4,
	LOCATION: 8,
	BED_CLEARNESS: 16,
}

export default {
	getAllNotifications: async (request, response) => {
		const { areaId } = request.query
		try {
			const objectTablePromise = ObjectTable.findAll({
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

			const notificationTablePromise = NotificationTable.findAll({
				where: {
					area_id: areaId,
					web_processed: {
						[Op.eq]: null,
					},
					violation_timestamp: {
						[Op.gt]: new Date(Date.now() - 30 * 60 * 1000), // 30 mins
					},
				},
				order: [['id', 'DESC']],
			})

			const [objectTableQueried, notificationTableQueried] = await Promise.all([
				objectTablePromise,
				notificationTablePromise,
			])

			const objectTableMap = _.keyBy(objectTableQueried, 'mac_address')

			const lowBattery = objectTableQueried
				.filter((object) => {
					const batteryVoltage = object['extend.battery_voltage']
					return (
						batteryVoltage > 0 &&
						batteryVoltage <= parseInt(process.env.BATTERY_VOLTAGE_INDICATOR)
					)
				})
				.map((object) => {
					return {
						type: NOTIFICATION_ENUM.LOW_BATTERY,
						object,
					}
				})

			const emergency = notificationTableQueried
				.map((notificaiton) => {
					const macAddress = notificaiton.mac_address
					const monitortype = notificaiton.monitor_type
					let type = MONITOR_TYPE.NORMAL
					if (
						common.findExpectedBitValue({
							targetDecimal: monitortype,
							expectedDecimal: MONITOR_TYPE.PANIC,
						})
					) {
						type = NOTIFICATION_ENUM.PANIC
					} else if (
						common.findExpectedBitValue({
							targetDecimal: monitortype,
							expectedDecimal: MONITOR_TYPE.GEO_FENCE,
						})
					) {
						type = NOTIFICATION_ENUM.GEO_FENCE
					}

					// filter only registered object
					if (objectTableMap[macAddress]) {
						return {
							type,
							object: objectTableMap[macAddress],
							notificaiton,
						}
					}
					return null
				})
				.filter((item) => item)

			response.status(200).json({
				emergency,
				lowBattery,
			})
		} catch (e) {
			console.log(e)
		}
	},
	turnOffNotification: async (request, response) => {
		const { notificationId } = request.body
		try {
			const res = await NotificationTable.update(
				{
					web_processed: 1, // Set 1 meaning the user manully turn of notification
				},
				{
					where: {
						id: notificationId,
					},
				}
			)

			ipc.stopLightAlarm({ notificationId })

			response.status(200).json(res)
		} catch (e) {
			console.log(e)
		}
	},
}
