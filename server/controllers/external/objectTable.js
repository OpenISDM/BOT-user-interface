import queries from '../../db/externalQueries'
import pool from '../../db/connection'
import common from './common'
const ObjectTypeQuery = {
	DEVICE: 0,
	PEOPLE: 1,
}

async function getIDTableData(request, response) {
	const { key, area_ids } = request.body

	try {
		const validArea = await common.compareUserArea(key, area_ids)

		const ObjectTablePromise = pool.query(queries.getIDTableQuery(validArea))
		const AreaTablePromise = pool.query(queries.getAreaIDQuery(key))
		const ObjectTypePromise = pool.query(
			queries.getObjectTypeQuery(ObjectTypeQuery.DEVICE)
		)
		const PeopleTypePromise = pool.query(
			queries.getObjectTypeQuery(ObjectTypeQuery.PEOPLE)
		)

		const [
			ObjectTableRes,
			AreaTableRes,
			ObjectTypeRes,
			PeopleTypeRes,
		] = await Promise.all([
			ObjectTablePromise,
			AreaTablePromise,
			ObjectTypePromise,
			PeopleTypePromise,
		])

		const data = {
			area_table: AreaTableRes.rows,
			object_types: {
				people_type: PeopleTypeRes.rows.map((item) => {
					return item.object_type
				}),
				device_type: ObjectTypeRes.rows.map((item) => {
					return item.object_type
				}),
			},
			object_table: ObjectTableRes.rows,
		}
		response.json(common.checkIsNullResponse(data))
	} catch (err) {
		console.log(`get id table data error : ${err}`)
	}
}

export default {
	getIDTableData,
}
