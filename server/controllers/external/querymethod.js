import error_code from './codes'
import moment from 'moment-timezone'
import queryType from './querytype'
import pool from '../../db/connection'

const timeDefaultFormat = 'YYYY/MM/DD HH:mm:ss'
import { encrypt } from '../../helpers'

//#region api v1.0
const getApiKeyV0 = (request, response) => {
	const { username, password } = request.body

	let getUserName = ''
	pool
		.query(queryType.getAllUserQuery) //verification by sha256
		.then((res) => {
			res.rows.map((item) => {
				if (
					username == item.username_sha256 &&
					password == item.password_sha256
				) {
					getUserName = item.name
				}
			})
			if (getUserName != '') {
				//already match user name
				pool
					.query(queryType.confirmValidation(getUserName))
					.then((res) => {
						console.log('confirm validation succeed')

						const hash = encrypt.createHash(password)

						pool
							.query(queryType.setKey(res.rows[0].user_id, getUserName, hash))
							.then((res) => {
								response.json(
									error_code.getKeySuccessV0(
										hash,
										moment().add(30, 'm').locale('en').format('LT')
									)
								)
								console.log('get Key success')
							})
							.catch((err) => {
								console.log(`set Key failer ${err}`)
							})
					})
					.catch((err) => {
						console.log(`confirm validation fails ${err}`)
					})
			} else {
				response.json(error_code.accountIncorrect)
			}
		})
		.catch((err) => {
			console.log(`get user fails ${err}`)
		})
}

async function getTracingHisotry(request, response) {
	let {
		key,
		tag, // string
		Lbeacon, // string
		start_time, // YYYY/MM/DD HH:mm:ss
		end_time, // YYYY/MM/DD HH:mm:ss
		count_limit, //
		sort_type,
	} = request.body
	let matchRes = Promise.resolve(matchKey(key))
	await matchRes.then(function (result) {
		matchRes = result
	})

	if (matchRes == 1) {
		// matched

		//** Time **//

		if (start_time != undefined) {
			// verification by format
			if (moment(start_time, timeDefaultFormat, true).isValid() == false) {
				response.json(error_code.startTimeError)
			} else {
				// if format right then convert to utc
				start_time = time_format(start_time)
			}
		} else {
			// set default WHEN no input
			start_time = moment(moment().subtract(1, 'day')).format()
		}

		if (end_time != undefined) {
			if (moment(end_time, timeDefaultFormat, true).isValid() == false) {
				response.json(error_code.endTimeError)
			} else {
				end_time = time_format(end_time)
			}
		} else {
			end_time = moment(moment()).format()
		}

		//** TAG **//
		if (tag != undefined) {
			tag = tag.split(',')
			const pattern = new RegExp(
				'^[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}$'
			)
			tag.map((item) => {
				if (item.match(pattern) == null) {
					//judge format
					response.json(error_code.macAddressError)
				}
			})
		}

		//** Lbeacon **//
		if (Lbeacon != undefined) {
			Lbeacon = Lbeacon.split(',')
			const pattern = new RegExp(
				'^[0-9A-Fa-f]{8}-?[0-9A-Fa-f]{4}-?[0-9A-Fa-f]{4}-?[0-9A-Fa-f]{4}-?[0-9A-Fa-f]{12}$'
			)
			Lbeacon.map((item) => {
				if (item.match(pattern) == null) {
					//judge format
					response.json(error_code.lbeaconFormatError)
				}
			})
		}

		//set default when no input
		if (count_limit == undefined) {
			count_limit = 10
		} else {
			isNaN(count_limit) ? response.json(error_code.countLimitError) : null
		}

		//0=DESC 1=ASC  : default=0
		if (sort_type == undefined) {
			sort_type = 'desc'
		} else if (sort_type != 'desc' && sort_type != 'asc') {
			response.json(error_code.sortTypeDefineError)
		}

		const data = await getDurationData(
			key,
			start_time,
			end_time,
			tag,
			Lbeacon,
			count_limit,
			sort_type
		)

		data.map((item) => {
			item.start_time = moment(item.start_time).format(timeDefaultFormat)
			item.end_time = moment(item.end_time).format(timeDefaultFormat)
		})

		response.json(data)
	} else if (matchRes == 2) {
		response.json(error_code.key_timeout)
	} else {
		// key fail match with user
		response.json(error_code.keyIncorrect)
	}
}

async function matchKey(key) {
	let matchFlag = 0 // flag = 0 when key error
	return await pool
		.query(queryType.getAllKeyQuery)
		.then((res) => {
			res.rows.map((item) => {
				const vaildTime = moment(item.register_time).add(30, 'm')
				if (moment().isBefore(moment(vaildTime)) && item.key == key) {
					matchFlag = 1 //in time & key right
				} else if (moment().isAfter(moment(vaildTime)) && item.key == key) {
					matchFlag = 2 // out time & key right
				}
			})
			return matchFlag
		})
		.catch((err) => {
			console.log(`match key fails ${err}`)
		})
}

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
			res.rows.map((item) => {
				//item.area_name = tw[item.area_name.toUpperCase().replace(/ /g, '_')]
				item.duration.hours == undefined ? (item.duration.hours = 0) : null
				item.duration.minutes == undefined ? (item.duration.minutes = 0) : null
				item.duration.seconds == undefined ? (item.duration.seconds = 0) : null
				item.duration.milliseconds == undefined
					? (item.duration.milliseconds = 0)
					: null
			})
			return res.rows
		})
		.catch((err) => {
			console.log(`get_data fails ${err}`)
		})
}

function time_format(time) {
	if (time != undefined) {
		return moment(time, timeDefaultFormat).format()
	}
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
	const { key, area_id } = request.body

	try {
		const validArea = compareUserArea(key, area_id)

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
	const { key, object_id, object_type, area_id } = request.body

	try {
		const filter = await setFilter(key, object_id, object_type, area_id)
		const data = await pool.query(queryType.getPeopleRealtimeQuery(filter))
		data.rows.forEach((item) => {
			item.last_reported_timestamp = moment(
				item.last_reported_timtstamp
			).format(timeDefaultFormat)
		})
		console.log('get realtime data successful')
		response.json(checkIsNullResponse(data.rows))
	} catch (err) {
		console.log(`get realtime data failed : ${err}`)
	}
}

async function getPeopleHistoryData(request, response) {
	const { key, area_id, object_id, object_type } = request.body
	let { start_time, end_time, count_limit, sort_type } = request.body

	start_time = setInitialTime(start_time, 1)
	end_time = setInitialTime(end_time, 0)
	count_limit = setCountLimit(count_limit)
	sort_type = setSortType(sort_type)

	const filter = await setFilter(key, object_id, object_type, area_id)

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
		data.rows.forEach((item) => {
			item.record_timestamp = moment(item.record_timestamp).format(
				timeDefaultFormat
			)
		})
		response.json(checkIsNullResponse(data.rows))
	} catch (err) {
		console.log(`get people history data failed : ${err}`)
	}
}

async function getObjectRealtimeData(request, response) {
	const { key, object_id, object_type, area_id } = request.body

	try {
		const filter = await setFilter(key, object_id, object_type, area_id)
		const data = await pool.query(queryType.getObjectRealtimeQuery(filter))

		data.rows.forEach((item) => {
			item.last_reported_timestamp = moment(
				item.last_reported_timtstamp
			).format(timeDefaultFormat)
		})

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

	allUser.rows.forEach((item) => {
		if (username === item.name && password === item.password) {
			user = item
		}
	})

	if (user) {
		const hashToken = encrypt.createHash(password)

		await pool
			.query(queryType.setKey(user.id, user.name, hashToken))
			.catch((err) => {
				console.log(`update data error : ${err}`)
			})
		response.json(
			error_code.getKeySuccessV1(
				hashToken,
				moment().add(30, 'm').format(timeDefaultFormat)
			)
		)
	} else {
		response.json(error_code.accountIncorrect)
	}
}

async function getObjectHistoryData(request, response) {
	const { key, object_type, object_id, area_id } = request.body
	let { start_time, end_time, count_limit, sort_type } = request.body

	start_time = setInitialTime(start_time, 1)
	end_time = setInitialTime(end_time, 0)
	count_limit = setCountLimit(count_limit)
	sort_type = setSortType(sort_type)

	const filter = await setFilter(key, object_id, object_type, area_id)
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
		data.rows.forEach((item) => {
			item.record_timestamp = moment(item.record_timestamp).format(
				timeDefaultFormat
			)
		})
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
		console.log(validArea)
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

function setInitialTime(time, diff) {
	if (time === undefined) {
		return moment(moment().subtract(diff, 'day')).format()
	}
	return setTimeFormat(time)
}

function setSortType(sort_type) {
	if (sort_type === undefined) {
		return 'desc'
	}
	return sort_type
}

function setCountLimit(count_limit) {
	if (count_limit === undefined) {
		return 10
	} else if (count_limit >= 50000) {
		return 50000
	}
	return count_limit
}

function setTimeFormat(time) {
	return moment(time, timeDefaultFormat).format()
}

async function setFilter(key, object_id, object_type, area_id) {
	let filter = ''
	const user_area = await getUserArea(key)

	filter += queryType.getObjectTypeFilter(object_type)
	filter += queryType.getAreaIDFilter(user_area, area_id)
	filter += queryType.getObjectIDFilter(object_id)
	return filter
}
//#endregion

//#endregion
export default {
	//#region api v1.0
	getApiKeyV0,
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
