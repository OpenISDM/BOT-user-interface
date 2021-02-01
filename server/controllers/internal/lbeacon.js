import 'dotenv/config'
import moment from 'moment-timezone'
import dbQueries from '../../db/lbeaconQueries'
import pool from '../../db/connection'

const LBEACON_STATUS_NOT_AVAILABLE = 9999

export default {
	getAllLbeacon: async (request, response) => {
		const isLbeaconHealthStatusCode = parseInt(
			process.env.IS_LBEACON_HEALTH_STATUS_CODE
		)
		const isLbeaconStatusNotAvailable = parseInt(LBEACON_STATUS_NOT_AVAILABLE)
		const isLbeaconHealthTimeIntervalInMin = parseInt(
			process.env.LBEACON_HEALTH_TIME_INTERVAL_IN_MIN
		)

		try {
			const res = await pool.query(dbQueries.getLbeaconTable)
			console.log('get lbeacon table data succeed')
			res.rows.forEach((item) => {
				item.isInHealthInterval =
					(parseInt(item.health_status) === isLbeaconHealthStatusCode ||
						parseInt(item.health_status) === isLbeaconStatusNotAvailable) &&
					moment().diff(item.last_report_timestamp, 'minutes') <
						isLbeaconHealthTimeIntervalInMin
			})
			response.status(200).json(res)
		} catch (e) {
			console.log(`get lbeacon table failed ${e}`)
		}
	},

	deleteLBeacon: async (request, response) => {
		const { ids } = request.body
		try {
			const res = pool.query(dbQueries.deleteLBeacon(ids))
			console.log('delete LBeacon record succeed')
			response.status(200).json(res)
		} catch (e) {
			console.log(`delete LBeacon failed ${e}`)
		}
	},

	editLbeacon: async (request, response) => {
		const { formOption } = request.body
		try {
			const res = await pool.query(dbQueries.editLbeacon(formOption))
			console.log('edit lbeacon succeed')
			response.status(200).json(res)
		} catch (e) {
			console.log(`edit lbeacon failed ${e}`)
		}
	},
}
