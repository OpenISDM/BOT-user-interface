import queries from '../../db/externalQueries'
import pool from '../../db/connection'
import common from './common'

async function getPeopleHistoryData(request, response) {
	const {
		key,
		area_ids,
		object_ids,
		object_types,
		sort_type = 'desc',
	} = request.body
	let { start_time, end_time, count_limit = 10 } = request.body

	start_time = common.setInitialTime(start_time, 1)
	end_time = common.setInitialTime(end_time, 0)
	if (count_limit > 50000) count_limit = 50000

	const filter = await common.setFilter(key, object_ids, object_types, area_ids)

	try {
		const data = await pool.query(
			queries.getPeopleHistoryQuery(
				filter,
				start_time,
				end_time,
				count_limit,
				sort_type
			)
		)
		console.log('get people history successed.')
		data.rows.forEach((item) => {
			item.floor = common.getFloor(item.lbeacon_uuid)
		})
		response.json(common.checkIsNullResponse(data.rows))
	} catch (err) {
		console.log(`get people history data failed : ${err}`)
	}
}

async function getObjectHistoryData(request, response) {
	const {
		key,
		object_types,
		object_ids,
		area_ids,
		sort_type = 'desc',
	} = request.body
	let { start_time, end_time, count_limit = 10 } = request.body

	start_time = common.setInitialTime(start_time, 1)
	end_time = common.setInitialTime(end_time, 0)
	if (count_limit > 50000) count_limit = 50000

	const filter = await common.setFilter(key, object_ids, object_types, area_ids)
	try {
		const data = await pool.query(
			queries.getObjectHistoryQuery(
				filter,
				start_time,
				end_time,
				count_limit,
				sort_type
			)
		)
		console.log('get device data success')
		data.rows.forEach((item) => {
			item.floor = common.getFloor(item.lbeacon_uuid)
		})
		response.json(common.checkIsNullResponse(data.rows))
	} catch (err) {
		console.log(`get object history data failed : ${err}`)
	}
}

export default {
	getObjectHistoryData,
	getPeopleHistoryData,
}
