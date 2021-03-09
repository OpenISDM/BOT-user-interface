import 'dotenv/config'
import dbQueries from '../../db/trackingDataQueries'
import pool from '../../db/connection'
import common from '../../helpers/common'

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
					item.lbeacon_coordinate = item.lbeacon_uuid
						? common.parseLbeaconCoordinate(item.lbeacon_uuid)
						: null

					item.currentPosition = item.lbeacon_uuid
						? common.calculatePosition({
								lbeaconUuid: item.lbeacon_uuid,
								baseX: item.base_x,
								baseY: item.base_y,
						  })
						: null

					/** Set the boolean if the object's last_seen_timestamp is in the specific time period */
					const isInTheTimePeriod =
						common.moment().diff(item.last_reported_timestamp, 'seconds') <
						process.env.OBJECT_FOUND_TIME_INTERVAL_IN_SEC

					/** Set the boolean if its rssi is below the specific rssi threshold  */
					const isMatchRssi = item.rssi > process.env.RSSI_THRESHOLD

					/** Flag the object that satisfied the time period and rssi threshold */
					item.found = isInTheTimePeriod && isMatchRssi

					/** Set the residence time of the object */
					item.residence_time = item.found
						? common
								.moment(item.last_seen_timestamp)
								.locale(locale)
								.from(common.moment(item.first_seen_timestamp))
						: item.last_reported_timestamp
						? common
								.moment(item.last_reported_timestamp)
								.locale(locale)
								.fromNow()
						: ''

					return item
				})

				response.status(200).json(toReturn)
			})
			.catch((err) => {
				console.log(`get tracking data failed ${err}`)
			})
	},
}
