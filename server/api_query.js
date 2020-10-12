import error_code from './api_error_code'
import moment from 'moment-timezone'
import queryType from './api_queryType'
import pg from 'pg'
const config = {
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASS,
	port: process.env.DB_PORT,
}
const pool = new pg.Pool(config)
const timeDefaultFormat = 'YYYY/MM/DD HH:mm:ss'
import { tw } from '../site_module/locale/text'
import encrypt from './api/service/encrypt'

const get_api_key = (request, response) => {
	const { username, password } = request.body

	let getUserName = ''
	pool
		.query(queryType.getAllUser()) //verification by sha256
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
	let {
		key,
		tag, // string
		Lbeacon, // string
		start_time, // YYYY/MM/DD HH:mm:ss
		end_time, // YYYY/MM/DD HH:mm:ss
		count_limit, //
		sort_type,
	} = request.body

	let matchRes = Promise.resolve(match_key(key))
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

		data = Promise.resolve(
			get_data(key, start_time, end_time, tag, Lbeacon, count_limit, sort_type)
		)
		await data.then(function (result) {
			data = result
		})

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

async function match_key(key, response) {
	let matchFlag = 0 // flag = 0 when key error
	return await pool
		.query(queryType.getAllKey())
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
				item.area_name = tw[item.area_name.toUpperCase().replace(/ /g, '_')]
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

export default {
	get_api_key,
	get_history_data,
}
