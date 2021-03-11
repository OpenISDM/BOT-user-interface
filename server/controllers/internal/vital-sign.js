import 'dotenv/config'
import { Op, updateOrCreate } from '../../db/connection'
import {
	VitalSignConfig,
	NotificationConfig,
	MonitorTypeEnum,
} from '../../db/models'

export default {
	getConfig: async (request, response) => {
		const { areaId } = request.query
		try {
			const vitalSignPromise = VitalSignConfig.findOne({
				where: { area_id: areaId },
			})

			const notificationPromise = NotificationConfig.findOne({
				where: {
					area_id: areaId,
					monitor_type: MonitorTypeEnum.VITAL_SIGN,
					name: { [Op.ne]: null },
				},
			})

			const [vitalSignConfig, notificationConfig] = await Promise.all([
				vitalSignPromise,
				notificationPromise,
			])

			const { condition_json = null, condition = '' } = vitalSignConfig || {}
			const res = {
				areaId,
				jsonLogic: condition_json,
				statement: condition,
				notificationConfig,
			}

			console.log('get vital sign config succeed')
			response.status(200).json(res)
		} catch (e) {
			console.log(`get vital sign config  failed ${e}`)
		}
	},

	setConfig: async (request, response) => {
		const { jsonLogic, statement, areaId, config } = request.body
		try {
			const vitalSignPromise = updateOrCreate({
				model: VitalSignConfig,
				where: { area_id: areaId },
				newItem: {
					condition: statement,
					condition_json: jsonLogic,
					area_id: areaId,
				},
			})

			const notificationPromise = updateOrCreate({
				model: NotificationConfig,
				where: {
					area_id: areaId,
					name: config.name,
					monitor_type: MonitorTypeEnum.VITAL_SIGN,
				},
				newItem: {
					area_id: areaId,
					name: config.name,
					alert_last_sec: config.alert_last_sec,
					active_alert_types: config.active_alert_types,
					enable: config.enable,
					start_time: config.start_time,
					end_time: config.end_time,
					monitor_type: MonitorTypeEnum.VITAL_SIGN,
				},
			})

			await Promise.all([vitalSignPromise, notificationPromise])

			console.log('edit vital sign config succeed')
			response.status(200).json('OK')
		} catch (e) {
			console.log(`edit vital sign config failed ${e}`)
		}
	},
}
