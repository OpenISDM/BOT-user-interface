import queryType from './querytype'
import moment from 'moment-timezone'
import pool from '../../db/connection'
import code from './codes'
import queryMethod from './querymethod'
const timeDefaultFormat = 'YYYY/MM/DD HH:mm:ss'
const IntegerRegExp = new RegExp('^[0-9]{1,}$')

const Authenticate = {
	EXCEPTION: 0,
	SUCCESS: 1,
	UNACTIVATED: 2,
	FAILED: 3,
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
		} else if (moment().isAfter(moment(validTime)) && item.key === key && Flag !== Authenticate.SUCCESS) {
            Flag = Authenticate.UNACTIVATED
		}
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
	const { key, object_id, area_id, object_type } = request.body
	let errorCode = {}
	if (object_id) {
		if (!Array.isArray(object_id)) {
			response.json(code.objectIDError)
			return
		}
	}
	if (object_type) {
		if (!Array.isArray(object_type)) {
			response.json(code.objectTypeError)
			return
		}
	}
	if (area_id) {
		if (!Array.isArray(area_id)) {
			response.json(code.areaIDError)
			return
		}
		area_id.map((item) => {
			if (
				(typeof item === 'string' && item.match(IntegerRegExp)) ||
				Number.isInteger(item)
			) {
				return item
			}
			errorCode = code.idFormatError
			return undefined
		})
		const user_area = await queryMethod.getUserArea(key)
		const validArea = area_id.filter(
			(item) => user_area.includes(item) || user_area.includes(item.toString())
		)
		if (validArea.length === 0) {
			errorCode = code.areaIDAuthorityError
		}
	}
	if (Object.keys(errorCode).length !== 0) {
		response.json(errorCode)
		return
	}
	next()
}
async function checkAreaIDFilter(request, response, next) {
	const { key, area_id } = request.body
	let errorCode = {}
	if (area_id) {
		if (!Array.isArray(area_id)) {
			response.json(code.areaIDError)
			return
		}
		area_id.map((item) => {
			if (
				(typeof item === 'string' && item.match(IntegerRegExp)) ||
				Number.isInteger(item)
			) {
				return item
			}
			errorCode = code.idFormatError
			return undefined
		})
		const user_area = await queryMethod.getUserArea(key)
		const validArea = area_id.filter(
			(item) => user_area.includes(item) || user_area.includes(item.toString())
		)
		if (validArea.length === 0) {
			errorCode = code.areaIDAuthorityError
		}
	}
	if (Object.keys(errorCode).length !== 0) {
		response.json(errorCode)
		return
	}
	next()
}
function checkAdditionalFilter(request, response, next) {
	const { start_time, end_time, sort_type, count_limit } = request.body
	if (start_time !== undefined && dateIsValid(start_time) === false) {
		response.json(code.startTimeError)
		return
	}

	if (end_time !== undefined && dateIsValid(end_time) === false) {
		response.json(code.endTimeError)
		return
	}

	if (sort_type !== undefined && sort_type !== 'desc' && sort_type !== 'asc') {
		response.json(code.sortTypeDefineError)
		return
	}

	if (count_limit !== undefined && isNaN(count_limit)) {
		response.json(code.countLimitError)
		return
	}
	next()
}

function dateIsValid(time) {
	return moment(time, timeDefaultFormat, true).isValid()
}

export default {
	checkKey,
	checkFilter,
	checkAreaIDFilter,
	checkAdditionalFilter,
}
