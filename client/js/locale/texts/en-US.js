/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        en-US.js

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

const en = {
	ABBR: 'en-US',

	BEDI_TECH: 'BiDaE Technology, Incorporated',
	SLOGAN: 'BiDaE Object Tracker',

	HOME: 'home',
	HEALTH_REPORT: 'health report',
	DEVICE_MONITOR: 'device monitor',
	SYSTEM_SETTING: 'system setting',
	BOT_ADMIN: 'BOT admin',
	CONTACT_TREE: 'contact tree',
	MONITOR_MANAGEMENT: 'monitor management',
	GEOFENCE: 'Geo-fence',
	OBJECT_MANAGEMENT: 'object management',
	MANAGEMENT: 'management',
	BIG_SCREEN: 'big screen',
	ABOUT: 'about',
	TRACKING_HISTORY: 'tracking history',
	TRACKING_PATH: 'tracking path',
	TRACKING_RECORD: 'tracking record',
	TRACE: 'trace',
	HISTORICAL_TRACKING_RECORD: 'historical tracking record',
	REAL_TIME_TRACKING_RECORD: 'real-time tracking record',
	HISTORICAL_RECORD: 'historical record',
	REAL_TIME_RECORD: 'real-time record',
	TRACKING_TABLE: 'tracking table',
	SETTINGS: 'settings',
	CUSTOM_SETTINGS: 'Custom settings',
	SEARCH_SETTINGS: 'Search settings',
	NOTIFICATION_SETTINGS: 'Notification settings',
	REQUEST_ASSET_USAGE_DATA: 'Request Asset Usage Data',
	REPORT_OF_HISTORICAL_NOTIFICATIONS: 'Report Of Historical Notifications',
	REPORT_AND_CHANGE_NOTES_ON_PATIENTS: 'Report and Change Notes On Patients',
	REPORT_OF_HISTORICAL_DEVICE_STATUS_CHANGED_RECORDS:
		'Report of historical device status changed records',
	GENERATE_AND_VIEW_SHIFT_CHANGE_RECORD:
		'Generate And View Shift Change Records',
	DEVICE_SERVICE_REQUEST: 'Request device repair service',
	SHIFT_CHANGE_HISTORICAL_RECORD: 'Shift Change Historical Record',
	REQUEST_OBJECT_TRACE: 'Request Object Trace',
	SHIFT_CHANGE: 'shift change',
	MONITOR_SETTINGS: 'Monitor Settings',
	REPORT: 'Operation Supports',
	RECORD: 'Operation Supports',
	GATEWAY: 'gateway',
	SEARCH_RESULT: 'search results',
	NO_RESULT: 'no result',
	RESULTS: 'results',
	FREQUENT_SEARCH: 'frequent searches',
	FOUND: 'found',
	NOT_FOUND: 'not found',
	OBJECT_TYPE: 'object types',
	OBJECT: 'object',
	TYPES: 'types',
	disable: 'disable',
	count: 'records',
	LAST_KNOWN_LOCATION: 'Last known location',
	MOVING: 'Moving',
	STATIONARY: 'Stationary',
	POSITION: 'POSITION',
	POSITION_UNDEFINE: 'Select position status',
	ROOM_NUMBER: 'Room Number',
	PATIENT_NUMBER: 'Patient Number',
	ATTENDING_PHYSICIAN: 'attending physician',
	BATTERY_ALERT: 'battery replacement alert',
	PICTURE: 'Picture',
	BATTERY_CHANGE: 'need change',
	DEVICE_TABLE: 'Add/Delete Devices',
	PATIENT_TABLE: 'Add/Delete Patients',
	STAFF_TABLE: 'Add/Delete Employees And Contractors',
	VISTOR_TABLE: 'Add/Delete Visitors And Others',
	BATTERY_TABLE: 'Show Battery Status',
	TAGS: 'tags',
	PATIENT_GENDER: 'Gender',
	CHOOSE_GENDER: 'Choose gender',
	PATIENT: 'Patient',
	SCAN_TAG: 'Please Scan TAG',
	ALREADY_CHOOSE: 'Already choose',
	MAIN_AREA: 'Main area',
	PRIMARY_AREA: 'primary area',
	SECONDARY_AREAS: 'secondary areas',
	PERSONA_LIST: 'persona list',
	IMPORT_PERSONA: 'import persona',
	GET_ASSIGNMENTS: 'Get Assignments',
	REPORT_AND_CHANGE_DEVICE_STATUS: 'Report And Change Device Status',

	/* Location accuracy */
	LOCATION_ACCURACY: 'Location Accuracy',
	LOW: 'low',
	MED: 'med',
	HIGH: 'high',

	/* List title */
	ALL_DEVICES: 'All devices',
	ALL_PATIENTS: 'All patients',
	MY_DEVICES: 'My devices',
	MY_PATIENTS: 'My patients',
	OBJECTS: 'objects',
	ITEM: 'items',
	DEVICES_FOUND: 'devices found',
	PATIENTS_FOUND: 'patients found',
	DEVICES_NOT_FOUND: 'devices not found',
	PATIENTS_NOT_FOUND: 'patient not found',
	SEARCH_RESULTS_FOUND: 'search results founds',
	OBJECTS_FOUND: 'objects found',
	OBJECTS_NOT_FOUND: 'objects not found',
	SEARCH_RESULTS_NOT_FOUND: 'search results not founds',
	PLEASE_SELECT_SEARCH_OBJECT: 'please select search object',
	BIND_MAC_ADDRESS: 'Enter the mac_address for binding',
	IMPORT_DEVICES_DATA: 'HIS Data',
	IMPORT_PATIENTS_DATA: 'HIS Patient',
	BATTERY_NOTIFICATION: 'battery notification',
	ABOUT_YOU: 'about you',
	YOUR_SERVICE_AREAS: 'your service areas',
	PREFERENCE: 'preference',
	SEARCH_PREFERENCES: 'search preferences',
	MALE: 'male',
	FEMALE: 'female',
	EDIT_ALIAS: 'edit alias',
	EDIT_DEVICE_ALIASES: 'Edit Device Aliases',

	/* buttons */
	CLEAR: 'Clear',
	SAVE: 'Save',
	EDIT_SECONDARY_AREA: 'edit secondary area',
	EDIT_PASSWORD: 'edit password',
	CANCEL: 'cancel',
	DISCARD: 'discard',
	SEND: 'send',
	SIGN_IN: 'sign in',
	SIGN_UP: 'sign up',
	SIGN_OUT: 'sign out',
	LOG_IN: 'log in',
	LOG_OUT: 'log out',
	ON: 'ON',
	OFF: 'OFF',
	SHIFT_CHANGE_RECORD: 'shift change record',
	SHOW_DEVICES: 'show devices',
	HIDE_DEVICES: 'hide devices',
	SHOW: 'show',
	DEVICE: 'device',
	DEVICES: 'Devices',
	DOWNLOAD: 'download',
	DELETE: 'delete',
	DELETE_LBEACON: 'delete LBeacon',
	DELETE_GATEWAY: 'delete Gateway',
	ADD_USER: 'add user',
	ADD_INPATIENT: 'add inpatient',
	DELETE_INPATIENT: 'delete inpatient',
	DELETE_DEVICE: 'delete device',
	EDIT_DEVICES: 'edit devices',
	SWITCH_AREA: 'switch area',
	FENCE_ON: 'fence on',
	FENCE_OFF: 'fence off',
	LOCATION_MONITOR_ON: 'loc. Monitor on',
	LOCATION_MONITOR_OFF: 'loc. Monitor off',
	CLEAR_ALERTS: 'clear alerts',
	SHOW_RESIDENTS: 'show residents',
	HIDE_RESIDENTS: 'hide residents',
	VIEW_REPORT: 'view report',
	VIEW: 'view',
	DOWNLOAD_REPORT: 'download report',
	CLOSE: 'close',
	SHOW_DEVICES_NOT_FOUND: 'show devices not found',
	SHOW_DEVICES_FOUND: 'show devices found',
	SHOW_PATIENTS_NOT_FOUND: 'show patients not found',
	SHOW_PATIENTS_FOUND: 'show patients found',
	SHOW_SEARCH_RESULTS_FOUND: 'show search results found',
	SHOW_SEARCH_RESULTS_NOT_FOUND: 'show search results not found',
	ASSOCIATE: 'associate',
	DISSOCIATE: 'dissociate',
	BIND: 'bind',
	EXTRACT_DEVICE_INFO: 'extract device info',
	UNBIND: 'unbind',
	IMPORT_OBJECT: 'Import Excel',
	ACN_VERIFICATION: 'ACN Verification',
	BINDING_SETTING: 'Binding Setting',
	BINDING_DELETE: 'Binding Delete',
	DELETE_OPTION: 'Delete option',
	HIDE_PATH: 'hide path',
	RETURN: 'Return',
	ADD_RULE: 'add rule',
	ADD: 'Add',
	REMOVE: 'Remove',
	DELETE_USER: 'Delete user',
	MULTIPLEDELETE: 'multiple delete',
	SHOW_MAP: 'show map',
	HIDE_MAP: 'hide map',
	NEW_SEARCH: 'new search',
	SEARCH: 'search',
	ADD_LOCATION: 'Add location',
	FORM: 'Forms',
	ROUTE: 'Route',
	USER: 'User',
	ADD_PERMISSION: 'add Permission',
	EXPORT: 'export',
	EXPORT_CSV: 'export CSV',
	EXPORT_PDF: 'export PDF',
	REQUEST_EMAIL_INSTRUCTION:
		'Enter the email address you used when you joined and we’ll send you instructions to reset your password.',
	SEND_RESET_INSTRUCTION: 'Request reset password',
	DETAIL: 'detail',
	NON_BINDING: 'Tag not yet bound',
	GENERATE_RECORD: 'generate record',
	CREATE_LOCATION: 'add transferred location',

	/* field */
	NAME: 'name',
	EMAIL: 'email address',
	PATIENT_NAME: 'patient name',
	KEY: 'key',
	TYPE: 'type',
	ASSET_CONTROL_NUMBER: 'Asset ID',
	OBJECT_IDENTITY_NUMBER: 'object ID',
	MAC_ADDRESS: 'mac address',
	TAG_ID: 'Tag ID',
	LBEACON: 'lbeacon',
	MONITOR_TYPE: 'monitor type',
	ACN: 'ACN',
	PATIENT_HISTORICAL_RECORD: 'historical record',
	RSSI_THRESHOLD: 'RSSI threshold',
	LAST_FOUR_DIGITS_IN_ACN: 'last 4 digits in ACN',
	ADD_DEVICE: 'add device',
	ADD_PATIENT: 'add patient',
	DELETE_PATIENT: 'delete patient',
	ADD_NOTE: 'add note',
	HIDE_NOTE: 'hide note',
	DELAY_BY: 'delay by',
	SHIFT: 'shift',
	DAY_SHIFT: 'Day shift',
	SWING_SHIFT: 'Swing shift',
	NIGHT_SHIFT: 'Night shift',
	SELECT_SHIFT: 'select shift',
	SELECT_AREA: 'select area',
	SELECT_USER: 'select user',
	SELECT_LOCATION: 'select location',
	SELECT_PHYSICIAN: 'select physician',
	SELECT_ROOM: 'select room',
	SELECT_LBEACON: 'select lbeacon',
	SELECT_TIME: 'select time',
	SELECT_TYPE: 'select type',
	SELECT_STATUS: 'select status',
	SELECT_MONITOR_TYPE: 'select monitor type',
	TYPE_SEARCH_KEYWORD: 'type search keyword ...',
	WRITE_THE_NOTES: 'notes',
	USERNAME: 'username',
	PASSWORD: 'password',
	DATE_TIME: 'date/time',
	DEVICE_LOCATION_STATUS_CHECKED_BY: 'device location/status checked by',
	AUTH_AREA: 'auth area',
	RECEIVER_ID: 'receiver ID',
	RECEIVER_NAME: 'receiver name',
	RECEIVER_SIGNATURE: 'receiver signature',
	ENABLE: 'enable',
	DISABLE: 'disable',
	ENABLE_START_TIME: 'start time',
	ENABLE_END_TIME: 'end time',
	START_TIME: 'start time',
	END_TIME: 'end time',
	BINDFLAG: 'Binding Status',
	PERIMETERS_GROUP: 'perimeters group',
	FENCE_RSSI: 'fences rssi',
	PERIMETER_RSSI: 'perimeter rssi',
	DEPARTMENT: 'department',
	NEW_DEPARTMENT: 'new department',
	FENCES_GROUP: 'fences group',
	RSSI: 'rssi',
	YES: 'yes',
	NO: 'no',
	IS_GLOBAL_FENCE: 'global fence',
	SIGNATURE: 'signature',
	NUMBER_OF_SEARCH_HISTORY: 'number of search history',
	NUMBER_OF_FREQUENT_SEARCH: 'number of frequent searchs',
	SEARCH_TYPE: 'object search type',
	SELECTED_AREAS: 'selected areas',
	NOT_SELECTED_AREAS: 'not selected areas',
	LOCATION_SELECTION: 'location',
	RECORDED_BY: 'recorded by',
	ADD_NEW_RECORD: 'add new record',
	FOLD: 'fold',
	COMMENT: 'comment',
	SELECT_LEVEL: 'select level',
	NICKNAME: 'nickname',
	NUM_OF_UPDATED_LBEACON: '# updated lbeacons',
	FORGET_PASSWORD: 'forget password?',
	RESET_PASSWORD: 'reset password',

	/** form title */
	EDIT_LBEACON: 'edit lbeacon',
	ADD_OBJECT: 'add object',
	DELETE_OBJECT: 'delete object',
	EDIT_OBJECT: 'edit object',
	EDIT_PATIENT: 'edit patient',
	EDIT_INFO: 'edit info',
	ADD_PERSONA: 'add persona',
	REPORT_DEVICE_STATUS: 'report device status',
	DEVICE_STATUS: 'report device status',
	REPORT_PATIENT_STATUS: 'report patient status',
	THANK_YOU_FOR_REPORTING: 'Thank you for reporting',
	PRINT_SEARCH_RESULT: 'print search result',
	EDIT_USER: 'edit user',
	REQUEST_FOR_DEVICE_REPARIE: 'Request for device repair',
	DEVICE_TRANSFER_RECORD: 'Generate device transfer record',
	BROKEN_DEVICE_LIST: 'broken device list',
	TRANSFERRED_DEVICE_LIST: 'transferred device list',

	// eslint-disable-next-line quotes
	WHOSE_DEVICES: "'s devices",
	TRANSFERRED_TO: 'transferred to',
	RETURNED_TO: 'returned to',
	CHECKED_BY: 'checked by',
	CONFIRMED_BY: 'confirmed by',
	MOVEMENT_MONITOR: 'Movement Monitor',
	LONG_STAY_IN_DANGER_MONITOR: 'long stay in danger',
	NOT_STAY_ROOM_MONITOR: 'not stay room',
	GEOFENCE_MONITOR: 'geofence',
	DISSOCIATION: 'dissociation',
	ASSOCIATION: 'association',
	EDIT_GEOFENCE_CONFIG: 'edit geofence config',
	ADD_GEOFENCE_CONFIG: 'add geofence config',
	WARNING: 'warning',
	PROCESS_IS_COMPLETED: 'process is completed',
	EDIT_MOVEMENT_MONITOR: 'edit movement monitor',
	EDIT_LONG_STAY_IN_DANGER_MONITOR: 'edit long stay in dangen monitor',
	EDIT_NOT_STAY_ROOM_MONITOR: 'edit not stay room monitor',
	MOVEMENT_ALERT: 'movement alert',
	LOCATION_ALERT: 'location alert',
	GEOFENCE_ALERT: 'geofence alert',
	PANIC: 'emergency',
	EDIT_SECONDARY_AREAS: 'edit secondary areas',
	NEW_PASSWORD: 'New password',
	CHECK_PASSWORD: 'confirm new password',
	LEVEL: 'level',
	ADD_COMMENT: 'add comment',
	NAMEGROUPBYAREA: 'name(area group)',
	NAMEGROUPBYUUID: 'name(UUID group)',
	REMINDER: 'reminder',

	/** error message */
	GENDER_IS_REQUIRED: 'Gender is required',
	ROLE_IS_REQUIRED: 'role is required',
	NAME_IS_REQUIRED: 'Name is required',
	NUMBER_IS_REQUIRED: 'Number is required',
	ROOMNUMBER_IS_REQUIRED: 'Room Number is required',
	ATTENDING_IS_REQUIRED: 'Attending Physician is required',
	TYPE_IS_REQUIRED: 'Type is required',
	LOCATION_IS_REQUIRED: 'location is required',
	ASSET_CONTROL_NUMBER_IS_REQUIRED: 'asset ID is required',
	MAC_ADDRESS_IS_REQUIRED: 'Mac address is required',
	STATUS_IS_REQUIRED: 'Status is required',
	USERNAME_IS_REQUIRED: 'Username is required',
	PASSWORD_IS_REQUIRED: 'Password is required',
	THE_Patient_Number_IS_ALREADY_USED: 'The patient number is already used',
	THE_ID_IS_ALREADY_USED: 'The ID is already used',
	THE_USERNAME_IS_ALREADY_TAKEN: 'The username is already taken',
	THE_ASSET_CONTROL_NUMBER_IS_ALREADY_USED: 'The asset ID is already used',
	THE_MAC_ADDRESS_IS_ALREADY_USED: 'The Mac Address is already used',
	INCORRECT_MAC_ADDRESS_FORMAT: 'the mac address format is incorrect',
	INCORRECT_TRANSFERRED_LOCATION_FORMAT:
		'the transferred location format is incorrect',
	THE_ATTENDINGPHYSICIAN_IS_WRONG: 'AttendingPhysician must be a number',
	AREA_IS_REQUIRED: 'Area is required',
	NOT_ASSIGNED_TO_ANY_DEVICES: 'Not assigned to any devices',
	MAC_DO_NOT_MATCH: 'Mac address do not match',
	THE_MAC_ADDRESS_IS_ALREADY_USED_OR_FORMAT_IS_NOT_CORRECT:
		'Mac Address is already used or the format is wrong',
	MAC_ADDRESS_FORMAT_IS_NOT_CORRECT: 'mac address format is not correct',
	TIME_FORMAT_IS_INCORRECT: 'time format is incorrect',
	EMAIL_ADDRESS_FORMAT_IS_INCORRECT: 'email address format is incorrect',
	LBEACON_FORMAT_IS_NOT_CORRECT: 'mac address format is not correct',
	ASSET_CONTROL_NUMBER_IS_NOT_FOUND: 'asset control number is not found',
	INCORRECT: 'username incorrect',
	PASSWORD_INCORRECT: 'password incorrect',
	AUTHORITY_IS_NOT_ENOUGH: 'Authority is not enough',
	ACCOUNT_NOT_BELONG_THIS_AREA: 'This account not belong this area',
	START_TIME_IS_REQUIRED: 'Start time is required',
	END_TIME_IS_REQUIRED: 'End time is required',
	MUST_BE_NEGATIVE_NUMBER: 'must be negative number',
	CONNECT_TO_DATABASE_FAILED: 'connect to database failed',
	THE_ASSET_CONTROL_NUMBER_IS_ALREADY_LINK: 'this asn already linked',
	THE_ID_IS_ALREADY_ASSOCIATED: 'the ID is already associated',
	ENTER_THE_PASSWORD: 'enter new password',
	PASSWORD_NOT_FIT: 'password not fit',
	ALEAST_CHOOSE_ONE_UUID: 'aleast choose one uuid',
	ENTER_THE_RSSI: 'Enter the RSSI',
	REQUIRED: 'required',
	ID_IS_NOT_FOUND: 'ID is not found',
	ASN_IS_REPEAT: 'asn is repeat',

	// eslint-disable-next-line quotes
	NOT_ALLOW_PUNCTUATION: "data have not allow's punctuation",
	OVERLENGTH: 'only allow below 100 chars',
	LIMIT_IN_TWENTY_CHARACTER: 'Limit in 20 characters',
	LIMIT_IN_FOURTY_CHARACTER: 'Limit in 40 characters',
	ALEAST_ONE_DEPARTMENT: 'Aleast one department',
	CANNOT_WORK_NOW: 'cannot work now',

	/** placeholder */
	PLEASE_ENTER_OR_SCAN_MAC_ADDRESS: 'please enter or scan mac address',
	PLEASE_ENTER_OR_SCAN_ASSET_CONTROL_NUMBER:
		'please enter or scan asset control number',
	TYPE_MAC_OR_NAME: 'type mac address or name',
	ADD_A_COMMENT: 'Add a comment...',
	TYPING: 'typing...',
	WAIT_FOR_SEARCH: 'wait for search...',
	NO_DATA_FOUND: 'no data found',
	SEARCH_FOR_NAME: 'Search for name',
	SEARCH_FOR_UUID: 'Search for UUID',
	SEARCH_FOR_AREA: 'search for area',
	SEARCH_FOR_NAMEGROUPBYAREA: 'search for name',
	SEARCH_FOR_NAMEGROUPBYUUID: 'search for UUID',
	PLEASE_TYPE_PERSONA_ID: 'please type ID',
	PLEASE_TYPE_OBJECT_IDENTITY_NUMBER: 'please type ACN or ID',

	/* Object Status */
	CURRENT_STATUS: 'current status',
	STATUS: 'status',
	NORMAL: 'normal',
	BROKEN: 'broken',
	TRANSFERRED: 'transferred',
	RESERVE: 'reserved',
	RETURNED: 'returned',
	TRACED: 'traced',

	/** User Setting */
	USER_SETTING: 'User Setting',
	GENERATE_REVISE_DEVICE_ASSIGNMENTS: 'Generate/Revise Device Assignments',
	GENERATE_REVISE_PATIENT_ASSIGNMENTS: 'Generate/Revise Patient Assignments',
	USER_PROFILE: 'User Profile',
	ADD_DELETE_TRANSFER_LOCATIONS: 'Add/Delete Transfer Locations',
	ROLE_PERMISSION_MANAGEMENT: 'role permission',
	OBJECT_EDITED_RECORD: 'object edited record',
	PATIENT_RECORD: 'Notes on patient',
	PATIENT_HISTORIAL_RECORD: 'historical record',
	ACCESS_RIGHT: 'Access Right',
	OTHER_DEVICES: 'Other Devices',
	ADD_DELETE_USER_ACCOUNTS: 'Add/Delete User Accounts',
	EDIT_USER_ROLES_AND_PERMISSIONS: 'Edit User Roles And Permissions',
	ADMIN: 'Admin',
	CONFIRM: 'Confirm',
	REMOVE_USER_CONFIRM: 'Remove User',

	/** table Title */
	MY_DEVICES_LIST: 'my devices list',
	MY_PATIENT_LIST: 'my patient list',
	NOT_MY_DEVICES_LIST: 'not my devices list',
	NOT_MY_PATIENT_LIST: 'not my patient list',

	/** table field */
	ID: 'ID',
	USER_ID: 'user ID',
	HEALTH_STATUS: 'status',
	UUID: 'UUID',
	DESCRIPTION: 'description',
	IP_ADDRESS: 'IP address',
	GATEWAY_IP_ADDRESS: 'gateway IP address',
	LAST_REPORT_TIMESTAMP: 'last reported',
	LAST_REPORTED_TIMESTAMP: 'last reported',
	LAST_REPORT_TIME: 'last report',
	REGISTERED_TIMESTAMP: 'registered',
	LAST_VISITED_TIMESTAMP: 'last visited',
	HIGH_RSSI: 'high RSSI',
	MED_RSSI: 'med RSSI',
	LOW_RSSI: 'low RSSI',
	NOTE: 'notes',
	BATTERY_VOLTAGE: 'batter voltage',
	BATTERY_INDICATOR: 'batter indicator',
	REMAINING_BATTERY_VOLTAGE: 'remaining battery voltage',
	BATTERY: 'battery',
	GEOFENCE_TYPE: 'geofence type',
	ALERT: 'alert',
	TRANSFERRED_LOCATION: 'transferred location',
	LOCATION_DESCRIPTION: 'location description',
	LAST_LOCATION: 'last location',
	RESIDENCE_TIME: 'residence time',
	RECEIVE_TIME: 'receive time',
	ALERT_TIME: 'alert time',
	EDIT_TIME: 'edited',
	SUBMIT_TIMESTAMP: 'submited',
	ROLES: 'role type',
	NOTES: 'notes',
	NO_DATA_AVAILABE: 'no data available',
	NO_NOTIFICATION: 'no notification',
	NO_ALERT: 'no alert',
	USER_NAME: 'user name',
	DEVICES_FOUND_IN: 'devices found in',
	DEVICES_NOT_FOUND_IN: 'devices not found in',
	CONFIRM_BY: 'confirm by',
	NEW_STATUS: 'new status',
	PHYSICIAN_NAME: 'physician name',
	DANGER_AREA: 'danger area',
	ROOM: 'room',
	AREA: 'area',
	API_VERSION: 'api version',
	SERVER_TIME_OFFSET: 'server time offset',
	PRODUCT_VERSION: 'product version',
	ABNORMAL_LBEACON_LIST: 'abnormal lbeacon list',
	ACTION: 'action options',
	LOCATION: 'location',
	NEW_LOCATION: 'new location',
	ROLE_LIST: 'Role List',
	PERMISSION_LIST: 'Permission List',
	ALIAS: 'alias',
	TYPE_ALIAS: 'alias',

	/** message */
	ARE_YOU_SURE_TO_DELETE: 'Are you sure to delete ?',
	ARE_YOU_SURE_TO_DISASSOCIATE: 'are you sure to disassociate',
	NOW_YOU_CAN_DO_THE_FOllOWING_ACTION: 'Now you can do the following action',
	USERNAME_OR_PASSWORD_IS_INCORRECT: 'Username or password is incorrect',
	PASSWORD_IS_INCORRECT: 'password is incorrect',

	// eslint-disable-next-line quotes
	PLEASE_ENTER_ID_AND_PASSWORD: "please enter Admin's info",
	PLEASE_LOGIN_TO_CONFIRM: 'Please login to confirm ',
	EDIT_LBEACON_SUCCESS: 'edit lbeacon success',
	EDIT_OBJECT_SUCCESS: 'edit object success',
	DELETE_LBEACON_SUCCESS: 'delete lbeacon success',
	DELETE_GATEWAY_SUCCESS: 'delete gateway success',
	SAVE_SHIFT_CHANGE_SUCCESS: 'save shift change success',
	SAVE_SUCCESS: 'Save Success',
	SELECT_ROLE: 'select role',
	SIGNUP_FAIL: 'this username already exist',
	PASSWORD_RESET_SUCCESSFUL: 'password reset successful',
	PASSWORD_RESET_INSTRUCTION_SUCCESSFUL:
		'password reset instruction has been send to your email. Follow the instuction to reset the password.',

	/** user roles */
	CARE_PROVIDER: 'Care Provider',
	SYSTEM_ADMIN: 'BOT Administrator',
	DEV: 'Deverloper',

	TO: 'to',
	SHIFT_TO: 'to',
	NEAR: 'near',
	IS: 'is',
	WHEN: 'when',
	NOT_AVAILABLE: 'N/A',
	IN: 'in',
	NOT: 'not',
	// eslint-disable-next-line quotes
	WHOSE: "'s",
	BELONG_TO: 'belongs to',
	WAS: 'was',
	FROM: 'from',
	MINUTES: 'minutes',
	IS_RESERVED_FOR: 'is reserved for',
	POUND_SIGN: '#',

	// BEING_HERE: "being here",

	/** locale */
	TW: 'chinese',
	EN: 'english',

	DEVICE_FOUND(length) {
		return length.toString() + ' devices are found'
	},
	DEVICE_NOT_FOUND(length) {
		return length.toString() + ' devices are not found'
	},

	genderSelect: ['machine', 'male', 'female'],

	EDIT_DEVICE_GROUP_NAME: 'edit group name',
	REMOVE_DEVICE_GROUP: 'remove list',
	CREATE_DEVICE_GROUP: 'create device list',
	CREATE_LIST: 'create list',
	LIST_NAME: 'list name',
	SELECT_DEVICE_LIST: 'select device list',
	RENAME: 'rename',
	LICENCE: '© 2020 BiDaE Technology, Incorporated',
	SELECTED_DEVICES: 'Selected Devices',
	UNSELECTED_DEVICES: 'Unselected Devices',
	SELECTED_PATIENTS: 'Selected Patients',
	UNSELECTED_PATIENTS: 'Unselected Patients',
	CREATE: 'Create',
	FILE_URL_NOT_FOUND: 'File URL not found',
	STATUS_CHANGED_BY: 'changed by',
	SHIFT_CHANGE_CHECK_LIST: 'Shift Change Check List',
	CONFIRMED: 'Comfirmed',
	UNCONFIRMED: 'Uncomfirmed',

	COVERED_AREA_PROFILE: 'Covered Area Profile',
	PATIENT_ALIASES: 'Patient Aliases',
	DEVICE_ALIASES: 'Device Aliases',
	TRANSFER_LOCATION_ALIASES: 'Transfer Location Aliases',
	EMERGENCY_ALERT: 'Emergency Alert',

	MONITORED_OBJECTS: 'Monitored Objects',
	ALERTS: 'Alerts',

	PATIENTS: 'Patients',
	OTHER_OBJECT_TYPES: 'Other Object Types',

	CONTRACTORS: 'Contractors',
	VISITORS: 'Visitors',
	STAFF: 'Staff',

	MONITOR_ON_TIME: 'On Time',
	ALERT_DEVICES_RESET: 'Devices Alert Reset',
	NOTIFICATION_OPTIONS: 'Notification Types',

	SHOW_MESSAGE_ON_GUI: 'Show Message on GUI',
	FLASH_LIGHTS: 'Flash Lights',
	ALERT_BELLS: 'Alert Bells',
	SEND_SMS: 'Send SMS',

	KEEP_ALERTING_IN_SEC: 'Keep Alerting in Seconds',
	CLOSE_MANUALLY: 'Close Manually',

	CLOSE_ALERT: 'Close Alert',

	CREATE_DEVICE_LIST: 'Create Device List',
	CREATE_PATIENT_LIST: 'Create Patient List',
	VIEW_LIST: 'View List',
	REVISE_LIST: 'Revise List',

	UNKNOWN: 'Unknown',

	REPLACE_TAG: 'Replace Tag',
}

export default en
