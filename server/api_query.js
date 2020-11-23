import error_code from './api_error_code'
import moment from 'moment-timezone'
import queryType from './api_queryType'
import pool from './api/db/connection'

const timeDefaultFormat = 'YYYY/MM/DD HH:mm:ss'
import { tw } from '../site_module/locale/text'
import encrypt from './api/service/encrypt'

async function get_people_realtime_data(request, response) {
	const { key } = request.body

	const matchRes = await match_key(key)

	if (matchRes === 1) {
		try {
			const data = await pool.query(queryType.get_people_realtime_data(key))
			data.rows.forEach((item) => {
				item.last_reported_timtstamp = moment(
					item.last_reported_timtstamp
				).format(timeDefaultFormat)
			})
			console.log('get realtime data successful')
			response.json(data.rows)
		} catch (err) {
			console.log(`get realtime data failed : ${err}`)
		}
	} else if (matchRes === 2) {
		response.json(error_code.key_timeout)
	} else {
		response.json(error_code.key_incorrect)
	}
}
async function get_people_history_data(request, response) {
	const { key } = request.body
	let { start_time, end_time, count_limit, sort_type } = request.body

	const matchRes = await match_key(key)

	if (matchRes === 1) {
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
	} else if (matchRes === 2) {
		response.json(error_code.key_timeout)
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
		tag, // string
		Lbeacon, // string
		start_time, // YYYY/MM/DD HH:mm:ss
		end_time, // YYYY/MM/DD HH:mm:ss
		count_limit, //
		sort_type,
	} = request.body

	const matchRes = await match_key(key)

	if (matchRes === 1) {
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

		//** TAG **//
		if (tag !== undefined) {
			tag = tag.split(',')
			const pattern = new RegExp(
				'^[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}$'
			)
			tag.forEach((item) => {
				if (item.match(pattern) == null) {
					//judge format
					response.json(error_code.mac_address_error)
				}
			})
		}

		//** Lbeacon **//
		if (Lbeacon !== undefined) {
			Lbeacon = Lbeacon.split(',')
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
	} else if (matchRes === 2) {
		response.json(error_code.key_timeout)
	} else {
		// key fail match with user
		response.json(error_code.key_incorrect)
	}
}

async function match_key(key) {
	let matchFlag = 0 // flag = 0 when key error
	return await pool
		.query(queryType.getAllKeyQuery)
		.then((res) => {
			res.rows.forEach((item) => {
				const vaildTime = moment(item.register_time).add(30, 'm')
				if (moment().isBefore(moment(vaildTime)) && item.key === key) {
					matchFlag = 1 //in time & key right
				} else if (moment().isAfter(moment(vaildTime)) && item.key === key) {
					matchFlag = 2 // out time & key right
				}
			})
			return matchFlag
		})
		.catch((err) => {
			console.log(`match key fails ${err}`)
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
}
