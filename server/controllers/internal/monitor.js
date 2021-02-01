import 'dotenv/config'
import dbQueries from '../../db/monitorQueries'
import pool from '../../db/connection'

export default {
	getMonitorConfig: (request, response) => {
		const { type } = request.body
		pool
			.query(dbQueries.getMonitorConfig(type))
			.then((res) => {
				console.log(`get ${type} succeed`)
				const toReturn = res.rows.map((item) => {
					item.start_time = item.start_time
						.split(':')
						.filter((item, index) => index < 2)
						.join(':')
					item.end_time = item.end_time
						.split(':')
						.filter((item, index) => index < 2)
						.join(':')
					return item
				})
				response.status(200).json(toReturn)
			})
			.catch((err) => {
				console.log(`get ${type} failed ${err}`)
			})
	},

	deleteMonitorConfig: (request, response) => {
		const { configPackage } = request.body
		pool
			.query(dbQueries.deleteMonitorConfig(configPackage))
			.then((res) => {
				console.log(`delete ${configPackage.type.replace(/_/g, ' ')}`)
				response.status(200).json(res)
			})
			.catch((err) => {
				console.log(`delete monitor config failed ${err}`)
			})
	},

	addMonitorConfig: (request, response) => {
		const { configPackage } = request.body

		pool
			.query(dbQueries.addMonitorConfig(configPackage))
			.then((res) => {
				console.log(`add ${configPackage.type} config success`)
				response.status(200).json(res)
			})
			.catch((err) => {
				console.log(`add monitor config fail ${err}`)
			})
	},

	setMonitorConfig: (request, response) => {
		const { configPackage } = request.body
		pool
			.query(dbQueries.setMonitorConfig(configPackage))
			.then((res) => {
				console.log(`set ${configPackage.type} config success`)
				response.status(200).json(res)
			})
			.catch((err) => {
				console.log(`set ${configPackage.type} config failed ${err}`)
			})
	},
}
