import 'dotenv/config'
import _ from 'lodash'
import { Op, sequelize } from '../../db/connection'
import {
	NotificationTable,
	ObjectSummaryTable,
	ObjectTable,
	AreaTable,
	VitalSignSummaryTable,
} from '../../db/models'
import { ipc } from '../../helpers'

export default {
	getAllNotifications: async (request, response) => {
		const { areaId = [] } = request.query
		try {
			const objectTablePromise = ObjectTable.findAll({
				include: [
					{
						model: ObjectSummaryTable,
						as: 'extend',
						required: false, // left join
					},
					{
						model: VitalSignSummaryTable,
						as: 'vital_sign',
						required: false, // left join
					},
				],
				nest: true,
				raw: true,
			})

			const notificationTablePromise = NotificationTable.findAll({
				attributes: [
					sequelize.literal('DISTINCT ON("mac_address", "monitor_type") *'),
				],
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
				order: [
					['mac_address', 'desc'],
					['monitor_type', 'desc'],
					['violation_timestamp', 'desc'],
				],
				raw: true,
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

			const lowBatteryList = objectTableQueried
				.filter((object) => {
					const batteryVoltage = object.extend.battery_voltage
					return (
						batteryVoltage > 0 &&
						batteryVoltage <= parseInt(process.env.BATTERY_VOLTAGE_INDICATOR)
					)
				})
				.map((object) => {
					object.areaName = areaTableMap[object.area_id].readable_name
					object.lbeacon_area = {
						id: object.area_id,
						value: object.areaName,
					}
					return object
				})

			const notificaitonList = notificationTableQueried
				.map((notification) => {
					const macAddress = notification.mac_address

					// filter only registered object
					const object = objectTableMap[macAddress]
					if (object) {
						notification.areaName =
							areaTableMap[notification.area_id].readable_name // triggered area name
						notification.objectName = object.name
						notification.objectId = object.id
						notification.object_type = object.object_type

						if (
							object.vital_sign &&
							object.vital_sign.last_reported_timestamp
						) {
							notification.violation_timestamp =
								object.vital_sign.last_reported_timestamp
						}

						return notification
					}
					return null
				})
				.filter((item) => item)

			response.status(200).json({
				notificaitonList,
				lowBatteryList,
			})
		} catch (e) {
			console.log(e)
		}
	},

	turnOffNotification: async (request, response) => {
		const { notificationId, macAddress, monitorType } = request.body
		try {
			const res = await NotificationTable.update(
				{
					web_processed: 1, // Set 1 meaning the user manully turn of notification
				},
				{
					where: {
						mac_address: macAddress,
						monitor_type: monitorType,
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
