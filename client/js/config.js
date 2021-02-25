import { version } from '../../package.json'
import BOT_LOGO_WEBP from '../img/logo/BOT_LOGO_GREEN.webp'
import mapConfig from './config/mapConfig'
import moment from 'moment'
import supportedLocale from './locale/supportedLocale'
import { NORMAL, BROKEN, TRANSFERRED } from './config/wordMap'
import { convertConfigValue } from './helper/utilities'

const config = {
	VERSION: `v${version} b.1990`,

	TIMESTAMP_FORMAT: 'LLL',

	MAX_SEARCH_OBJECT_NUM: 5,

	MAX_CONTACT_TRACING_LEVEL: 6,

	RECORD_TYPE: {
		EDITED_OBJECT: 'editedObject',
		SHIFT_CHANGE: 'shiftChange',
	},

	DEFAULT_USER: {
		roles: 'guest',
		area_ids: [0],
		permissions: ['form:view'],
		locale: 'tw',
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

	FOLDER_PATH: {
		trackingRecord: 'tracking_record',
	},

	AJAX_STATUS_MAP: {
		LOADING: 'loading',
		SUCCESS: 'success',
		NO_RESULT: 'no result',
		WAIT_FOR_SEARCH: 'wait for search',
	},

	ROLES_SELECTION: ['bot_admin', 'care_provider'],

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
		'name',
		'type',
		'asset_control_number',
		'nickname',
		'location_description',
		'type_alias',
		'named_list_name',
	],

	AUTOSUGGEST_NUMBER_LIMIT: 10,

	monitorType: {
		1: 'geofence',
		2: 'emergency',
		4: 'movement',
		8: 'location',
		16: 'bed',
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

	GENERATE_SHIFT_RECORD_ENABLE_DOUBLE_CONFIRMED: convertConfigValue(
		JSON.stringify(process.env.GENERATE_SHIFT_RECORD_ENABLE_DOUBLE_CONFIRMED)
	),

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
		EMERGENCY: 2,
		ACTIVITY: 4,
		LOCATION: 8,
		BED_CLEARNESS: 16,
	},
}

export default config
