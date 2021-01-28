import error_code from './codes'
import moment from 'moment-timezone'
import queryType from './queryType'
import pool from '../../db/connection'

const timeDefaultFormat = 'YYYY/MM/DD HH:mm:ss'
import { encrypt } from '../../helpers'

//#region api v1.0
async function getTracingHisotry(request, response) {
	const { key, sort_type = 'desc' } = request.body
	let {
		tag, // string
		Lbeacon, // string
		start_time, // YYYY/MM/DD HH:mm:ss
		end_time, // YYYY/MM/DD HH:mm:ss
		count_limit = 10, //
	} = request.body

	// to initial data.
	Lbeacon = splitInputData(Lbeacon)
	tag = splitInputData(tag)
	start_time = setInitialTime(start_time, 1, timeDefaultFormat)
	end_time = setInitialTime(end_time, 0, timeDefaultFormat)
	if (count_limit > 50000) count_limit = 500000

	const data = await getDurationData(
		key,
		start_time,
		end_time,
		tag,
		Lbeacon,
		count_limit,
		sort_type
	)

	data.forEach((item) => {
		item.start_time = moment(item.start_time).format(timeDefaultFormat)
		item.end_time = moment(item.end_time).format(timeDefaultFormat)
	})

	response.json(data)
}

function splitInputData(data) {
	if (data) return data.split(',')
	return null
}

//function setUUIDData(Lbeacon)
async function getDurationData(
	key,
	start_time,
	end_time,
	tag,
	Lbeacon,
	count_limit,
	sort_type
) {
	return await pool
		.query(
			queryType.get_data(
				key,
				start_time,
				end_time,
				tag,
				Lbeacon,
				count_limit,
				sort_type
			)
		) //get area id
		.then((res) => {
			console.log('get_data success')
			res.rows.forEach((item) => {
				item.duration.hours = setDurationTime(item.duration.hours)
				item.duration.minutes = setDurationTime(item.duration.minutes)
				item.duration.seconds = setDurationTime(item.duration.seconds)
				item.duration.milliseconds = setDurationTime(item.duration.milliseconds)
			})
			return res.rows
		})
		.catch((err) => {
			console.log(`get_data fails ${err}`)
		})
}
function setDurationTime(time) {
	if (time === undefined) {
		return 0
	}
	return time
}

//#endregion

//#region api v1.1

//#region Enum
const ObjectTypeQuery = {
	DEVICE: 0,
	PEOPLE: 1,
}
//#endregion

//#region Get value method
async function getIDTableData(request, response) {
	const { key, area_ids } = request.body

	try {
		const validArea = await compareUserArea(key, area_ids)

		const ObjectTablePromise = pool.query(queryType.getIDTableQuery(validArea))
		const AreaTablePromise = pool.query(queryType.getAreaIDQuery(key))
		const ObjectTypePromise = pool.query(
			queryType.getObjectTypeQuery(ObjectTypeQuery.DEVICE)
		)
		const PeopleTypePromise = pool.query(
			queryType.getObjectTypeQuery(ObjectTypeQuery.PEOPLE)
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
		response.json(checkIsNullResponse(data))
	} catch (err) {
		console.log(`get id table data error : ${err}`)
	}
}

async function getPeopleRealtimeData(request, response) {
	const { key, object_ids, object_types, area_ids } = request.body

	try {
		const filter = await setFilter(key, object_ids, object_types, area_ids)
		const data = await pool.query(queryType.getPeopleRealtimeQuery(filter))

		console.log('get realtime data successful')
		response.json(checkIsNullResponse(data.rows))
	} catch (err) {
		console.log(`get realtime data failed : ${err}`)
	}
}

async function getPeopleHistoryData(request, response) {
	const {
		key,
		area_ids,
		object_ids,
		object_types,
		sort_type = 'desc',
	} = request.body
	let { start_time, end_time, count_limit = 10 } = request.body

	start_time = setInitialTime(start_time, 1)
	end_time = setInitialTime(end_time, 0)
	if (count_limit > 50000) count_limit = 50000

	const filter = await setFilter(key, object_ids, object_types, area_ids)

	try {
		const data = await pool.query(
			queryType.getPeopleHistoryQuery(
				filter,
				start_time,
				end_time,
				count_limit,
				sort_type
			)
		)
		console.log('get people history successed.')

		response.json(checkIsNullResponse(data.rows))
	} catch (err) {
		console.log(`get people history data failed : ${err}`)
	}
}

async function getObjectRealtimeData(request, response) {
	const { key, object_ids, object_types, area_ids } = request.body

	try {
		const filter = await setFilter(key, object_ids, object_types, area_ids)
		const data = await pool.query(queryType.getObjectRealtimeQuery(filter))

		response.json(checkIsNullResponse(data.rows))
	} catch (err) {
		console.log(`get realtime data failed : ${err}`)
	}
}

async function getApiKey(request, response) {
	const { username, password } = request.body

	let user = null
	const allUser = await pool.query(queryType.getAllUserQuery).catch((err) => {
		console.log(`get all username fail : ${err}`)
	})

	allUser.rows.every((item) => {
		if (username === item.name && password === item.password) {
			user = item
			return false
		}
		return true
	})

	if (user) {
		const hashToken = encrypt.createHash(password)

		await pool
			.query(queryType.setKey(user.id, user.name, hashToken))
			.catch((err) => {
				console.log(`update data error : ${err}`)
			})
		response.json(
			error_code.getKeySuccess(hashToken, moment().add(30, 'm').format())
		)
	} else {
		response.json(error_code.accountIncorrect)
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

	start_time = setInitialTime(start_time, 1)
	end_time = setInitialTime(end_time, 0)
	if (count_limit > 50000) count_limit = 50000

	const filter = await setFilter(key, object_ids, object_types, area_ids)
	try {
		const data = await pool.query(
			queryType.getObjectHistoryQuery(
				filter,
				start_time,
				end_time,
				count_limit,
				sort_type
			)
		)
		response.json(checkIsNullResponse(data.rows))
	} catch (err) {
		console.log(`get object history data failed : ${err}`)
	}
}
//#endregion

//#region Set values or check value methods
async function compareUserArea(key, area_id) {
	const user_area = await getUserArea(key)

	if (area_id) {
		const validArea = area_id.filter(
			(item) => user_area.includes(item) || user_area.includes(item.toString())
		)
		return validArea
	}
	return user_area
}

function checkIsNullResponse(rows) {
	if (
		rows.length > 0 ||
		(Object.keys(rows).length > 0 && rows.constructor === Object)
	) {
		return error_code.getValueSuccess(rows)
	}
	return error_code.getNullValue(rows)
}

async function getUserArea(key) {
	const userArea = await pool.query(queryType.getUserAreaQuery(key))
	const data = userArea.rows.map((item) => {
		return item.area_id
	})
	return data
}

function setInitialTime(time, diff, format = null) {
	if (time === undefined) {
		return moment(moment().subtract(diff, 'day')).format()
	}
	return moment(time, format).format()
}

async function setFilter(key, object_ids, object_types, area_ids) {
	let filter = ''
	const user_area = await getUserArea(key)

	filter += queryType.getObjectTypeFilter(object_types)
	filter += queryType.getAreaIDFilter(user_area, area_ids)
	filter += queryType.getObjectIDFilter(object_ids)
	return filter
}
//#endregion

//#endregion
export default {
	//#region api v1.0
	getTracingHisotry,
	//#endregion

	//#region api v1.1
	getApiKey,
	getPeopleHistoryData,
	getPeopleRealtimeData,
	getObjectHistoryData,
	getObjectRealtimeData,
	getIDTableData,
	getUserArea,
	//#endregion
}
