import queryType from '../controllers/external/queryType'
import moment from 'moment-timezone'
import pool from '../db/connection'
import code from '../controllers/external/codes'
import queryMethod from '../controllers/external/queryMethod'
const default_Time_Format = 'YYYY/MM/DD HH:mm:ss'
const IntegerRegExp = new RegExp('^[0-9]{1,}$')

async function checkPassword(request, response, next) {
	const { password } = request.body
	if (isNumberLetters(password)) {
		next()
		return
	}
	response.json(code.keyIncorrect)
}

async function checkKey(request, response, next) {
	const { key } = request.body

	if (isNumberLetters(key)) {
		const userKey = await pool.query(queryType.getKeyQuery(key))

		if (userKey.rows.length > 0) {
			if (userKey.rows[0].status === 'ACTIVE') {
				next()
				return
			}
			response.json(code.keyUnactive)
			return
		}
	}
	response.json(code.keyIncorrect)
	return
}
async function checkFilter(request, response, next) {
	const { key, object_ids, area_ids, object_types } = request.body
	let errorCode = null
	if (object_ids) {
		if (!Array.isArray(object_ids)) {
			response.json(code.objectIDError)
			return
		}
	}
	if (object_types) {
		if (!Array.isArray(object_types)) {
			response.json(code.objectTypeError)
			return
		}
	}
	if (area_ids) {
		if (!Array.isArray(area_ids)) {
			response.json(code.areaIDError)
			return
		}
		area_ids.every((item) => {
			if (IntegerRegExp.test(item)) {
				return true
			}
			errorCode = code.idFormatError
			return false
		})

		const user_area = await queryMethod.getUserArea(key)

		const validArea = area_ids.filter(
			(item) => user_area.includes(item) || user_area.includes(item.toString())
		)
		if (validArea.length === 0) {
			errorCode = code.areaIDAuthorityError
		}
	}
	if (errorCode) {
		response.json(errorCode)
		return
	}
	next()
}
async function checkAreaIDFilter(request, response, next) {
	const { key, area_ids } = request.body
	if (area_ids) {
		if (!Array.isArray(area_ids)) {
			response.json(code.areaIDError)
			return
		}
		const userArea = await queryMethod.getUserArea(key)

		area_ids.every((item) => {
			if (IntegerRegExp.test(item)) {
				if (!(userArea.includes(item) || userArea.includes(item.toString()))) {
					response.json(code.areaIDAuthorityError)
				}
				return true
			}
			response.json(code.idFormatError)
			return false
		})
	}

	next()
}

async function checkUUIDFilter(request, response, next) {
	let { Lbeacon, tag } = request.body

	let error = null
	if (Lbeacon) {
		console.log(Lbeacon)
		Lbeacon = Lbeacon.split(',')
		const LbeaconRegExp = new RegExp(
			'^[0-9A-Fa-f]{8}-?[0-9A-Fa-f]{4}-?[0-9A-Fa-f]{4}-?[0-9A-Fa-f]{4}-?[0-9A-Fa-f]{12}$'
		)
		Lbeacon.every((item) => {
			if (!LbeaconRegExp.test(item)) {
				error = code.lbeaconFormatError
				return false
			}
			return true
		})
	}

	if (tag) {
		console.log(tag)
		tag = tag.split(',')
		const tagRegExp = new RegExp(
			'^[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}$'
		)
		tag.every((item) => {
			if (!tagRegExp.test(item)) {
				error = code.macAddressError
				return false
			}
			return true
		})
	}
	if (error) {
		response.json(error)
		return
	}
	next()
}

function checkOptionalFilter(request, response, next) {
	const { start_time, end_time, sort_type, count_limit } = request.body

	if (dateIsValid(start_time) === false) {
		response.json(code.startTimeError)
		return
	}

	if (dateIsValid(end_time) === false) {
		response.json(code.endTimeError)
		return
	}

	if (sort_type && sort_type !== 'desc' && sort_type !== 'asc') {
		response.json(code.sortTypeError)
		return
	}

	if (count_limit && !isPostiveInteger(count_limit)) {
		response.json(code.countLimitError)
		return
	}
	next()
}

function isPostiveInteger(number) {
	return /^\+?\d+$/.test(number)
}

function isNumberLetters(password) {
	return /^[0-9a-zA-Z]+$/.test(password)
}

function dateIsValid(time) {
	return (
		moment(time, default_Time_Format, true).isValid() ||
		moment(time, true).isValid()
	)
}

export default {
	checkKey,
	checkFilter,
	checkAreaIDFilter,
	checkOptionalFilter,
	checkUUIDFilter,
	checkPassword,
}
