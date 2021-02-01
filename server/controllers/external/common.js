import errorCode from './codes'
import queries from '../../db/externalQueries'
import pool from '../../db/connection'
import moment from 'moment-timezone'

function hexToDec(hex) {
	return hex
		.toLowerCase()
		.split('')
		.reduce((result, ch) => result * 16 + '0123456789abcdef'.indexOf(ch), 0)
}

function getFloor(uuid) {
	return hexToDec(uuid.slice(6, 8)) - 20
}

async function compareUserArea(key, area_ids) {
	const user_area = await getUserArea(
		key,
		queries.getAreaCheckFilter(area_ids)
	)
	return user_area
}

function checkIsNullResponse(rows) {
	if (
		rows.length > 0 ||
		(Object.keys(rows).length > 0 && rows.constructor === Object)
	) {
		return errorCode.getDataSuccess(rows)
	}
	return errorCode.getNoData(rows)
}

async function getUserArea(key, filter = '') {
	const userArea = await pool.query(queries.getUserAreaQuery(key, filter))
	const data = userArea.rows.map((item) => {
		return item.area_id
	})
	return data
}

function setInitialTime(time, diff, format = null) {
	if (time) {
		return moment(time, format).format()
	}
	return moment(moment().subtract(diff, 'day')).format()
}

async function setFilter(key, object_ids, object_types, area_ids) {
	let filter = ''
	const user_area = await getUserArea(key)

	filter += queries.getObjectTypeFilter(object_types)
	filter += queries.getAreaIDFilter(user_area, area_ids)
	filter += queries.getObjectIDFilter(object_ids)
	return filter
}

export default {
	setFilter,
	setInitialTime,
	checkIsNullResponse,
	compareUserArea,
	getFloor,
	getUserArea
}
