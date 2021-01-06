import error_code from './api_error_code'
import moment from 'moment-timezone'
import queryType from './api_queryType'
import pool from './api/db/connection'

const timeDefaultFormat = 'YYYY/MM/DD HH:mm:ss'
import { tw } from '../site_module/locale/text'
import encrypt from './api/service/encrypt'

const Authenticate = {
	EXCEPTION: 0,
	SUCCESS: 1,
	UNACTIVATED: 2,
	FAILED: 3,
}

async function get_id_table_data(request, response) {
	const { key } = request.body

	const matchRes = await match_key(key)

	if (matchRes === Authenticate.SUCCESS) {
		try {
			const data = await pool.query(queryType.get_id_table_data(key))
			response.json(data.rows)
		} catch (err) {
			console.log(`get id table data error : ${err}`)
		}
	} else if (matchRes === Authenticate.UNACTIVATED) {
		response.json(error_code.key_unactive)
	} else {
		response.json(error_code.key_incorrect)
	}
}

async function get_people_realtime_data(request, response) {
	const { key } = request.body

	const matchRes = await match_key(key)

	if (matchRes === Authenticate.SUCCESS) {
		try {
			const data = await pool.query(queryType.get_people_realtime_data(key))
			data.rows.forEach((item) => {
				item.last_reported_timestamp = moment(
					item.last_reported_timtstamp
				).format(timeDefaultFormat)
			})
			console.log('get realtime data successful')
			response.json(data.rows)
		} catch (err) {
			console.log(`get realtime data failed : ${err}`)
		}
	} else if (matchRes === Authenticate.UNACTIVATED) {
		response.json(error_code.key_unactive)
	} else {
		response.json(error_code.key_incorrect)
	}
}
async function get_people_history_data(request, response) {
	const { key } = request.body
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

		try {
			const data = await pool.query(
				queryType.get_people_history_data(
					key,
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
			response.json(data.rows)
		} catch (err) {
			console.log(`get people history data failed : ${err}`)
		}
	} else if (matchRes === Authenticate.UNACTIVATED) {
		response.json(error_code.key_unactive)
	} else {
		response.json(error_code.key_incorrect)
	}
}

async function get_object_realtime_data(request, response) {
	const { key } = request.body
	let { object_id, object_type } = request.body
	const matchRes = await match_key(key)

	if (matchRes === Authenticate.SUCCESS) {
		try {
			if (object_id !== undefined) {
				const pattern = new RegExp('^[0-9]{1,}$')
				object_id = object_id.split(';').map((item) => {
					if (item.match(pattern) == null) {
						response.json(error_code.id_format_error)
						return undefined
					}
					return parseInt(item)
				})
				console.log(object_id)
			}
			if (object_type !== undefined) {
				object_type = object_type.split(';')
				console.log(object_type)
			}

			const data = await pool.query(
				queryType.get_object_realtime_data(key, object_type, object_id)
			)

			data.rows = data.rows.map((item) => {
				if (
					moment().isAfter(
						moment(item.last_reported_timestamp).add(5, 'minute')
					)
				) {
					return {
						object_id: item.object_id,
						mac_address: item.mac_address,
						object_name: item.object_name,
						object_type: item.object_type,
						area_id: 'not found',
						area_name: 'not found',
						Lbeacon_description: 'not found',
						Lbeacon_uuid: 'not found',
					}
				}
				return {
					object_id: item.object_id,
					mac_address: item.mac_address,
					object_name: item.object_name,
					object_type: item.object_type,
					area_id: item.area_id,
					area_name: item.area_name,
					lbeacon_uuid: item.lbeacon_uuid,
					lbeacon_description: item.lbeacon_description,
				}
			})

			response.json(data.rows)
		} catch (err) {
			console.log(`get realtime data failed : ${err}`)
		}
	} else if (matchRes === Authenticate.UNACTIVATED) {
		response.json(error_code.key_unactive)
	} else {
		response.json(error_code.key_incorrect)
	}
}

async function get_object_history_data(request, response) {
	const { key } = request.body
	let {
		object_type,
		object_id,
		start_time,
		end_time,
		count_limit,
		sort_type,
	} = request.body
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

		if (object_type !== undefined) {
			object_type = object_type.split(';')
			console.log(object_type)
		}

		if (object_id !== undefined) {
			const pattern = new RegExp('^[0-9]{1,}$')
			object_id = object_id.split(';').map((item) => {
				if (item.match(pattern) == null) {
					response.json(error_code.id_format_error)
					return undefined
				}
				return parseInt(item, 10)
			})
			console.log(object_id)
		}

		try {
			const data = await pool.query(
				queryType.get_object_history_data(
					key,
					object_type,
					object_id,
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
			response.json(data.rows)
		} catch (err) {
			console.log(`get object history data failed : ${err}`)
		}
	} else if (matchRes === Authenticate.UNACTIVATED) {
		response.json(error_code.key_unactive)
	} else {
		response.json(error_code.key_incorrect)
	}
}

const get_api_key = (request, response) => {
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
	const { key } = request.body
	let {
		object_id, // string
		Lbeacon, // string
		start_time, // YYYY/MM/DD HH:mm:ss
		end_time, // YYYY/MM/DD HH:mm:ss
		count_limit, //
		sort_type,
	} = request.body

	const matchRes = await match_key(key)

	if (matchRes === Authenticate.SUCCESS) {
		// matched

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

		//** Object id**//
		if (object_id !== undefined) {
			const pattern = new RegExp('^[0-9]{1,}$')
			object_id = object_id.split(';').map((item) => {
				if (item.match(pattern) == null) {
					response.json(error_code.id_format_error)
				}
				return parseInt(item, 10)
			})
		}
		//** Lbeacon **//
		if (Lbeacon !== undefined) {
			Lbeacon = Lbeacon.split(';')
			const pattern = new RegExp(
				'^[0-9A-Fa-f]{8}-?[0-9A-Fa-f]{4}-?[0-9A-Fa-f]{4}-?[0-9A-Fa-f]{4}-?[0-9A-Fa-f]{12}$'
			)
			Lbeacon.forEach((item) => {
				if (item.match(pattern) == null) {
					//judge format
					response.json(error_code.Lbeacon_error)
				}
			})
		}

		const data = await get_history_data_from_db(
			key,
			start_time,
			end_time,
			object_id,
			Lbeacon,
			count_limit,
			sort_type
		)

		data.forEach((item) => {
			item.start_time = moment(item.start_time).format(timeDefaultFormat)
			item.end_time = moment(item.end_time).format(timeDefaultFormat)
		})

		response.json(data)
	} else if (matchRes === Authenticate.UNACTIVATED) {
		response.json(error_code.key_unactive)
	} else {
		// key fail match with user
		response.json(error_code.key_incorrect)
	}
}

async function match_key(key) {
	let Flag = Authenticate.FAILED
	return await pool.query(queryType.getAllKeyQuery).then((res) => {
		res.rows
			.forEach((item) => {
				const validTime = moment(item.register_time).add(30, 'm')

				if (moment().isBefore(moment(validTime)) && item.key === key) {
					Flag = Authenticate.SUCCESS
				} else if (moment().isAfter(moment(validTime)) && item.key === key) {
					Flag = Authenticate.UNACTIVATED
				}
				return Flag
			})
			.catch((err) => {
				console.log(`match exception : ${err}`)
				Flag = Authenticate.EXCEPTION
			})
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
async function get_history_data_from_db(
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
				item.area_name = tw[item.area_name.toUpperCase().replace(/ /g, '_')]
				item.duration.hours = set_duration_time(item.duration.hours)
				item.duration.minutes = set_duration_time(item.duration.minutes)
				item.duration.seconds = set_duration_time(item.duration.seconds)
				item.duration.milliseconds = set_duration_time(
					item.duration.milliseconds
				)
			})
			return res.rows
		})
		.catch((err) => {
			console.log(`get_data fails ${err}`)
		})
}

function set_duration_time(time) {
	if (time === undefined) {
		return 0
	}
	return time
}

export default {
	get_api_key,
	get_history_data,
	get_people_history_data,
	get_people_realtime_data,
	get_object_history_data,
	get_object_realtime_data,
	get_id_table_data,
}
