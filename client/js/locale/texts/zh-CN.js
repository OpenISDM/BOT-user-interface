/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        zh-CN.js

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

const cn = {
	ABBR: 'zh-CN',

	BEDI_TECH: '毕迪科技股份有限公司',
	SLOGAN: '毕迪科技 物件追踪',

	HOME: '首页',
	HEALTH_REPORT: 'Health Report',
	DEVICE_MONITOR: '侦测装置',
	SYSTEM_SETTING: '系统设定',
	BOT_ADMIN: 'BOT 管理',
	CONTACT_TREE: '匡列对象',
	MONITOR_MANAGEMENT: '侦测装置管理',
	GEOFENCE: 'Geofence',
	OBJECT_MANAGEMENT: '追踪物件管理',
	MANAGEMENT: '管理',
	BIG_SCREEN: '大萤幕',
	ABOUT: '关于',
	TRACKING_HISTORY: '追踪纪录',
	TRACKING_PATH: '追踪路径',
	TRACKING_RECORD: '追踪纪录',
	TRACE: '追踪纪录',
	HISTORICAL_TRACKING_RECORD: '历史纪录',
	REAL_TIME_TRACKING_RECORD: '即时纪录',
	HISTORICAL_RECORD: '历史纪录',
	REAL_TIME_RECORD: '即时纪录',
	SETTINGS: '设定',
	CUSTOM_SETTINGS: '自定义设定',
	SEARCH_SETTINGS: '搜寻设定',
	NOTIFICATION_SETTINGS: '通知设定',
	REQUEST_ASSET_USAGE_DATA: '资产使用资料纪录',
	REPORT_OF_HISTORICAL_NOTIFICATIONS: '通知历史报告',
	DEVICE_TRANSFER_RECORD: '产生仪器转移纪录',
	REPORT_AND_CHANGE_NOTES_ON_PATIENTS: '产生及检视病人纪录',
	REPORT_OF_HISTORICAL_DEVICE_STATUS_CHANGED_RECORDS: '仪器状态历史报告',
	GENERATE_AND_VIEW_SHIFT_CHANGE_RECORD: '产生及检视交班报表',
	DEVICE_SERVICE_REQUEST: '要求仪器维修服务',
	REQUEST_OBJECT_TRACE: '要求物件追踪',
	SHIFT_CHANGE: '交班',
	MONITOR_SETTINGS: '监控设定',
	REPORT: '工作支援',
	RECORD: ' 工作支援',
	LBEACON: 'lbeacon',
	GATEWAY: 'gateway',
	SEARCH_RESULT: '搜寻结果',
	NO_RESULT: '无搜寻结果',
	RESULTS: '结果',
	FREQUENT_SEARCH: '常用搜寻',
	FOUND: '找到',
	NOT_FOUND: '未找到',
	OBJECT_TYPE: '物件类别',
	OBJECT: '物件',
	TYPES: '类别',
	disable: '收起',
	count: '笔',
	LAST_KNOWN_LOCATION: '最后位置',
	MOVING: '移动中',
	STATIONARY: '稳定中',
	POSITION: '位置状态',
	POSITION_UNDEFINE: '选择状态',
	ROOM_NUMBER: '病房编号',
	ATTENDING_PHYSICIAN: '医生姓名',
	BATTERY_ALERT: '电池更换提示',
	PICTURE: '相关图片',
	BATTERY_CHANGE: '需更换',
	PATIENT_NUMBER: '病人编号',
	DEVICE_TABLE: '设备列表',
	PATIENT_TABLE: '病人列表',
	STAFF_TABLE: '员工列表',
	VISTOR_TABLE: '访客列表',
	BATTERY_TABLE: '电池状态列表',
	TAGS: '注册列表',
	PATIENT_GENDER: '性别',
	CHOOSE_GENDER: '选择性别',
	MALE: '男',
	FEMALE: '女',
	SCAN_TAG: '请扫描TAG',
	ALREADY_CHOOSE: '已选择',
	LAST_LOGIN_AREA: '最近登入区域',
	PRIMARY_AREA: '主要区域',
	SECONDARY_AREAS: '次要区域',
	PERSONA_LIST: '人员列表',
	IMPORT_PERSONA: '汇入人员',
	GET_ASSIGNMENTS: '获取负责物件清单',
	REPORT_AND_CHANGE_DEVICE_STATUS: '回报与更改装置状态',

	/* Location accuracy */
	LOCATION_ACCURACY: '位置精准度',
	LOW: '低',
	MED: '中',
	HIGH: '高',

	/* List title */
	ALL_DEVICES: '全部仪器',
	ALL_PATIENTS: '全部病人',
	MY_DEVICES: '我的仪器',
	MY_PATIENTS: '我的病人',
	OBJECTS: '物件',
	ITEM: '个',
	DEVICES_FOUND: '找到的仪器',
	PATIENTS_FOUND: '找到的病人',
	DEVICES_NOT_FOUND: '未找到的仪器',
	PATIENTS_NOT_FOUND: '未找到的病人',
	SEARCH_RESULTS_FOUND: '找到的搜寻结果',
	SEARCH_RESULTS_NOT_FOUND: '未找到的搜寻结果',
	OBJECTS_FOUND: '找到的物件',
	OBJECTS_NOT_FOUND: '未找到的物件',
	PLEASE_SELECT_SEARCH_OBJECT: '请选择搜寻物件',
	BIND_MAC_ADDRESS: '绑定哪个Mac_Address?',
	IMPORT_DEVICES_DATA: '汇入设备',
	IMPORT_PATIENTS_DATA: '汇入病人',
	BATTERY_NOTIFICATION: '电量通知',
	ABOUT_YOU: '关于',
	YOUR_SERVICE_AREAS: '服务区域',
	PREFERENCE: '偏好设定',
	SEARCH_PREFERENCES: '搜寻设定',
	EDIT_ALIAS: '编辑别名',
	EDIT_DEVICE_ALIASES: '编辑仪器别名',

	/* buttons */
	CLEAR: '清除',
	SAVE: '储存',
	EDIT_SECONDARY_AREA: '编辑次要区域',
	EDIT_PASSWORD: '更改密码',
	CANCEL: '取消',
	DISCARD: '清除',
	SEND: '送出',
	SIGN_IN: '登入',
	SIGN_UP: '注册',
	SIGN_OUT: '登出',
	LOG_IN: '登入',
	LOG_OUT: '登出',
	ON: '开启',
	OFF: '关闭',
	SHIFT_CHANGE_RECORD: '交接记录',
	SHOW_DEVICES: '显示仪器',
	HIDE_DEVICES: '隐藏仪器',
	SHOW: '显示',
	DEVICES: '仪器',
	DEVICE: '仪器',
	DOWNLOAD: '下载',
	DELETE: '删除',
	ADD_USER: '新增使用者',
	ADD_INPATIENT: '新增病人',
	DELETE_INPATIENT: '删除病人',
	DELETE_DEVICE: '删除仪器',
	DELETE_LBEACON: '删除LBeacon',
	DELETE_GATEWAY: '删除Gateway',
	EDIT_DEVICES: '编辑仪器',
	EDIT_PATIENT: '编辑病人资料',
	EDIT_INFO: '编辑资料',
	SWITCH_AREA: '切换地点',
	FENCE_ON: '围篱已开启',
	FENCE_OFF: '围篱已关闭',
	LOCATION_MONITOR_ON: '位置监视已开启',
	LOCATION_MONITOR_OFF: '位置监视已关闭',
	CLEAR_ALERTS: '清除警告',
	SHOW_RESIDENTS: '显示居民',
	HIDE_RESIDENTS: '隐藏居民',
	VIEW_REPORT: '检视报告',
	VIEW: '检视',
	DOWNLOAD_REPORT: '下载报告',
	CLOSE: '关闭',
	SHOW_DEVICES_NOT_FOUND: '显示未找到的仪器',
	SHOW_DEVICES_FOUND: '显示找到的仪器',
	SHOW_PATIENTS_NOT_FOUND: '显示未找到的病人',
	SHOW_PATIENTS_FOUND: '显示找到的病人',
	SHOW_SEARCH_RESULTS_FOUND: '显示找到的搜寻结果',
	SHOW_SEARCH_RESULTS_NOT_FOUND: '显示未找到的搜寻结果',
	ASSOCIATE: '绑定',
	DISSOCIATE: '解除绑定',
	BIND: '绑定',
	UNBIND: '解除绑定',
	IMPORT_OBJECT: '汇入',
	ACN_VERIFICATION: 'ACN验证',
	BINDING_SETTING: '绑定设定',
	BINDING_DELETE: '取消绑定',
	HIDE_PATH: '隐藏路径',
	DELETE_OPTION: '移除选项,',
	RETURN: '还原',
	ADD_RULE: '增加设定',
	ADD: '新增',
	REMOVE: '移除',
	DELETE_USER: '删除使用者',
	MULTIPLEDELETE: '多选删除',
	SHOW_MAP: '显示地图',
	HIDE_MAP: '隐藏地图',
	NEW_SEARCH: '重新搜寻',
	SEARCH: '查询',
	ADD_LOCATION: '新增分院',
	FORM: '表单',
	ROUTE: '路由',
	USER: '使用者',
	ADD_PERMISSION: '新增许可',
	EXPORT: '汇出',
	EXPORT_CSV: '汇出CSV',
	EXPORT_PDF: '汇出PDF',
	REQUEST_EMAIL_INSTRUCTION:
		'请输入您注册使用者帐号时所填写的电子信箱,系统将会寄出重设密码的连结到您的信箱.',
	SEND_RESET_INSTRUCTION: '要求重设密码',
	DETAIL: '详细资料',
	NON_BINDING: '尚未绑定信标',
	GENERATE_RECORD: '产生报表',
	CREATE_LOCATION: '新增转移地点',

	/* field */
	NAME: '名称',
	EMAIL: '电子邮件',
	PATIENT_NAME: '病人姓名',
	KEY: '关键字',
	TYPE: '类别',
	ASSET_CONTROL_NUMBER: '财编',
	OBJECT_IDENTITY_NUMBER: '物件 ID',
	MAC_ADDRESS: 'MAC位址',
	MONITOR_TYPE: '监控类别',
	ACN: '财编',
	LOCATION: '地点',
	PATIENT_HISTORICAL_RECORD: '历史报告',
	RSSI_THRESHOLD: 'RSSI设定',
	LAST_FOUR_DIGITS_IN_ACN: '产编后四码',
	ADD_DEVICE: '增加仪器',
	ADD_PATIENT: '增加病人',
	DELETE_PATIENT: '删除病人',
	ADD_NOTE: '增加注记',
	HIDE_NOTE: '隐藏注记',
	DELAY_BY: '延后',
	SHIFT: '班别',
	DAY_SHIFT: '早班',
	SWING_SHIFT: '小夜班',
	NIGHT_SHIFT: '大夜班',
	SELECT_SHIFT: '选择班别',
	SELECT_AREA: '选择地区',
	SELECT_USER: '选择使用者',
	SELECT_LOCATION: '选择地点',
	SELECT_PHYSICIAN: '选择医师',
	SELECT_ROOM: '选择房号',
	SELECT_LBEACON: '选择lbeacon',
	SELECT_TIME: '选择时间',
	SELECT_TYPE: '选择物件类型',
	SELECT_STATUS: '选择物件状态',
	SELECT_MONITOR_TYPE: '选择监控类型',
	TYPE_SEARCH_KEYWORD: '请输入搜寻关键字 ...',
	WRITE_THE_NOTES: '注记',
	USERNAME: '使用者名称',
	PASSWORD: '密码',
	DATE_TIME: '时间',
	DEVICE_LOCATION_STATUS_CHECKED_BY: '仪器状态/地点确认 交接者',
	AUTH_AREA: '所属地区',
	RECEIVER_ID: '接收者ID',
	RECEIVER_NAME: '接收者姓名',
	RECEIVER_SIGNATURE: '接收者签名',
	ENABLE: '开启',
	DISABLE: '关闭',
	ENABLE_START_TIME: '启动时间',
	ENABLE_END_TIME: '结束时间',
	START_TIME: '起始时间',
	END_TIME: '结束时间',
	BINDFLAG: '绑定状态',
	PERIMETERS_GROUP: 'perimeters group',
	FENCE_RSSI: 'fences rssi',
	PERIMETER_RSSI: 'perimeter rssi',
	DEPARTMENT: '部门/科别',
	NEW_DEPARTMENT: '新部门/科别',
	FENCES_GROUP: 'fences group',
	RSSI: 'rssi',
	YES: '是',
	NO: '否',
	IS_GLOBAL_FENCE: '全境电子围篱',
	NUMBER_OF_SEARCH_HISTORY: '常用搜寻笔数',
	NUMBER_OF_FREQUENT_SEARCH: '常用搜寻笔数',
	SEARCH_TYPE: '物件搜寻类型',
	SELECTED_AREAS: '已选取区域',
	NOT_SELECTED_AREAS: '未选取区域',
	LOCATION_SELECTION: '区域',
	RECORDED_BY: '纪录',
	ADD_NEW_RECORD: '新增纪录',
	FOLD: '折叠',
	COMMENT: '注记',
	SELECT_LEVEL: '选择阶层',
	NAMEGROUPBYAREA: '名称(area group)',
	NAMEGROUPBYUUID: '名称(UUID group)',
	NICKNAME: '别名',
	NUM_OF_UPDATED_LBEACON: '# updated lbeacons',
	FORGET_PASSWORD: '忘记密码?',
	RESET_PASSWORD: '重设密码',

	/** form title */
	EDIT_LBEACON: '编辑 lbeacon',
	ADD_OBJECT: '增加仪器',
	DELETE_OBJECT: '删除仪器',
	EDIT_OBJECT: '编辑物件',
	ADD_PERSONA: '增加人员',
	REPORT_DEVICE_STATUS: '回报仪器状态',
	DEVICE_STATUS: '回报仪器状态',
	REPORT_PATIENT_STATUS: '回报病人状态',
	THANK_YOU_FOR_REPORTING: '谢谢您的回报',
	PRINT_SEARCH_RESULT: '下载搜寻结果',
	EDIT_USER: '编辑使用者',
	REQUEST_FOR_DEVICE_REPARIE: '报修单',
	BROKEN_DEVICE_LIST: '报修仪器列表',
	TRANSFERRED_DEVICE_LIST: '转移仪器列表',
	WHOSE_DEVICES: '的仪器',
	TRANSFERRED_TO: '转移至',
	RETURNED_TO: '归还至',
	CHECKED_BY: '确认',
	CONFIRMED_BY: '审核',
	MOVEMENT_MONITOR: '活动监控',
	LOCATION_MONITOR: '位置监控',
	LONG_STAY_IN_DANGER_MONITOR: '久留监控',
	NOT_STAY_ROOM_MONITOR: '房间监控',
	GEOFENCE_MONITOR: '电子围篱监控',
	DISSOCIATION: '解除绑定',
	ASSOCIATION: '绑定',
	EDIT_GEOFENCE_CONFIG: '编辑电子围篱设定',
	ADD_GEOFENCE_CONFIG: '新增电子围篱设定',
	WARNING: '警告',
	PROCESS_IS_COMPLETED: '完成',
	EDIT_MOVEMENT_MONITOR: '编辑活动监控',
	EDIT_LONG_STAY_IN_DANGER_MONITOR: '编辑久留监控',
	EDIT_NOT_STAY_ROOM_MONITOR: '编辑房间监控',
	SIGNATURE: '签名',
	MOVEMENT_ALERT: '活动警告',
	LOCATION_ALERT: '位置警告',
	GEOFENCE_ALERT: '电子围篱警告',
	PANIC: '紧急',
	EDIT_SECONDARY_AREAS: '编辑次要区域',
	NEW_PASSWORD: '新密码',
	CHECK_PASSWORD: '确认新密码',
	LEVEL: '阶层',
	ADD_COMMENT: '新增注记',
	REMINDER: '提醒',

	/** error message */
	GENDER_IS_REQUIRED: '请选择性别',
	ROLE_IS_REQUIRED: '请选择至少一个权限',
	NAME_IS_REQUIRED: '请填入名字',
	NUMBER_IS_REQUIRED: '请输入病人编号',
	ROOMNUMBER_IS_REQUIRED: '请输入病房编号',
	ATTENDING_IS_REQUIRED: '请输入负责医生',
	TYPE_IS_REQUIRED: '请填入类别',
	LOCATION_IS_REQUIRED: '请选择地点',
	ASSET_CONTROL_NUMBER_IS_REQUIRED: '请填入财产编号',
	MAC_ADDRESS_IS_REQUIRED: '请填入MAC位址',
	STATUS_IS_REQUIRED: '请填入仪器状态',
	USERNAME_IS_REQUIRED: '请填入使用者名称',
	PASSWORD_IS_REQUIRED: '请填入密码',
	THE_USERNAME_IS_ALREADY_TAKEN: '使用者名称已被使用',
	THE_ASSET_CONTROL_NUMBER_IS_ALREADY_USED: '财产编号已被使用',
	THE_MAC_ADDRESS_IS_ALREADY_USED: 'MAC位址已被使用',
	THE_Patient_Number_IS_ALREADY_USED: '病人编号已被使用',
	THE_ID_IS_ALREADY_USED: '人员编号已被使用',
	INCORRECT_MAC_ADDRESS_FORMAT: 'MAC位址格式错误',
	THE_ATTENDINGPHYSICIAN_IS_WRONG: '医生编号 必须是数字',
	AREA_IS_REQUIRED: '请选择地区',
	NOT_ASSIGNED_TO_ANY_DEVICES: '尚未指定任何仪器',
	MAC_DO_NOT_MATCH: '不符合当前Mac',
	THE_MAC_ADDRESS_IS_ALREADY_USED_OR_FORMAT_IS_NOT_CORRECT:
		'MAC位址已被使用或格式错误',
	MAC_ADDRESS_FORMAT_IS_NOT_CORRECT: 'MAC位址格式错误',
	TIME_FORMAT_IS_INCORRECT: '时间格式错误',
	EMAIL_ADDRESS_FORMAT_IS_INCORRECT: '电子邮件格式错误',
	LBEACON_FORMAT_IS_NOT_CORRECT: 'Lbeacon格式错误',
	ASSET_CONTROL_NUMBER_IS_NOT_FOUND: '未有符合的财产编号',
	INCORRECT: '帐号错误',
	PASSWORD_INCORRECT: '密码错误',
	AUTHORITY_IS_NOT_ENOUGH: '权限不足',
	ACCOUNT_NOT_BELONG_THIS_AREA: '该帐号不属于此区域',
	START_TIME_IS_REQUIRED: '请填入起始时间',
	END_TIME_IS_REQUIRED: '请填入结束时间',
	MUST_BE_NEGATIVE_NUMBER: '必须是负数',
	CONNECT_TO_DATABASE_FAILED: '连线失败',
	THE_ASSET_CONTROL_NUMBER_IS_ALREADY_LINK: '此编号已绑定',
	THE_ID_IS_ALREADY_ASSOCIATED: '此编号已绑定',
	ENTER_THE_PASSWORD: '请输入新密码',
	PASSWORD_NOT_FIT: '密码需要相符',
	ALEAST_CHOOSE_ONE_UUID: '至少选择一个UUID',
	ENTER_THE_RSSI: '请填入RSSI',
	REQUIRED: '必填',
	ID_IS_NOT_FOUND: '没有符合的人员编号',
	ASN_IS_REPEAT: 'ASN与其他笔资料重复',
	NOT_ALLOW_PUNCTUATION: '有非法字元，如单双引号',
	OVERLENGTH: '帐号仅允许一百字内',
	LIMIT_IN_TWENTY_CHARACTER: '仅允许20个字元',
	LIMIT_IN_FOURTY_CHARACTER: '仅允许40个字元',
	CANNOT_WORK_NOW: 'cannot work now',

	/** placeholder */
	PLEASE_ENTER_OR_SCAN_MAC_ADDRESS: '请输入或扫描MAC位址',
	PLEASE_ENTER_OR_SCAN_ASSET_CONTROL_NUMBER: '请输入或扫描财产编号',
	TYPE_MAC_OR_NAME: '输入MAC位址或是名字',
	ADD_A_COMMENT: '请输入新纪录...',
	TYPING: '请输入新纪录...',
	WAIT_FOR_SEARCH: '等待搜寻...',
	NO_DATA_FOUND: '无搜寻结果',
	SEARCH_FOR_NAME: '搜寻名字',
	SEARCH_FOR_UUID: '搜寻UUID',
	SEARCH_FOR_AREA: '搜寻地区',
	SEARCH_FOR_NAMEGROUPBYAREA: '搜寻地区',
	SEARCH_FOR_NAMEGROUPBYUUID: '搜寻UUID',
	PLEASE_TYPE_PERSONA_ID: '请输入人员编号',
	PLEASE_TYPE_OBJECT_IDENTITY_NUMBER: '请输入财产编号或是人员编号',

	/* Object Status */
	STATUS: '状态',
	NORMAL: '正常',
	BROKEN: '报修',
	TRANSFERRED: '转移',
	RESERVE: '预约',
	RETURNED: '归还',
	TRACED: '追踪',

	/** User Setting */
	USER_SETTING: '帐户设定',
	GENERATE_REVISE_DEVICE_ASSIGNMENTS: '产生修改仪器分配',
	USER_PROFILE: '个人资料',
	ADD_DELETE_TRANSFER_LOCATIONS: '新增/删除转移地点',
	ROLE_PERMISSION_MANAGEMENT: '身分权限管理',
	GENERATE_REVISE_PATIENT_ASSIGNMENTS: '产生修改病人分配',
	PATIENT_RECORD: '回报病人状态',
	PATIENT_HISTORIAL_RECORD: '历史报告',
	OBJECT_EDITED_RECORD: '仪器状态更改纪录',
	ACCESS_RIGHT: '使用者权限',
	OTHER_DEVICES: '其他仪器',
	ADD_DELETE_USER_ACCOUNTS: '新增/删除使用者',
	EDIT_USER_ROLES_AND_PERMISSIONS: '修改使用者角色与权限',
	ADMIN: '管理员',
	CONFIRM: '确认',
	REMOVE_USER_CONFIRM: '移除使用者',

	/** table Title */
	MY_DEVICES_LIST: '我的仪器',
	MY_PATIENT_LIST: '我的病人',
	NOT_MY_DEVICES_LIST: '其他仪器',
	NOT_MY_PATIENT_LIST: '其他病人',
	PATIENT: '病人',

	/** table Field */
	ID: 'ID',
	USER_ID: 'ID',
	HEALTH_STATUS: '状态',
	UUID: 'UUID',
	DESCRIPTION: '地点描述',
	IP_ADDRESS: 'IP位址',
	GATEWAY_IP_ADDRESS: 'gateway IP位址',
	LAST_REPORT_TIMESTAMP: '最后回报时间',
	LAST_REPORTED_TIMESTAMP: '最后回报时间',
	LAST_REPORT_TIME: '最后回报时间',
	REGISTERED_TIMESTAMP: '注册时间',
	LAST_VISITED_TIMESTAMP: '最后登入时间',
	HIGH_RSSI: '高RSSI',
	MED_RSSI: '中RSSI',
	LOW_RSSI: '低RSSI',
	NOTE: '注记',
	BATTERY_VOLTAGE: '电量',
	BATTERY_INDICATOR: '电量',
	REMAIN_BATTERY_VOLUMN: '剩余电量',
	BATTERY: '电量',
	GEOFENCE_TYPE: 'geofence类别',
	ALERT: '警告',
	TRANSFERRED_LOCATION: '医院名称',
	LAST_LOCATION: '最后所在地点',
	LOCATION_DESCRIPTION: '所在地点',
	RESIDENCE_TIME: '停留时间',
	RECEIVE_TIME: '收到时间',
	ALERT_TIME: '警告时间',
	ROLES: '权限',
	EDIT_TIME: '编辑时间',
	NOTES: '注记',
	NO_DATA_AVAILABE: '无资料显示',
	NO_NOTIFICATION: '无通知',
	SUBMIT_TIMESTAMP: '储存时间',
	USER_NAME: '人员名称',
	DEVICES_FOUND_IN: '仪器位于',
	DEVICES_NOT_FOUND_IN: '仪器不位于',
	CONFIRM_BY: '确认',
	NEW_STATUS: '状态纪录',
	PHYSICIAN_NAME: '医护人员姓名',
	DANGER_AREA: '警戒区',
	ROOM: '房号',
	AREA: '地区',
	API_VERSION: 'API版本',
	SERVER_TIME_OFFSET: 'server time offset',
	PRODUCT_VERSION: '版本号',
	ABNORMAL_LBEACON_LIST: '异常LBeacon列表',
	ACTION: 'action',
	LOCATION: '分院',
	ROLE_LIST: '角色列表',
	PERMISSION_LIST: '权限列表',
	ALIAS: '别名',
	TYPE_ALIAS: '别名',

	/** message */
	ARE_YOU_SURE_TO_DELETE: '确定要删除 ?',
	ARE_YOU_SURE_TO_DISASSOCIATE: '确定要解除绑定 ?',
	NOW_YOU_CAN_DO_THE_FOllOWING_ACTION: '你可以执行以下操作',
	USERNAME_OR_PASSWORD_IS_INCORRECT: '使用者名称或是密码错误',
	PASSWORD_IS_INCORRECT: '密码错误',
	PLEASE_ENTER_ID_AND_PASSWORD: '请输入管理者的ID及密码',
	PLEASE_LOGIN_TO_CONFIRM: '请输入密码确认交班',
	EDIT_LBEACON_SUCCESS: '编辑Lbeacon成功',
	EDIT_OBJECT_SUCCESS: '编辑物件成功',
	DELETE_LBEACON_SUCCESS: '删除Lbeacon成功',
	DELETE_GATEWAY_SUCCESS: '删除Gateway成功',
	SAVE_SHIFT_CHANGE_SUCCESS: ' 储存交班报表成功',
	SAVE_SUCCESS: '储存成功',
	SELECT_ROLE: '选择权限',
	SIGNUP_FAIL: '帐号重复',
	PASSWORD_RESET_SUCCESSFUL: '更改密码成功',
	PASSWORD_RESET_INSTRUCTION_SUCCESSFUL:
		'更改密码确认信已寄到您的信箱，请依照邮件指示更改您的密码',

	/** user roles */
	CARE_PROVIDER: '护理人员',
	SYSTEM_ADMIN: 'BOT管​​理员',
	DEV: '开发人员',

	TO: '至',
	SHIFT_TO: '交接给',
	NEAR: '邻近',
	IS: 'is',
	WHEN: '已',
	NOT_AVAILABLE: '无资料显示',
	IN: '在',
	NOT: '不',
	WHOSE: '的',
	BELONG_TO: '属于',
	WAS: '曾',
	BEING_HERE: '已',
	FROM: '',
	MINUTES: '分钟',
	IS_RESERVED_FOR: '预约者:',
	POUND_SIGN: '#',

	/** locale */
	TW: '中文',
	EN: '英文',

	DEVICE_FOUND(length) {
		return '发现' + length.toString() + '个仪器'
	},
	DEVICE_NOT_FOUND(length) {
		return '没发现' + length.toString() + '个仪器'
	},

	genderSelect: ['机器', '男', '女'],

	EDIT_DEVICE_GROUP_NAME: '更改仪器群组名称',
	REMOVE_DEVICE_GROUP: '移除仪器列表',
	CREATE_DEVICE_GROUP: '新增仪器列表',
	CREATE_LIST: '新增列表',
	LIST_NAME: '清单名称',
	SELECT_DEVICE_LIST: '选择清单',
	RENAME: '重新命名',
	LICENCE: '© 2020 毕迪科技股份有限公司',
	SELECTED_DEVICES: '已选取装置',
	UNSELECTED_DEVICES: '未选取装置',
	SELECTED_PATIENTS: '已选取病人',
	UNSELECTED_PATIENTS: '未选取病人',
}

export default cn
