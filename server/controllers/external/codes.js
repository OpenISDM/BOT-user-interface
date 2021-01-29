export default {
	getApiKeySuccess :(key, validTime)=>{
		return {
			error_code: '0',
			error_message: 'get key success',
			key,
			note: 'validity period of key until : ' + validTime.format(),
			valid_time: validTime.valueOf(),
		}
	},
	getDataSuccess : (rows)=>{
		return {
			error_code: '0',
			error_message: 'get data success',
			data: rows,
		}
	},
	getNoData : (rows)=>{
		return {
			error_code: '101',
			error_message: 'success to post, but there is no match data with filter',
			data: rows,
		}
	},
	accountIncorrect: {
		error_code: '100',
		error_message:
			'get key fail : error data , this key cannot match any account',
		data: [],
	},

	keyIncorrect: {
		error_code: '200',
		error_message: 'get data fail : key is incorrect',
		data: [],
	},

	keyUnactive: {
		error_code: '201',
		error_message: 'get data fail : key is out of active time',
		data: [],
	},

	startTimeError: {
		error_code: '210',
		error_message: 'get data fail : start time format error',
		data: [],
	},

	endTimeError: {
		error_code: '211',
		error_message: 'get data fail : end time format error',
		data: [],
	},

	macAddressError: {
		error_code: '220',
		error_message: 'get data fail : mac address of TAG format error',
		data: [],
	},

	lbeaconFormatError: {
		error_code: '230',
		error_message: 'get data fail : UUID of LBeacon format error',
		data: [],
	},

	countLimitError: {
		error_code: '240',
		error_message: 'get data fail : count limit must be a number',
		data: [],
	},

	sortTypeError: {
		error_code: '250',
		error_message: 'get data fail : sort type must be desc or asc',
		data: [],
	},

	idFormatError: {
		error_code: '260',
		error_message: 'get data fail : input id must be integer or format error',
		data: [],
	},

	objectIDError: {
		error_code: '261',
		error_message: 'get data fail : object_ids input must be a integer array',
		data: [],
	},

	objectTypeError: {
		error_code: '262',
		error_message: 'get data fail : object_types input must be a string array',
		data: [],
	},

	areaIDError: {
		error_code: '263',
		error_message: 'get data fail : area_ids input must be a integer array',
		data: [],
	},
	areaIDAuthorityError: {
		error_code: '264',
		error_message:
			'get data fail : permission denied, you enter a area id that out of authority.',
		data: [],
	},
}