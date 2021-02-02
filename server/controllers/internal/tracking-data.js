import 'dotenv/config'
import moment from 'moment-timezone'
import dbQueries from '../../db/trackingDataQueries'
import pool from '../../db/connection'
import {
	MOMENT_LOCALE_RELATIVE_TIME_FORMAT_EN,
	MOMENT_LOCALE_RELATIVE_TIME_FORMAT_TW,
} from '../../config/config'
import common from '../../helpers/common'

moment.updateLocale('en', {
	relativeTime: MOMENT_LOCALE_RELATIVE_TIME_FORMAT_EN,
})

moment.updateLocale('zh-tw', {
	relativeTime: MOMENT_LOCALE_RELATIVE_TIME_FORMAT_TW,
})

export default {
	getTrackingData: (request, response) => {
		const locale = request.body.locale || 'en'
		const { areaIds } = request.body

		if (!areaIds) {
			response.status(200).json([])
			return
		}

		pool
			.query(dbQueries.getTrackingData(areaIds))
			.then((res) => {
				console.log('get tracking data')

				/** Filter the objects that do no belong the area */
				const toReturn = res.rows.map((item) => {
					/** Parse lbeacon uuid into three field in an array: area id, latitude, longtitude */
					const lbeacon_coordinate = item.lbeacon_uuid
						? common.parseLbeaconCoordinate(item.lbeacon_uuid)
						: null

					item.lbeacon_coordinate = lbeacon_coordinate

					item.currentPosition = item.lbeacon_uuid
						? common.calculatePosition(item)
						: null

					/** Set the boolean if the object's last_seen_timestamp is in the specific time period */
					const isInTheTimePeriod =
						moment().diff(item.last_reported_timestamp, 'seconds') <
						process.env.OBJECT_FOUND_TIME_INTERVAL_IN_SEC

					/** Set the boolean if its rssi is below the specific rssi threshold  */
					const isMatchRssi = item.rssi > process.env.RSSI_THRESHOLD ? 1 : 0

					/** Flag the object that satisfied the time period and rssi threshold */
					item.found = isInTheTimePeriod && isMatchRssi

					/** Set the residence time of the object */
					item.residence_time = item.found
						? moment(item.last_seen_timestamp)
								.locale(locale)
								.from(moment(item.first_seen_timestamp))
						: item.last_reported_timestamp
						? moment(item.last_reported_timestamp).locale(locale).fromNow()
						: ''

					/** Flag the object's battery volumn is limiting */
					if (
						item.battery_voltage >
						parseInt(process.env.BATTERY_VOLTAGE_INDICATOR)
					) {
						item.battery_indicator = 3
					} else if (
						item.battery_voltage <=
							parseInt(process.env.BATTERY_VOLTAGE_INDICATOR) &&
						item.battery_voltage > 16
					) {
						item.battery_indicator = 2
					} else if (item.battery_voltage <= 16) {
						item.battery_indicator = 1
					}

					// I forget why should do this line
					// return Object.fromEntries(new Map(Object.entries(item)))
					return item
				})
				response.status(200).json(toReturn)
			})
			.catch((err) => {
				console.log(`get tracking data failed ${err}`)
			})
	},
}
