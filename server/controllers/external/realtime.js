import queries from '../../db/externalQueries'
import pool from '../../db/connection'
import common from './common'
async function getPeopleRealtimeData(request, response) {
	const { key, object_ids, object_types, area_ids } = request.body

	try {
		const filter = await common.setFilter(key, object_ids, object_types, area_ids)
		const data = await pool.query(queries.getPeopleRealtimeQuery(filter))

		data.rows.forEach((item) => {
			item.floor = common.getFloor(item.lbeacon_uuid)
		})

		console.log('get realtime data successful')
		response.json(common.checkIsNullResponse(data.rows))
	} catch (err) {
		console.log(`get realtime data failed : ${err}`)
	}
}

async function getObjectRealtimeData(request, response) {
	const { key, object_ids, object_types, area_ids } = request.body

	try {
		const filter = await common.setFilter(key, object_ids, object_types, area_ids)
		const data = await pool.query(queries.getObjectRealtimeQuery(filter))

		data.rows.forEach((item) => {
			item.floor = common.getFloor(item.lbeacon_uuid)
		})

		response.json(common.checkIsNullResponse(data.rows))
	} catch (err) {
		console.log(`get realtime data failed : ${err}`)
	}
}

export default{
    getObjectRealtimeData,
    getPeopleRealtimeData
}