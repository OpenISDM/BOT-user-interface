import 'dotenv/config'
import _ from 'lodash'
import { Op } from '../../db/connection'
import {
	NotificationTable,
	ObjectSummaryTable,
	ObjectTable,
	AreaTable,
} from '../../db/models'
import { common, ipc } from '../../helpers'

const NOTIFICATION_ENUM = {
	LOW_BATTERY: 'LOW_BATTERY',
	EMERGENCY: 'EMERGENCY',
	GEO_FENCE: 'GEO_FENCE',
}

const MONITOR_TYPE = {
	NORMAL: 0,
	GEO_FENCE: 1,
	EMERGENCY: 2,
	ACTIVITY: 4,
	LOCATION: 8,
	BED_CLEARNESS: 16,
}

export default {
	getAllNotifications: async (request, response) => {
		const { areaId } = request.query
		try {
			const objectTablePromise = ObjectTable.findAll({
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
					web_processed: {
						[Op.eq]: null,
					},
					violation_timestamp: {
						[Op.gt]: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours
					},
					[Op.or]: [
						{
							area_id: areaId,
						},
						{
							owner_area_id: areaId,
						},
					],
				},
				order: [['id', 'DESC']],
			})

			const areaTablePromise = AreaTable.findAll({ raw: true })

			const [
				objectTableQueried,
				notificationTableQueried,
				areaTable,
			] = await Promise.all([
				objectTablePromise,
				notificationTablePromise,
				areaTablePromise,
			])

			const objectTableMap = _.keyBy(objectTableQueried, 'mac_address')
			const areaTableMap = _.keyBy(areaTable, 'id')

			const lowBattery = objectTableQueried
				.filter((object) => {
					const batteryVoltage = object['extend.battery_voltage']
					return (
						batteryVoltage > 0 &&
						batteryVoltage <= parseInt(process.env.BATTERY_VOLTAGE_INDICATOR)
					)
				})
				.map((object) => {
					object.areaName = areaTableMap[object.area_id].readable_name
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
							expectedDecimal: MONITOR_TYPE.EMERGENCY,
						})
					) {
						type = NOTIFICATION_ENUM.EMERGENCY
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
						const object = objectTableMap[macAddress]
						object.areaName = areaTableMap[object.area_id].readable_name
						return {
							type,
							object,
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
