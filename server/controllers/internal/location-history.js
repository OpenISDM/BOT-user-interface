import 'dotenv/config'
import dbQueries from '../../db/locationHistoryQueries'
import pool from '../../db/connection'

export default {
	getLocationHistory: (request, response) => {
		const { key, startTime, endTime, mode } = request.body
		pool
			.query(dbQueries.getLocationHistory(key, startTime, endTime, mode))
			.then((res) => {
				console.log(`get location history by ${mode} succeed`)
				response.status(200).json(res)
			})
			.catch((err) => {
				console.log(`get location history by ${mode} failed ${err}`)
			})
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
}
