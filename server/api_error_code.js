function get_key_success(key, time) {
	const text = {
		error_code: '0',
		error_message: 'get key success',
		key,
		note: 'validity period of key until : ' + time,
	}
	return text
}

const sha_256_incorrect = {
	error_code: '100',
	error_message:
		'get key fail : error data , this key cannot match any account',
	data: '',
}

const key_incorrect = {
	error_code: '200',
	error_message: 'get data fail : key is incorrect',
	data: '',
}

const key_unactive = {
	error_code: '201',
	error_message: 'get data fail : key is out of active time',
	data: '',
}

const start_time_error = {
	error_code: '210',
	error_message: 'get data fail : start time format error',
	data: '',
}

const end_time_error = {
	error_code: '211',
	error_message: 'get data fail : end time format error',
	data: '',
}

const mac_address_error = {
	error_code: '220',
	error_message: 'get data fail : mac address of TAG format error',
	data: '',
}

const Lbeacon_error = {
	error_code: '230',
	error_message: 'get data fail : UUID of LBeacon format error',
	data: '',
}

const count_error = {
	error_code: '240',
	error_message: 'get data fail : count limit must be a number',
	data: '',
}

const sort_type_define_error = {
	error_code: '250',
	error_message: 'get data fail : sort type must be desc or asc',
	data: '',
}

const id_format_error = {
	error_code: '260',
	error_message: 'get data fail : input id must be integer or format error',
	data: '',
}
export default {
	get_key_success,
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
}
