import error_code from './api_error_code'
import moment from 'moment-timezone'
import queryType from './api_queryType'
import pool from '../../db/connection'

const timeDefaultFormat = 'YYYY/MM/DD HH:mm:ss'
import { encrypt } from '../../helpers'

//#region api v1.0
const get_api_key_v0 = (request, response) => {
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
									error_code.get_key_success_v0(
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
				response.json(error_code.sha_256_incorrect)
			}
		})
		.catch((err) => {
			console.log(`get user fails ${err}`)
		})
}

async function get_history_data(request, response) {
	let {
		key,
		tag, // string
		Lbeacon, // string
		start_time, // YYYY/MM/DD HH:mm:ss
		end_time, // YYYY/MM/DD HH:mm:ss
		count_limit, //
		sort_type,
	} = request.body

	let matchRes = Promise.resolve(match_key_v0(key))
	await matchRes.then(function (result) {
		matchRes = result
	})

	if (matchRes == 1) {
		// matched

		//** Time **//

		if (start_time != undefined) {
			// verification by format
			if (moment(start_time, timeDefaultFormat, true).isValid() == false) {
				response.json(error_code.start_time_error)
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
				response.json(error_code.end_time_error)
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
					response.json(error_code.mac_address_error)
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
					response.json(error_code.Lbeacon_error)
				}
			})
		}

		//set default when no input
		if (count_limit == undefined) {
			count_limit = 10
		} else {
			isNaN(count_limit) ? response.json(error_code.count_error) : null
		}

		//0=DESC 1=ASC  : default=0
		if (sort_type == undefined) {
			sort_type = 'desc'
		} else if (sort_type != 'desc' && sort_type != 'asc') {
			response.json(error_code.sort_type_define_error)
		}

		const data = await get_data(
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
		response.json(error_code.key_incorrect)
	}
}

async function match_key_v0(key) {
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

async function get_data(
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
const IntegerRegExp = new RegExp('^[0-9]{1,}$')
const Authenticate = {
	EXCEPTION: 0,
	SUCCESS: 1,
	UNACTIVATED: 2,
	FAILED: 3,
}

const ObjectTypeQuery = {
	DEVICE: 0,
	PEOPLE: 1,
}

async function getIDTableData(request, response) {
	const { area_id } = request.body

	try {
		const ObjectTable = await pool.query(queryType.getIDTableQuery(area_id))
		const AreaTable = await pool.query(queryType.getAreaIDQuery())
		const ObjectType = await pool.query(
			queryType.getObjectTypeQuery(ObjectTypeQuery.DEVICE)
		)
		const PeopleType = await pool.query(
			queryType.getObjectTypeQuery(ObjectTypeQuery.PEOPLE)
		)
		const data = {
			area_table: AreaTable.rows,
			object_types: {
				people_type: PeopleType.rows.map((item) => {
					return item.object_type
				}),
				device_type: ObjectType.rows.map((item) => {
					return item.object_type
				}),
			},
			object_table: ObjectTable.rows,
		}
		response.json(CheckIsNullResponse(data))
	} catch (err) {
		console.log(`get id table data error : ${err}`)
	}
}

async function getPeopleRealtimeData(request, response) {
	const { key, object_id, object_type, area_id } = request.body

	try {
		const filter = await SetFilter(key, object_id, object_type, area_id)
		const data = await pool.query(queryType.getPeopleRealtimeQuery(filter))
		data.rows.forEach((item) => {
			item.last_reported_timestamp = moment(
				item.last_reported_timtstamp
			).format(timeDefaultFormat)
		})
		console.log('get realtime data successful')
		response.json(CheckIsNullResponse(data.rows))
	} catch (err) {
		console.log(`get realtime data failed : ${err}`)
	}
}
async function getPeopleHistoryData(request, response) {
	const { key, area_id, object_id, object_type } = request.body
	let { start_time, end_time, count_limit, sort_type } = request.body

	const error_msg = check_input_error(
		start_time,
		end_time,
		sort_type,
		count_limit
	)

	if (error_msg !== undefined) {
		response.json(error_msg)
		return
	}

	start_time = set_initial_time(start_time, 1)
	end_time = set_initial_time(end_time, 0)
	count_limit = set_count_limit(count_limit)
	sort_type = set_sort_type(sort_type)

	const filter = await SetFilter(key, object_id, object_type, area_id)

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
		response.json(CheckIsNullResponse(data.rows))
	} catch (err) {
		console.log(`get people history data failed : ${err}`)
	}
}

function CheckIsNullResponse(rows) {
	if (
		rows.length > 0 ||
		(Object.keys(rows).length > 0 && rows.constructor === Object)
	) {
		return error_code.get_value_success(rows)
	}
	return error_code.get_null_value(rows)
}

async function getObjectRealtimeData(request, response) {
	const { key, object_id, object_type, area_id } = request.body

	try {
		const filter = SetFilter(key, object_id, object_type, area_id)
		const data = await pool.query(queryType.getObjectRealtimeQuery(filter))

		data.rows.forEach((item) => {
			item.last_reported_timestamp = moment(
				item.last_reported_timtstamp
			).format(timeDefaultFormat)
		})

		response.json(CheckIsNullResponse(data.rows))
	} catch (err) {
		console.log(`get realtime data failed : ${err}`)
	}
}

async function getObjectHistoryData(request, response) {
	const { key, object_type, object_id, area_id } = request.body
	let { start_time, end_time, count_limit, sort_type } = request.body

	const error_msg = check_input_error(
		start_time,
		end_time,
		sort_type,
		count_limit
	)

	if (error_msg !== undefined) {
		response.json(error_msg)
		return
	}
	start_time = set_initial_time(start_time, 1)
	end_time = set_initial_time(end_time, 0)
	count_limit = set_count_limit(count_limit)
	sort_type = set_sort_type(sort_type)

	const filter = await SetFilter(key, object_id, object_type, area_id)
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
		response.json(CheckIsNullResponse(data.rows))
	} catch (err) {
		console.log(`get object history data failed : ${err}`)
	}
}

const getApiKey = async (request, response) => {
	const { username, password } = request.body

	let userName = ''

	const allUser = await pool.query(queryType.getAllUserQuery).catch((err) => {
		console.log(`get all username fail : ${err}`)
	})

	allUser.rows.forEach((item) => {
		if (username === item.name && password === item.password) {
			userName = item.name
		}
	})

	if (userName !== '') {
		const validationConfirm = await pool
			.query(queryType.confirmValidation(userName))
			.catch((err) => {
				console.log(`confirm validation error : ${err}`)
			})

		const hashToken = encrypt.createHash(password)

		await pool
			.query(
				queryType.setKey(validationConfirm.rows[0].user_id, userName, hashToken)
			)
			.catch((err) => {
				console.log(`update data error : ${err}`)
			})
		response.json(
			error_code.get_key_success_v1(
				hashToken,
				moment().add(30, 'm').format(timeDefaultFormat)
			)
		)
	} else {
		response.json(error_code.sha_256_incorrect)
	}
}

async function getUserArea(key) {
	const userArea = await pool.query(queryType.getUserAreaQuery(key))
	const data = userArea.rows.map((item) => {
		return item.area_id
	})
	return data
}

async function checkKey(request, response, next) {
	const { key } = request.body
	let Flag = Authenticate.FAILED
	const userKeyData = await pool
		.query(queryType.getAllKeyQuery)
		.catch((err) => {
			console.log(`match exception : ${err}`)
			Flag = Authenticate.EXCEPTION
		})

	userKeyData.rows.forEach((item) => {
		const validTime = moment(item.register_time).add(30, 'm')

		if (moment().isBefore(moment(validTime)) && item.key === key) {
			Flag = Authenticate.SUCCESS
		} else if (moment().isAfter(moment(validTime)) && item.key === key) {
			Flag = Authenticate.UNACTIVATED
		}
	})

	if (Authenticate.SUCCESS) {
		next()
	} else if (Authenticate.UNACTIVATED) {
		response.json(error_code.key_unactive)
	} else {
		response.json(error_code.key_incorrect)
	}
}

function check_input_error(start_time, end_time, sort_type, count_limit) {
	if (start_time !== undefined && DateIsValid(start_time) === false) {
		return error_code.start_time_error
	}

	if (end_time !== undefined && DateIsValid(end_time) === false) {
		return error_code.end_time_error
	}

	if (sort_type !== undefined && sort_type !== 'desc' && sort_type !== 'asc') {
		return error_code.sort_type_define_error
	}

	if (count_limit !== undefined && isNaN(count_limit)) {
		return error_code.count_error
	}
}

function set_initial_time(time, diff) {
	if (time === undefined) {
		return moment(moment().subtract(diff, 'day')).format()
	}
	return set_time_format(time)
}

function set_sort_type(sort_type) {
	if (sort_type === undefined) {
		return 'desc'
	}
	return sort_type
}

function set_count_limit(count_limit) {
	if (count_limit === undefined) {
		return 10
	} else if (count_limit >= 50000) {
		return 50000
	}
	return count_limit
}

function set_time_format(time) {
	return moment(time, timeDefaultFormat).format()
}

function DateIsValid(time) {
	return moment(time, timeDefaultFormat, true).isValid()
}

function checkFilter(request, response, next) {
	const { object_id, area_id, object_type } = request.body
	let errorCode = {}

	if (object_id) {
		if (!Array.isArray(object_id)) {
			response.json(error_code.object_id_error)
			return
		}
	}
	if (object_type) {
		if (!Array.isArray(object_type)) {
			response.json(error_code.object_type_error)
			return
		}
	}
	if (area_id) {
		if (!Array.isArray(area_id)) {
			response.json(error_code.area_id_error)
			return
		}
		area_id.map((item) => {
			if (
				(typeof item === 'string' && item.match(IntegerRegExp)) ||
				Number.isInteger(item)
			) {
				return item
			}
			errorCode = error_code.id_format_error
			return undefined
		})
	}
	if (Object.keys(errorCode).length !== 0) {
		response.json(errorCode)
		return
	}
	next()
}

async function SetFilter(key, object_id, object_type, area_id) {
	let filter = ''
	const user_area = await getUserArea(key)

	filter += queryType.getObjectTypeFilter(object_type)
	filter += queryType.getAreaIDFilter(user_area, area_id)
	filter += queryType.getObjectIDFilter(object_id)
	return filter
}
//#endregion
export default {
	//#region api v1.0
	get_api_key_v0,
	get_history_data,
	//#endregion

	//#region api v1.1
	checkKey,
	checkFilter,
	getApiKey,
	getPeopleHistoryData,
	getPeopleRealtimeData,
	getObjectHistoryData,
	getObjectRealtimeData,
	getIDTableData,
	//#endregion
}
