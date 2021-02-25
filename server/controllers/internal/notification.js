import 'dotenv/config'
import _ from 'lodash'
import { Op } from '../../db/connection'
import {
	NotificationTable,
	ObjectSummaryTable,
	ObjectTable,
	AreaTable,
	LBeaconTable,
	VitalSignSummaryTable,
} from '../../db/models'
import { common, ipc } from '../../helpers'

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
						as: 'vitalSign',
						required: false, // left join
					},
				],
				nest: true,
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
			const lbeaconTablePromise = LBeaconTable.findAll({ raw: true })

			const [
				objectTableQueried,
				notificationTableQueried,
				areaTable,
				lbeaconTable,
			] = await Promise.all([
				objectTablePromise,
				notificationTablePromise,
				areaTablePromise,
				lbeaconTablePromise,
			])

			const objectTableMap = _.keyBy(objectTableQueried, 'mac_address')
			const areaTableMap = _.keyBy(areaTable, 'id')
			const lbeaconTableMap = _.keyBy(lbeaconTable, 'uuid')

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
				.map((notificaiton) => {
					const macAddress = notificaiton.mac_address

					// filter only registered object
					if (objectTableMap[macAddress]) {
						const object = common.deepClone(objectTableMap[macAddress])
						object.area_id = notificaiton.area_id // triggered area id
						object.areaName = areaTableMap[object.area_id].readable_name
						object.found = true
						object.lbeacon_coordinate = object.extend.uuid
							? common.parseLbeaconCoordinate(object.extend.uuid)
							: null

						object.currentPosition = object.extend.uuid
							? common.calculatePosition({
									lbeaconUuid: object.extend.uuid,
									baseX: object.extend.base_x,
									baseY: object.extend.base_y,
							  })
							: null

						object.residence_time = common
							.moment(object.extend.last_seen_timestamp)
							.locale('tw')
							.fromNow()

						object.lbeacon_area = { id: object.area_id, value: object.areaName }

						object.location_description =
							lbeaconTableMap[object.extend.uuid] &&
							lbeaconTableMap[object.extend.uuid].description

						object.updated_by_area = object.extend.updated_by_area
						return {
							object,
							notificaiton,
						}
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
