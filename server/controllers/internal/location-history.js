import 'dotenv/config'
import dbQueries from '../../db/locationHistoryQueries'
import pool from '../../db/connection'
import common from '../../helpers/common'

export default {
	getLocationHistory: async (request, response) => {
		const { key, startTime, endTime, mode } = request.body
		const res = await pool.query(
			dbQueries.getLocationHistory(key, startTime, endTime, mode)
		)
		const locale = request.body.locale.abbr || 'en'
		console.log(locale)
		if (res) {
			res.rows.map((item) => {
				if (item.duration) {
					item.residenceTime = common
						.moment(item.end_time)
						.locale(locale)
						.from(common.moment(item.start_time))
				}
				return item
			})
			console.log(`get Location history by ${mode} succeed`)
			response.status(200).json(res)
			return
		}
		console.log(`get location history by ${mode} failed : ${err}`)
		// pool
		// 	.query(dbQueries.getLocationHistory(key, startTime, endTime, mode))
		// 	.then((res) => {
		// 		console.log(`get location history by ${mode} succeed`)
		// 		response.status(200).json(res)
		// 	})
		// 	.catch((err) => {
		// 		console.log(`get location history by ${mode} failed ${err}`)
		// 	})
	},

	getContactTree: (request, response) => {
		const { child, parents, startTime, endTime } = request.body
		pool
			.query(dbQueries.getContactTree(child, parents, startTime, endTime))
			.then((res) => {
				console.log('get contact tree succeed')
				response.status(200).json(res)
			})
			.catch((err) => {
				console.log(`get contact tree failed ${err}`)
			})
	},

	getTracePathByObjectId: async (request, response) => {
		const { pathObjectAcns, startTime, endTime } = request.body
		try {
			console.log(pathObjectAcns)
			const res = await pool.query(
				dbQueries.getTracePathByObjectId(pathObjectAcns, startTime, endTime)
			)
			console.log('get trace path by object id succeed.')
			response.status(200).json(res)
		} catch (e) {
			console.log(`get trace path by object id failed : ${e}`)
		}
	},
}
