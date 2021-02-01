import moment from 'moment-timezone'
import common from './common'
import queries from '../../db/externalQueries'
import pool from '../../db/connection'

const default_Time_Format = 'YYYY/MM/DD HH:mm:ss'

async function getTracingHisotry(request, response) {
	const { key, sort_type = 'desc' } = request.body
	let {
		tag, // string
		Lbeacon, // string
		start_time, // YYYY/MM/DD HH:mm:ss
		end_time, // YYYY/MM/DD HH:mm:ss
		count_limit = 10, //
	} = request.body

	// to initial data.
	Lbeacon = splitInputData(Lbeacon)
	tag = splitInputData(tag)
	start_time = common.setInitialTime(start_time, 1, default_Time_Format)
	end_time = common.setInitialTime(end_time, 0, default_Time_Format)
	if (count_limit > 50000) count_limit = 500000

	const data = await getDurationData(
		key,
		start_time,
		end_time,
		tag,
		Lbeacon,
		count_limit,
		sort_type
	)

	response.json(data)
}

function splitInputData(data) {
	if (data) return data.split(',')
	return null
}

//function setUUIDData(Lbeacon)
async function getDurationData(
	key,
	start_time,
	end_time,
	tag,
	Lbeacon,
	count_limit,
	sort_type
) {
	const data = await pool.query(
		queries.get_data(
			key,
			start_time,
			end_time,
			tag,
			Lbeacon,
			count_limit,
			sort_type
		)
	)
	console.log('get tracing history data successful')
	data.rows.forEach((item) => {
		item.start_time = moment(item.start_time).format(default_Time_Format)
		item.end_time = moment(item.end_time).format(default_Time_Format)
		item.duration.hours = setDurationTime(item.duration.hours)
		item.duration.minutes = setDurationTime(item.duration.minutes)
		item.duration.seconds = setDurationTime(item.duration.seconds)
		item.duration.milliseconds = setDurationTime(item.duration.milliseconds)
	})
	return data.rows
}
function setDurationTime(time) {
	if (time) {
		return time
	}
	return 0
}

export default { getTracingHisotry }