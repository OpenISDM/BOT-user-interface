function get_key_success_v0(key, time) {
	return {
		error_code: '0',
		error_message: 'get key success',
		key,
		note: 'validity period of key until : ' + time,
	}
}

function get_key_success_v1(key, time) {
	return {
		error_code: '0',
		error_message: 'get key success',
		key,
		valid_time: time,
	}
}

function get_value_success(rows) {
	return {
		error_code: '0',
		error_message: 'get data success',
		data: rows,
	}
}

function get_null_value(rows) {
	return {
		error_code: '101',
		error_message: 'success to post, but there is no match data with filter',
		data: rows,
	}
}

const sha_256_incorrect = {
	error_code: '100',
	error_message:
		'get key fail : error data , this key cannot match any account',
	data: [],
}

const key_incorrect = {
	error_code: '200',
	error_message: 'get data fail : key is incorrect',
	data: [],
}

const key_unactive = {
	error_code: '201',
	error_message: 'get data fail : key is out of active time',
	data: [],
}

const start_time_error = {
	error_code: '210',
	error_message: 'get data fail : start time format error',
	data: [],
}

const end_time_error = {
	error_code: '211',
	error_message: 'get data fail : end time format error',
	data: [],
}

const mac_address_error = {
	error_code: '220',
	error_message: 'get data fail : mac address of TAG format error',
	data: [],
}

const Lbeacon_error = {
	error_code: '230',
	error_message: 'get data fail : UUID of LBeacon format error',
	data: [],
}

const count_error = {
	error_code: '240',
	error_message: 'get data fail : count limit must be a number',
	data: [],
}

const sort_type_define_error = {
	error_code: '250',
	error_message: 'get data fail : sort type must be desc or asc',
	data: [],
}

const id_format_error = {
	error_code: '260',
	error_message: 'get data fail : input id must be integer or format error',
	data: [],
}

const object_id_error = {
	error_code: '261',
	error_message: 'get data fail : object_id input must be a integer array',
	data: [],
}

const object_type_error = {
	error_code: '262',
	error_message: 'get data fail : object_type input must be a string array',
	data: [],
}

const area_id_error = {
	error_code: '263',
	error_message: 'get data fail : area_id input must be a integer array',
	data: [],
}
const area_id_authority_error = {
	error_code: '264',
	error_messsage:
		'get data fail : permission denied, you enter a area id that out of authority.',
	data: [],
}
export default {
	get_key_success_v0,
	get_key_success_v1,
	get_value_success,
	sha_256_incorrect,
	key_incorrect,
	key_unactive,
	start_time_error,
	end_time_error,
	mac_address_error,
	Lbeacon_error,
	count_error,
	sort_type_define_error,
	id_format_error,
	get_null_value,
	object_id_error,
	area_id_error,
	object_type_error,
	area_id_authority_error,
}
