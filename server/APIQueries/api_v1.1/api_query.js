import error_code from './api_error_code'
import moment from 'moment-timezone'
import queryType from './api_queryType'
import pool from '../../api/db/connection'

const timeDefaultFormat = 'YYYY/MM/DD HH:mm:ss'
import encrypt from '../../api/service/encrypt'

const IntegerRegExp = new RegExp('^[0-9]{1,}$')
const Authenticate = {
	EXCEPTION: 0,
	SUCCESS: 1,
	UNACTIVATED: 2,
	FAILED: 3,
}

async function getIDTableData(request, response) {
	const { key, area_id } = request.body
	const matchRes = await match_key(key)

	if (matchRes === Authenticate.SUCCESS) {
		let filter = ''
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
				response.json(error_code.id_format_error)
				return undefined
			})
			filter += queryType.getAreaIDFilter(area_id)
		}
		try {
			console.log(queryType.getIDTableQuery(key, filter))
			const ObjectTable = await pool.query(
				queryType.getIDTableQuery(key, filter)
			)
			const AreaTable = await pool.query(queryType.getAreaIDQuery())
			// object_type = 0, will get device object type
			const ObjectType = await pool.query(queryType.getObjectTypeQuery(0))
			// object_type = 1, will get people object type
			const PeopleType = await pool.query(queryType.getObjectTypeQuery(1))
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
			//const data = await pool.query(queryType.getIDTableQuery(key))
			//response.json(data.rows)
		} catch (err) {
			console.log(`get id table data error : ${err}`)
		}
	} else if (matchRes === Authenticate.UNACTIVATED) {
		response.json(error_code.key_unactive)
	} else {
		response.json(error_code.key_incorrect)
	}
}

async function getPeopleRealtimeData(request, response) {
	const { key, object_id, object_type, area_id } = request.body
	const matchRes = await match_key(key)

	if (matchRes === Authenticate.SUCCESS) {
		try {
			const filter = SetFilter(object_id, object_type, area_id)
			if (typeof filter !== 'string') {
				response.json(filter)
				return
			}
			const data = await pool.query(
				queryType.getPeopleRealtimeQuery(key, filter)
			)
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
	} else if (matchRes === Authenticate.UNACTIVATED) {
		response.json(error_code.key_unactive)
	} else {
		response.json(error_code.key_incorrect)
	}
}
async function getPeopleHistoryData(request, response) {
	const { key, area_id, object_id, object_type } = request.body
	let { start_time, end_time, count_limit, sort_type } = request.body

	const matchRes = await match_key(key)

	if (matchRes === Authenticate.SUCCESS) {
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

		const filter = SetFilter(object_id, object_type, area_id)
		if (typeof filter !== 'string') {
			response.json(filter)
			return
		}

		try {
			const data = await pool.query(
				queryType.getPeopleHistoryQuery(
					key,
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
	} else if (matchRes === Authenticate.UNACTIVATED) {
		response.json(error_code.key_unactive)
	} else {
		response.json(error_code.key_incorrect)
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
	const matchRes = await match_key(key)

	if (matchRes === Authenticate.SUCCESS) {
		try {
			const filter = SetFilter(object_id, object_type, area_id)
			if (typeof filter !== 'string') {
				response.json(filter)
				return
			}

			const data = await pool.query(
				queryType.getObjectRealtimeQuery(key, filter)
			)

			response.json(CheckIsNullResponse(data.rows))
		} catch (err) {
			console.log(`get realtime data failed : ${err}`)
		}
	} else if (matchRes === Authenticate.UNACTIVATED) {
		response.json(error_code.key_unactive)
	} else {
		response.json(error_code.key_incorrect)
	}
}

async function getObjectHistoryData(request, response) {
	const { key, object_type, object_id, area_id } = request.body
	let { start_time, end_time, count_limit, sort_type } = request.body
	const matchRes = await match_key(key)

	if (matchRes === Authenticate.SUCCESS) {
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

		const filter = SetFilter(object_id, object_type, area_id)
		if (typeof filter !== 'string') {
			response.json(filter)
			return
		}
		try {
			const data = await pool.query(
				queryType.getObjectHistoryQuery(
					key,
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
	} else if (matchRes === Authenticate.UNACTIVATED) {
		response.json(error_code.key_unactive)
	} else {
		response.json(error_code.key_incorrect)
	}
}

const getApiKey = (request, response) => {
	const { username, password } = request.body

	let getUserName = ''
	pool
		.query(queryType.getAllUserQuery) //verification by sha256
		.then((res) => {
			res.rows.forEach((item) => {
				if (username === item.name && password === item.password) {
					getUserName = item.name
				}
			})
			if (getUserName !== '') {
				//already match user name
				pool
					.query(queryType.confirmValidation(getUserName))
					.then((res) => {
						console.log('confirm validation succeed')

						const hash = encrypt.createHash(password)

						pool
							.query(queryType.setKey(res.rows[0].user_id, getUserName, hash))
							.then(() => {
								response.json(
									error_code.get_key_success(
										hash,
										moment().add(30, 'm').format(timeDefaultFormat)
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

async function match_key(key) {
	let Flag = Authenticate.FAILED
	return await pool
		.query(queryType.getAllKeyQuery)
		.then((res) => {
			res.rows.forEach((item) => {
				const validTime = moment(item.register_time).add(30, 'm')

				if (moment().isBefore(moment(validTime)) && item.key === key) {
					Flag = Authenticate.SUCCESS
				} else if (moment().isAfter(moment(validTime)) && item.key === key) {
					Flag = Authenticate.UNACTIVATED
				}
			})
			return Flag
		})
		.catch((err) => {
			console.log(`match exception : ${err}`)
			Flag = Authenticate.EXCEPTION
		})
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

function SetFilter(object_id, object_type, area_id) {
	let filter = ''

	if (object_id) {
		if (!Array.isArray(object_id)) {
			return error_code.object_id_error
		}
		object_id.map((item) => {
			if (
				(typeof item === 'string' && item.match(IntegerRegExp)) ||
				Number.isInteger(item)
			) {
				return item
			}
			filter = error_code.id_format_error
			return undefined
		})
	}
	if (object_type) {
		if (!Array.isArray(object_type)) {
			return error_code.object_type_error
		}
	}
	if (area_id) {
		if (!Array.isArray(area_id)) {
			return error_code.area_id_error
		}
		area_id.map((item) => {
			if (
				(typeof item === 'string' && item.match(IntegerRegExp)) ||
				Number.isInteger(item)
			) {
				return item
			}
			filter = error_code.id_format_error
			return undefined
		})
	}
	if (typeof filter !== 'string') {
		return filter
	}
	filter += queryType.getObjectTypeFilter(object_type)
	filter += queryType.getAreaIDFilter(area_id)
	filter += queryType.getObjectIDFilter(object_id)
	return filter
}

export default {
	getApiKey,
	getPeopleHistoryData,
	getPeopleRealtimeData,
	getObjectHistoryData,
	getObjectRealtimeData,
	getIDTableData,
}
