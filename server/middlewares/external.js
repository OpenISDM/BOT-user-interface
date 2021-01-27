import queryType from '../controllers/external/querytype'
import moment from 'moment-timezone'
import pool from '../db/connection'
import code from '../controllers/external/codes'
import queryMethod from '../controllers/external/querymethod'
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

	userKeyData.rows.every((item) => {
		if(item.key === key){
			const validTime = moment(item.register_time).add(30,'m')

			if(moment().isBefore(moment(validTime))){
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
	const { key, object_id, area_id, object_type } = request.body
	let errorCode = null
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
		area_id.every((item)=>{
			if(IntegerRegExp.test(item)){
				return true
			}
			errorCode = code.idFormatError
			return false
		})

		const user_area = await queryMethod.getUserArea(key)

		const validArea = area_id.filter(
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
	const { key, area_id } = request.body
	if (area_id) {
		if (!Array.isArray(area_id)) {
			response.json(code.areaIDError)
			return
		}
		const userArea = await querymethod.getUserArea(key)

		area_id.every((item)=>{
			if(IntegerRegExp.test(item)){
				if(!(userArea.includes(item) || userArea.includes(item.toString()))){
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
function checkAdditionalFilter(request, response, next) {
	const { start_time, end_time, sort_type, count_limit } = request.body
	if (start_time && dateIsValid(start_time) === false) {
		response.json(code.startTimeError)
		return
	}

	if (end_time && dateIsValid(end_time) === false) {
		response.json(code.endTimeError)
		return
	}

	if (sort_type && sort_type !== 'desc' && sort_type !== 'asc') {
		response.json(code.sortTypeDefineError)
		return
	}

	if (count_limit && isNaN(count_limit)) {
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
