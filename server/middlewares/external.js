import queries from '../db/externalQueries'
import moment from 'moment-timezone'
import pool from '../db/connection'
import code from '../controllers/external/codes'
import common from '../controllers/external/common'
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
		const userKey = await pool.query(queries.getKeyQuery(key))

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
			response.json(code.idFormatError)
			return false
		})
		const validArea = await common.getUserArea(
			key,
			queries.getAreaCheckFilter(area_ids)
		)
		if (validArea.length !== area_ids.length) {
			response.json(code.areaIDAuthorityError)
		}
	}
	next()
}
async function checkKeyAndAreaidsFilter(request, response, next) {
	const { key, area_ids } = request.body
	if (area_ids) {
		if (!Array.isArray(area_ids)) {
			response.json(code.areaIDError)
			return
		}

		area_ids.every((item) => {
			if (IntegerRegExp.test(item)) {
				return true
			}
			response.json(code.idFormatError)
			return false
		})

		const validArea = await common.getUserArea(
			key,
			queries.getAreaCheckFilter(area_ids)
		)
		if (validArea.length !== area_ids.length) {
			response.json(code.areaIDAuthorityError)
			return
		}
	}
	next()
}

async function checkUUIDFilter(request, response, next) {
	let { Lbeacon, tag } = request.body

	let error = null
	if (Lbeacon) {
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
	checkKeyAndAreaidsFilter,
	checkOptionalFilter,
	checkUUIDFilter,
	checkPassword,
}
