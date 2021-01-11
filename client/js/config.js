/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        config.js

    File Description:
        BOT UI component

    Version:
        1.0, 20200601

    Abstract:
        BeDIS uses LBeacons to deliver 3D coordinates and textual descriptions of
        their locations to users' devices. Basically, a LBeacon is an inexpensive,
        Bluetooth device. The 3D coordinates and location description of every
        LBeacon are retrieved from BeDIS (Building/environment Data and Information
        System) and stored locally during deployment and maintenance times. Once
        initialized, each LBeacon broadcasts its coordinates and location
        description to Bluetooth enabled user devices within its coverage area. It
        also scans Bluetooth low-energy devices that advertise to announced their
        presence and collect their Mac addresses.

    Authors:
        Tony Yeh, LT1stSoloMID@gmail.com
        Wayne Kang, b05505028@ntu.edu.tw
        Edward Chen, r08921a28@ntu.edu.tw
        Joe Chou, jjoe100892@gmail.com
*/

import { version } from '../../package.json'
import BOT_LOGO from '../img/logo/BOT_LOGO_GREEN.png'
import BOT_LOGO_WEBP from '../img/logo/BOT_LOGO_GREEN.webp'
import mapConfig from './config/mapConfig'
import viewConfig from './config/viewConfig'
import moment from 'moment'
import supportedLocale from './locale/supportedLocale'
import botFeaturesConfig from './config/botFeaturesConfig'
import { NORMAL, BROKEN, TRANSFERRED } from './config/wordMap'

const config = {
	VERSION: `v${version} b.1988`,

	TIMESTAMP_FORMAT: 'LLL',

	TRACING_INTERVAL_UNIT: 'days',

	MAX_SEARCH_OBJECT_NUM: 5,

	TRACING_INTERVAL_VALUE: 1,

	DEFAULT_CONTACT_TREE_INTERVAL_UNIT: 'days',

	DEFAULT_CONTACT_TREE_INTERVAL_VALUE: 1,

	MAX_CONTACT_TRACING_LEVEL: 6,

	RECORD_TYPE: {
		EDITED_OBJECT: 'editedObject',
		SHIFT_CHANGE: 'shiftChange',
	},

	DEFAULT_USER: {
		roles: 'guest',
		areas_id: [0],
		permissions: ['form:view'],
		locale: 'tw',
		main_area: 1,
	},

	KEYWORD_TYPE: ['type_alias', 'type'],

	/** Set the default locale based on the language of platform.
	 *  Default locale for can be tw or en
	 */
	DEFAULT_LOCALE: Object.values(supportedLocale).reduce((abbr, locale) => {
		const navigatorLang = navigator.language.toLocaleUpperCase()
		if (
			navigatorLang === locale.code.toLocaleUpperCase() ||
			navigatorLang === locale.abbr.toUpperCase()
		) {
			return locale.abbr
		}
		return abbr
	}, 'tw'),

	LOGO: BOT_LOGO,

	LOGO_WEBP: BOT_LOGO_WEBP,

	statusOptions: [
		NORMAL,
		BROKEN,
		// 'reserve',
		TRANSFERRED,
	],

	OBJECT_TYPE: {
		DEVICE: 0,
		PERSON: 1,
	},

	NAMED_LIST_TYPE: {
		DEVICE: 0,
		PATIENT: 1,
	},

	OBJECT_TABLE_SUB_TYPE: {
		PATIENT: 'Patient',
		VISITOR: 'Visitor',
		CONTRACTOR: 'Contractor',
		STAFF: 'Staff',
	},

	GENDER_OPTIONS: {
		0: {
			id: 0,
			value: 'male',
		},
		1: {
			id: 1,
			value: 'female',
		},
	},

	monitorOptions: ['geofence', 'panic', 'movement', 'location'],

	monitorTypeMap: {
		object: [1, 16],
		patient: [1, 2, 4, 8],
	},

	monitorSettingType: {
		MOVEMENT_MONITOR: 'movement monitor',
		LONG_STAY_IN_DANGER_MONITOR: 'long stay in danger monitor',
		NOT_STAY_ROOM_MONITOR: 'not stay room monitor',
		GEOFENCE_MONITOR: 'geofence monitor',
	},

	monitorSettingUrlMap: {
		'movement monitor': 'movement_config',
		'long stay in danger monitor': 'location_long_stay_in_danger_config',
		'not stay room monitor': 'location_not_stay_room_config',
		'geofence monitor': 'geo_fence_config',
	},

	monitorSetting: {
		'movement monitor': 'movement_config',
		'long stay in danger monitor': 'location_long_stay_in_danger_config',
		location: 'location_not_stay_room_config',
		geo: 'geo_fence_config',
	},

	getLbeaconDataIntervalTime:
		process.env.GET_LBEACON_DATA_INTERVAL_TIME_IN_MILLI_SEC || 3600000,

	getGatewayDataIntervalTime:
		process.env.GET_GATEWAY_DATA_INTERVAL_TIME_IN_MILLI_SEC || 3600000,

	FOLDER_PATH: {
		trackingRecord: 'tracking_record',
	},

	AJAX_STATUS_MAP: {
		LOADING: 'loading',
		SUCCESS: 'success',
		NO_RESULT: 'no result',
		WAIT_FOR_SEARCH: 'wait for search',
	},

	PDF_FILENAME_TIME_FORMAT: 'YYYY-MM-Do_hh_mm_ss',

	DEFAULT_ROLE: ['system_admin'],

	ROLES_SELECTION: ['system_admin', 'care_provider'],

	HEALTH_STATUS_MAP: {
		0: NORMAL,
		9999: 'n/a',
	},

	PRODUCT_VERSION_MAP: {
		9999: 'n/a',
	},

	TOAST_PROPS: {
		position: 'bottom-right',
		autoClose: false,
		newestOnTop: false,
		closeOnClick: true,
		rtl: false,
		pauseOnVisibilityChange: true,
		draggable: true,
	},

	SHIFT_OPTIONS: ['day shift', 'swing shift', 'night shift'],

	SEARCHABLE_FIELD: [
		'type',
		'asset_control_number',
		'name',
		'nickname',
		'location_description',
		'type_alias',
	],

	AUTOSUGGEST_NUMBER_LIMIT: 10,

	monitorType: {
		1: 'geofence',
		2: 'panic',
		4: 'movement',
		8: 'location',
		16: 'bed',
	},

	toastMonitorMap: {
		1: 'warn',
		2: 'error',
		4: 'error',
		8: 'error',
	},

	statusToCreatePdf: [NORMAL, BROKEN, TRANSFERRED],

	getShift: () => {
		const hour = moment().hours()
		if (hour < 17 && hour > 8) {
			return config.SHIFT_OPTIONS[0]
		} else if (hour < 24 && hour > 17) {
			return config.SHIFT_OPTIONS[1]
		}
		return config.SHIFT_OPTIONS[2]
	},

	...viewConfig,

	...botFeaturesConfig,

	mapConfig,

	ACTION_BUTTONS: {
		DEVICE: 'DEVICE',
		PERSON: 'PERSON',
	},

	ASSIGNMENT: {
		TYPE: {
			DEVICE: 0,
			PATIENT: 1,
		},
		STATUS: {
			ON_GOING: 0,
			COMPLETED: 1,
		},
	},

	SEARCHED_TYPE: {
		ALL_DEVICES: 0,
		ALL_PATIENTS: 1,
		MY_DEVICES: 2,
		MY_PATIENTS: 3,
		OBJECT_TYPE_DEVICE: 4,
		OBJECT_TYPE_PERSON: 5,
		PIN_SELETION: 6,
	},

	NOTIFICATION_ALERT_TYPES_ENUM: {
		GUI: 1,
		LIGHT: 2,
		BELL: 4,
		SMS: 8,
	},

	STATUS_ENUM: {
		ENABLED: 1,
		DISABLED: 0,
	},

	MONITOR_TYPE: {
		NORMAL: 0,
		GEO_FENCE: 1,
		PANIC: 2,
		ACTIVITY: 4,
		LOCATION: 8,
		BED_CLEARNESS: 16,
	},
}

export default config
