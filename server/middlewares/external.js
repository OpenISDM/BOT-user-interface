import queryType from '../controllers/external/queryType'
import moment from 'moment-timezone'
import pool from '../db/connection'
import code from '../controllers/external/codes'
import queryMethod from '../controllers/external/queryMethod'
const timeDefaultFormat = 'YYYY/MM/DD HH:mm:ss'
const IntegerRegExp = new RegExp('^[0-9]{1,}$')

const Authenticate = {
	EXCEPTION: 0,
	SUCCESS: 1,
	UNACTIVATED: 2,
	FAILED: 3,
}

//Do we need to check strange char like $%^*/\... ?
// async function checkUsername(request, response, next){

// }

async function checkKey(request, response, next) {
	const { key } = request.body
	let Flag = Authenticate.FAILED
	const userKeyData = await pool
		.query(queryType.getAllKeyQuery)
		.catch((err) => {
			console.log(`match exception : ${err}`)
			Flag = Authenticate.EXCEPTION
		})
	console.log(moment().format())
	userKeyData.rows.every((item) => {
		if (item.key === key) {
			const validTime = moment(item.register_time).add(30, 'm')

			if (moment().isBefore(moment(validTime))) {
				Flag = Authenticate.SUCCESS
				return false
			}
			Flag = Authenticate.UNACTIVATED
		}
		return true
	})

	if (Flag === Authenticate.SUCCESS) {
		next()
	} else if (Flag === Authenticate.UNACTIVATED) {
		response.json(code.keyUnactive)
	} else {
		response.json(code.keyIncorrect)
	}
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

function checkAdditionalFilter(request, response, next) {
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

function dateIsValid(time) {
	return (
		moment(time, timeDefaultFormat, true).isValid() ||
		moment(time, true).isValid()
	)
}

export default {
	checkKey,
	checkFilter,
	checkAreaIDFilter,
	checkAdditionalFilter,
	checkUUIDFilter,
}
