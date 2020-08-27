/*
    2020 © Copyright (c) BiDaE Technology Inc. 
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.
  
    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        zh-TW.js

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


const tw = {
    ABBR: "zh-tw",

    BEDI_TECH: "畢迪科技",
    SLOGAN: "畢迪科技 物件追蹤",

    HOME : "首頁",
    HEALTH_REPORT: "Health Report",
    DEVICE_MONITOR: "偵測裝置",
    SYSTEM_SETTING: "系統設定",
    BOT_ADMIN: "BOT 管理",
    CONTACT_TREE: "匡列對象",
    MONITOR_MANAGEMENT: "偵測裝置管理",
    GEOFENCE: "Geofence",
    OBJECT_MANAGEMENT: "追蹤物件管理",
    MANAGEMENT: "管理",
    BIG_SCREEN: "大螢幕",
    ABOUT: "關於",
    TRACKING_HISTORY: "追蹤紀錄",
    TRACKING_PATH: "追蹤路徑",
    TRACKING_RECORD: "追蹤紀錄",
    TRACE: "追蹤紀錄",
    HISTORICAL_TRACKING_RECORD: "歷史紀錄",
    REAL_TIME_TRACKING_RECORD: "即時紀錄",
    HISTORICAL_RECORD: "歷史紀錄",
    REAL_TIME_RECORD: "即時紀錄",
    SETTINGS: "設定",
    GENERAL_SETTINGS: "一般設定",
    ASSET_USAGE: "資產使用",
    DEVICE_TRANSFER_RECORD: "儀器轉移",
    NOTES_ON_PATIENTS: "病人報告",
    GENERATE_AND_VIEW_SHIFT_CHANGE_RECORD: "產生及檢視交班報表",
    DEVICE_SERVICE_REQUEST: "device service request",
    OBJECT_TRACKING: "物件追蹤",
    SHIFT_CHANGE: "交班",
    MONITOR_SETTINGS: "監控設定",
    REPORT: "報表",
    RECORD: " 報表",
    LBEACON: "lbeacon",
    GATEWAY: "gateway",
    SEARCH_RESULT: "搜尋結果",
    NO_RESULT: "無搜尋結果",
    RESULTS: "結果",
    FREQUENT_SEARCH: "常用搜尋",
    FOUND: "找到",
    NOT_FOUND: "未找到",
    OBJECT_TYPE: "物件類別",
    OBJECT: "物件",
    TYPES: "類別",
    disable:"收起",
    count : "筆",
    LAST_KNOWN_LOCATION:"最後位置",
    MOVING:"移動中",
    STATIONARY:"穩定中",
    POSITION:"位置狀態",
    POSITION_UNDEFINE:"選擇狀態",
    ROOM_NUMBER:"病房編號",
    ATTENDING_PHYSICIAN:"醫生姓名",
    BATTERY_ALERT:"電池更換提示",
    PICTURE:"相關圖片",
    BATTERY_CHANGE:"需更換",
    PATIENT_NUMBER:"病人編號",
    DEVICE_FORM:"設備列表",
    PATIENT_FORM:"病人列表",
    TAGS: "註冊列表",
    PATIENT_GENDER:"性別",
    CHOOSE_GENDER:"選擇性別",
    MALE:"男",
    FEMALE:"女",
    SCAN_TAG:"請掃描TAG",
    ALREADY_CHOOSE:"已選擇",
    MAIN_AREA:"主要區域",
    PRIMARY_AREA: "主要區域",
    SECONDARY_AREAS: "次要區域",
    PERSONA_LIST: "人員列表",
    IMPORT_PERSONA: "匯入人員",
    
    /* Location accuracy */
    LOCATION_ACCURACY: "位置精準度",
    LOW: "低",
    MED: "中",
    HIGH: "高", 
    
    /* List title */
    ALL_DEVICES: "全部儀器",
    ALL_PATIENTS: "全部病人",
    MY_DEVICES: "我的儀器",
    MY_PATIENTS: "我的病人",
    OBJECTS: "物件",
    ITEM: "個",
    DEVICES_FOUND: "找到的儀器",
    PATIENTS_FOUND: "找到的病人",
    DEVICES_NOT_FOUND: "未找到的儀器",
    PATIENTS_NOT_FOUND: "未找到的病人",
    SEARCH_RESULTS_FOUND: "找到的搜尋結果",
    SEARCH_RESULTS_NOT_FOUND: "未找到的搜尋結果",
    OBJECTS_FOUND: "找到的物件",
    OBJECTS_NOT_FOUND: "未找到的物件",
    PLEASE_SELECT_SEARCH_OBJECT: "請選擇搜尋物件",
    BIND_MAC_ADDRESS:"綁定哪個Mac_Address?",
    IMPORT_DEVICES_DATA:"匯入設備",
    IMPORT_PATIENTS_DATA:"匯入病人",
    BATTERY_NOTIFICATION: "電量通知",
    ABOUT_YOU: "關於",
    YOUR_SERVICE_AREAS: "服務區域",
    PREFERENCE: "偏好設定",
    SEARCH_PREFERENCES: "搜尋設定",
    EDIT_ALIAS: "編輯別名",
    EDIT_DEVICE_ALIAS: "編輯儀器別名",


    /* buttons */
    CLEAR : "清除",
    SAVE : "儲存",
    EDIT_SECONDARY_AREA: "編輯次要區域",
    EDIT_PASSWORD: "更改密碼",
    CANCEL: "取消",
    SEND: "送出",
    SIGN_IN: "登入",
    SIGN_UP: "註冊",
    SIGN_OUT: "登出",
    LOG_IN: "登入",
    LOG_OUT: "登出",
    ON: "開啟",
    OFF: "關閉",
    SHIFT_CHANGE_RECORD: "交接記錄",
    SHOW_DEVICES: "顯示儀器",
    HIDE_DEVICES: "隱藏儀器",
    SHOW:"顯示",
    DEVICES: "儀器",
    DEVICE: "儀器",
    DOWNLOAD: "下載",
    DELETE: "刪除",
    REMOVE: "移除",
    ADD_USER: "新增使用者",
    ADD_INPATIENT:"新增病人",
    DELETE_INPATIENT:"刪除病人",
    DELETE_DEVICE:"刪除儀器",
    DELETE_LBEACON:"刪除LBeacon",
    DELETE_GATEWAY:"刪除Gateway",
    EDIT_DEVICES: "編輯儀器",
    EDIT_PATIENT: "編輯病人資料",
    EDIT_INFO: "編輯資料",
    SWITCH_AREA: "切換地點",
    FENCE_ON: "圍籬已開啟",
    FENCE_OFF: "圍籬已關閉",
    LOCATION_MONITOR_ON: "位置監視已開啟",
    LOCATION_MONITOR_OFF: "位置監視已關閉",
    CLEAR_ALERTS: "清除警告",
    SHOW_RESIDENTS: "顯示居民",
    HIDE_RESIDENTS: "隱藏居民",
    VIEW_REPORT: "檢視報告",
    VIEW: "檢視",
    DOWNLOAD_REPORT: "下載報告",
    CLOSE: "關閉",
    SHOW_DEVICES_NOT_FOUND: "顯示未找到的儀器",
    SHOW_DEVICES_FOUND: "顯示找到的儀器",
    SHOW_PATIENTS_NOT_FOUND: "顯示未找到的病人",
    SHOW_PATIENTS_FOUND: "顯示找到的病人",
    SHOW_SEARCH_RESULTS_FOUND: "顯示找到的搜尋結果",
    SHOW_SEARCH_RESULTS_NOT_FOUND: "顯示未找到的搜尋結果",
    ASSOCIATE: "綁定",
    DISSOCIATE: "解除綁定",
    BIND: "綁定",
    UNBIND: "解除綁定",
    IMPORT_OBJECT:"匯入",
    ACN_VERIFICATION:"ACN驗證",
    BINDING_SETTING:"綁定設定",
    BINDING_DELETE:"取消綁定",
    DELETE_OPTION:"刪除選項",
    HIDE_PATH:"隱藏路徑",
    DELETE_OPTION:"移除選項",
    DELETE_OPTION:"移除選項",
    RETURN:"還原",
    ADD_RULE: "增加設定",
    ADD:"新增",
    REMOVE:"移除",
    DELETE_USER:"刪除使用者",
    MULTIPLEDELETE:"多選刪除",
    SHOW_MAP : "顯示地圖",
    HIDE_MAP : "隱藏地圖",
    NEW_SEARCH: "重新搜尋",
    SEARCH: "查詢",
    ADD_BRANCH:"新增分支",
    FORM:"表單",
    ROUTE:"路由",
    USER:"使用者",
    ADD_PERMISSION:"新增許可",
    EXPORT: "匯出",
    EXPORT_CSV: "匯出CSV",
    EXPORT_PDF: "匯出PDF",
    SEND_RESET_INSTRUCTION: "send reset instruction",
    DETAIL: "詳細資料",
    NON_BINDING: "尚未綁定",
    GENERATE_RECORD: "產生報表",


    /* field */
    NAME: "名稱",
    EMAIL: "電子郵件",
    PATIENT_NAME: "病人姓名",
    KEY: "關鍵字",
    TYPE: "類別",
    ASSET_CONTROL_NUMBER: "財產編號",
    OBJECT_IDENTITY_NUMBER: "物件 ID",
    MAC_ADDRESS: "mac address",
    LBEACON: "lbeacon",
    STATUS: "儀器狀態",
    MONITOR_TYPE: "監控類別",
    ACN: "財產編號",
    LOCATION: "地點",
    PATIENT_HISTORICAL_RECORD: "歷史報告",
    RSSI_THRESHOLD: "RSSI設定",
    LAST_FOUR_DIGITS_IN_ACN: "產編後四碼",
    ADD_DEVICE: "增加儀器",
    ADD_PATIENT: "增加病人",
    DELETE_PATIENT: "刪除病人",
    ADD_NOTE: "增加註記",
    HIDE_NOTE: "隱藏註記",
    DELAY_BY: "延後",
    SHIFT: "班別",
    DAY_SHIFT: "早班",
    SWING_SHIFT: "小夜班",
    NIGHT_SHIFT: "大夜班",
    SELECT_SHIFT: "選擇班別",
    SELECT_AREA: "選擇地區",
    SELECT_USER:"選擇使用者",
    SELECT_LOCATION: "選擇地點",
    SELECT_PHYSICIAN: "選擇醫師",
    SELECT_ROOM: "選擇房號",
    SELECT_LBEACON: "選擇lbeacon",
    SELECT_TIME: "選擇時間",
    SELECT_TYPE: "選擇物件類型",
    SELECT_STATUS: "選擇物件狀態",
    SELECT_MONITOR_TYPE: "選擇監控類型",
    TYPE_SEARCH_KEYWORD: "請輸入搜尋關鍵字 ...",
    WRITE_THE_NOTES: "註記",
    USERNAME: "使用者名稱",
    PASSWORD: "密碼",
    DATE_TIME: "時間",
    DEVICE_LOCATION_STATUS_CHECKED_BY: "儀器狀態/地點確認 交接者",
    AUTH_AREA: "所屬地區",
    RECEIVER_ID: "接收者ID",
    RECEIVER_NAME: "接收者姓名",
    RECEIVER_SIGNATURE: "接收者簽名",
    ENABLE: "開啟",
    DISABLE: "關閉",
    ENABLE_START_TIME: "啟動時間",
    ENABLE_END_TIME: "結束時間",
    START_TIME: "起始時間",
    END_TIME: "結束時間",
    BINDFLAG:"綁定狀態",
    PERIMETERS_GROUP: "perimeters group",
    FENCE_RSSI:"fences rssi",
    PERIMETER_RSSI:"perimeter rssi",
    DEPARTMENT:"部門",
    NEW_DEPARTMENT:"新部門",
    FENCES_GROUP: "fences group",
    RSSI: "rssi",
    YES: "是",
    NO: "否",
    IS_GLOBAL_FENCE: "全境電子圍籬",
    NUMBER_OF_SEARCH_HISTORY: "常用搜尋筆數",
    NUMBER_OF_FREQUENT_SEARCH: "常用搜尋筆數",
    SELECTED_AREAS: "已選取區域",
    NOT_SELECTED_AREAS: "未選取區域",
    LOCATION_SELECTION: "區域",
    RECORDED_BY: "紀錄",
    ADD_NEW_RECORD: "新增紀錄",
    FOLD:"折疊",
    COMMENT: "註記",
    SELECT_LEVEL: "選擇階層",
    NAMEGROUPBYAREA: "名稱(area group)",
    NAMEGROUPBYUUID: "名稱(UUID group)",
    NICKNAME:"別名",
    NUM_OF_UPDATED_LBEACON: "# updated lbeacons",
    FORGET_PASSWORD: "忘記密碼?",
    RESET_PASSWORD: "重設密碼",

    /** form title */
    EDIT_LBEACON: "編輯 lbeacon",
    ADD_OBJECT: "增加儀器",
    DELETE_OBJECT: "刪除儀器",
    EDIT_OBJECT: "編輯物件",
    ADD_PERSONA: "增加人員",
    REPORT_DEVICE_STATUS: "回報儀器狀態",
    DEVICE_STATUS: "儀器狀態",
    REPORT_PATIENT_STATUS: "回報病人狀態",
    THANK_YOU_FOR_REPORTING: "謝謝您的回報",
    PRINT_SEARCH_RESULT: "下載搜尋結果",
    EDIT_USER: "編輯使用者",
    REQUEST_FOR_DEVICE_REPARIE: "報修單",
    DEVICE_TRANSFER_RECORD: "轉移單",
    BROKEN_DEVICE_LIST: "報修儀器列表",
    TRANSFERRED_DEVICE_LIST: "轉移儀器列表",
    WHOSE_DEVICES: "的儀器",
    TRANSFERRED_TO: "轉移至",
    CHECKED_BY: "確認",
    CONFIRMED_BY: "審核",
    MOVEMENT_MONITOR: "活動監控",
    LOCATION_MONITOR: "位置監控",
    LONG_STAY_IN_DANGER_MONITOR: "久留監控",
    NOT_STAY_ROOM_MONITOR: "房間監控",
    GEOFENCE_MONITOR: "電子圍籬監控",
    DISSOCIATION: "解除綁定",
    ASSOCIATION: "綁定",
    EDIT_GEOFENCE_CONFIG: "編輯電子圍籬設定",
    ADD_GEOFENCE_CONFIG: "新增電子圍籬設定",
    WARNING: "警告",
    PROCESS_IS_COMPLETED: "完成",
    EDIT_MOVEMENT_MONITOR: "編輯活動監控",
    EDIT_LONG_STAY_IN_DANGER_MONITOR: "編輯久留監控",
    EDIT_NOT_STAY_ROOM_MONITOR: "編輯房間監控",
    SIGNATURE:"簽名",
    MOVEMENT: "活動警告",
    LOCATION: "位置警告",
    GEOFENCE: "電子圍籬警告",
    PANIC: "緊急",
    EDIT_SECONDARY_AREAS: "編輯次要區域",
    NEW_PASSWORD:"新密碼",
    CHECK_PASSWORD:"確認新密碼",
    LEVEL:"階層",
    ADD_COMMENT: "新增註記",
    REMINDER: "提醒",


    /** error message */
    GENDER_IS_REQUIRED: "請選擇性別",
    ROLE_IS_REQUIRED: "請選擇至少一個權限",
    NAME_IS_REQUIRED: "請填入名字",
    NUMBER_IS_REQUIRED:"請輸入病人編號",
    ROOMNUMBER_IS_REQUIRED: "請輸入病房編號",
    ATTENDING_IS_REQUIRED: "請輸入負責醫生",
    TYPE_IS_REQUIRED: "請填入類別",
    LOCATION_IS_REQUIRED: "請選擇地點",
    ASSET_CONTROL_NUMBER_IS_REQUIRED: "請填入財產編號",
    MAC_ADDRESS_IS_REQUIRED: "請填入Mac address",
    STATUS_IS_REQUIRED: "請填入儀器狀態",
    USERNAME_IS_REQUIRED: "請填入使用者名稱",
    PASSWORD_IS_REQUIRED: "請填入密碼",
    THE_USERNAME_IS_ALREADY_TAKEN: "使用者名稱已被使用",
    THE_ASSET_CONTROL_NUMBER_IS_ALREADY_USED: "財產編號已被使用",
    THE_MAC_ADDRESS_IS_ALREADY_USED :"Mac Address已被使用",
    THE_Patient_Number_IS_ALREADY_USED :"病人編號已被使用",
    THE_ID_IS_ALREADY_USED: "人員編號已被使用",
    INCORRECT_MAC_ADDRESS_FORMAT: "Mac Address 格式錯誤",
    THE_ATTENDINGPHYSICIAN_IS_WRONG: "醫生編號 必須是數字",  
    AREA_IS_REQUIRED: "請選擇地區",
    NOT_ASSIGNED_TO_ANY_DEVICES: "尚未指定任何儀器",
    MAC_DO_NOT_MATCH:"不符合當前Mac",
    THE_MAC_ADDRESS_IS_ALREADY_USED_OR_FORMAT_IS_NOT_CORRECT: "Mac Address已被使用或格式錯誤",
    MAC_ADDRESS_FORMAT_IS_NOT_CORRECT: "mac address格式錯誤",
    TIME_FORMAT_IS_INCORRECT: "時間格式錯誤",
    EMAIL_ADDRESS_FORMAT_IS_INCORRECT: "電子郵件格式錯誤",
    LBEACON_FORMAT_IS_NOT_CORRECT: "Lbeacon格式錯誤",
    ASSET_CONTROL_NUMBER_IS_NOT_FOUND: "未有符合的財產編號",
    INCORRECT:"帳號錯誤",
    PASSWORD_INCORRECT:"密碼錯誤",
    AUTHORITY_IS_NOT_ENOUGH:"權限不足",
    ACCOUNT_NOT_BELONG_THIS_AREA:"該帳號不屬於此區域",
    START_TIME_IS_REQUIRED:"請填入起始時間",
    END_TIME_IS_REQUIRED:"請填入結束時間",
    MUST_BE_NEGATIVE_NUMBER:"必須是負數",
    CONNECT_TO_DATABASE_FAILED: "連線失敗",
    THE_ASSET_CONTROL_NUMBER_IS_ALREADY_LINK:"此編號已綁定",
    THE_ID_IS_ALREADY_ASSOCIATED: "此編號已綁定",
    ENTER_THE_PASSWORD:"請輸入新密碼",
    PASSWORD_NOT_FIT:"密碼需要相符",
    ALEAST_CHOOSE_ONE_UUID:"至少選擇一個UUID",
    ENTER_THE_RSSI:"請填入RSSI",
    REQUIRED: "必填",
    ID_IS_NOT_FOUND: "沒有符合的人員編號",
    ASN_IS_REPEAT:"ASN與其他筆資料重複",
    NOT_ALLOW_PUNCTUATION:"有非法字元，如單雙引號",
    OVERLENGTH:"帳號僅允許一百字內",
    LIMIT_IN_TWENTY_CHARACTER: "僅允許20個字元",
    LIMIT_IN_FOURTY_CHARACTER: "僅允許40個字元",
    CANNOT_WORK_NOW: "cannot work now",

    /** placeholder */
    PLEASE_ENTER_OR_SCAN_MAC_ADDRESS: "請輸入或掃描mac address",
    PLEASE_ENTER_OR_SCAN_ASSET_CONTROL_NUMBER: "請輸入或掃描財產編號",
    TYPE_MAC_OR_NAME: "輸入 mac address 或是 名字",
    ADD_A_COMMENT: "請輸入新紀錄...",
    TYPING: "請輸入新紀錄...",
    WAIT_FOR_SEARCH: "等待搜尋...",
    NO_DATA_FOUND: "無搜尋結果",
    SEARCH_FOR_NAME: "搜尋名字",
    SEARCH_FOR_UUID: "搜尋UUID",
    SEARCH_FOR_AREA: "搜尋地區",
    SEARCH_FOR_NAMEGROUPBYAREA: "搜尋地區",
    SEARCH_FOR_NAMEGROUPBYUUID: "搜尋UUID",
    PLEASE_TYPE_PERSONA_ID: "請輸入人員編號",
    PLEASE_TYPE_OBJECT_IDENTITY_NUMBER: "請輸入財產編號或是人員編號",

    /* Object Status */
    STATUS: "狀態",
    NORMAL: "正常",
    BROKEN: "報修",
    TRANSFERRED: "轉移",
    RESERVE: "預約",
    RETURNED: "歸還",
    TRACE: "追蹤",

    /** User Setting */
    USER_SETTING: "帳戶設定",
    DEVICES_MANAGEMENT: "儀器管理",
    USER_PROFILE: "個人資料",
    TRANSFERRED_LOCATION_MANAGEMENT: "轉移單位管理",
    ROLE_PERMISSION_MANAGEMENT: "身分權限管理",
    PATIENT_MANAGEMENT: "病人管理",
    SHIFT_CHANGE_RECORD: "交班紀錄",
    PATIENT_RECORD: "病人報告",
    PATIENT_HISTORIAL_RECORD: "歷史報告",
    OBJECT_EDITED_RECORD: "儀器狀態更改紀錄",
    ACCESS_RIGHT: "使用者權限",
    MY_DEVICES: "我的儀器",
    OTHER_DEVICES: "其他儀器",
    USER_MANAGER: "使用者管理",
    ADMIN: "管理員",
    CONFIRM: "確認", 
    REMOVE_USER_CONFIRM: "移除使用者",    

    /** table Title */
    MY_DEVICES_LIST: "我的儀器",
    MY_PATIENT_LIST: "我的病人",
    NOT_MY_DEVICES_LIST: "其他儀器",
    NOT_MY_PATIENT_LIST: "其他病人",
    PATIENT: "病人",
    DEVICES: "儀器",
    MALE: "男",
    FEMALE: "女",
    
    /** table Field */
    ID: "ID",
    USER_ID: "ID",
    HEALTH_STATUS: "狀態",
    UUID: "UUID",
    DESCRIPTION: "地點描述",
    IP_ADDRESS: "IP位址",
    GATEWAY_IP_ADDRESS: "gateway IP位址",
    LAST_REPORT_TIMESTAMP: "最後回報時間",
    LAST_REPORTED_TIMESTAMP: "最後回報時間",
    LAST_REPORT_TIME: "最後回報時間",
    REGISTERED_TIMESTAMP: "註冊時間",
    LAST_VISITED_TIMESTAMP: "最後登入時間",
    HIGH_RSSI: "高RSSI",
    MED_RSSI: "中RSSI",
    LOW_RSSI: "低RSSI",
    NOTE: "註記",
    BATTERY_VOLTAGE: "電量",
    BATTERY_INDICATOR: "電量",
    REMAIN_BATTERY_VOLUMN: "剩餘電量",
    BATTERY: "電量",
    PANIC: "緊急",
    GEOFENCE_TYPE: "geofence類別",
    ALERT: "警告",
    TRANSFERRED_LOCATION: "轉移單位",
    LAST_LOCATION: "最後所在地點",
    LOCATION_DESCRIPTION: "所在地點",
    RESIDENCE_TIME: "停留時間",
    RECEIVE_TIME: "收到時間",
    ALERT_TIME: "警告時間",
    ROLES: "權限",
    EDIT_TIME: "編輯時間",
    NOTES: "註記",
    NO_DATA_AVAILABE: "無資料顯示", 
    NO_NOTIFICATION: "無通知",
    SUBMIT_TIMESTAMP: "儲存時間",
    USER_NAME: "人員名稱",
    DEVICES_FOUND_IN: "儀器位於",
    DEVICES_NOT_FOUND_IN: "儀器不位於",
    PATIENTS_FOUND: "找到的病人",
    CONFIRM_BY: "確認",
    NEW_STATUS: "狀態紀錄",
    PHYSICIAN_NAME: "醫護人員姓名",
    DANGER_AREA: "警戒區",
    ROOM: "房號",
    AREA: "地區",
    API_VERSION: "API版本",
    SERVER_TIME_OFFSET: "server time offset",
    PRODUCT_VERSION: "版本號",
    ABNORMAL_LBEACON_LIST: "異常LBeacon列表",
    ACTION: "action",
    BRANCH:"分支",
    ROLE_LIST:"角色列表",
    PERMISSION_LIST:"權限列表",
    ALIAS: "別名",

    /** message */
    ARE_YOU_SURE_TO_DELETE: "確定要刪除 ?",
    ARE_YOU_SURE_TO_DISASSOCIATE: "確定要解除綁定 ?",
    NOW_YOU_CAN_DO_THE_FOllOWING_ACTION: "你可以執行以下操作",
    USERNAME_OR_PASSWORD_IS_INCORRECT: "使用者名稱或是密碼錯誤",
    PASSWORD_IS_INCORRECT: "密碼錯誤",
    PLEASE_ENTER_ID_AND_PASSWORD: "請輸入管理者的ID及密碼",
    PLEASE_ENTER_PASSWORD: "請輸入密碼",
    EDIT_LBEACON_SUCCESS: "編輯Lbeacon成功",
    EDIT_OBJECT_SUCCESS: "編輯物件成功",
    DELETE_LBEACON_SUCCESS: "刪除Lbeacon成功",
    DELETE_GATEWAY_SUCCESS: "刪除Gateway成功",
    SAVE_SHIFT_CHANGE_SUCCESS: "儲存交班報表成功",
    SAVE_SUCCESS: "儲存成功",
    SELECT_ROLE:"選擇權限",
    SIGNUP_FAIL:"帳號重複",
    PASSWORD_RESET_SUCCESSFUL: "更改密碼成功",
    PASSWORD_RESET_INSTRUCTION_SUCCESSFUL: "更改密碼確認信已寄到您的信箱，請依照郵件指示更改您的密碼",


    /** user roles */
    CARE_PROVIDER: "護理人員",
    SYSTEM_ADMIN: "系統管理員",
    DEV: "開發人員",

    TO: "至",
    SHIFT_TO: "交接給",
    NEAR: "鄰近",
    IS: "is",
    WHEN: "已",
    NOT_AVAILABLE: "無資料顯示",
    IN: "在",
    NOT: "不",
    WHOSE: "的",
    BELONG_TO: "屬於",
    WAS: "曾",
    BEING_HERE: "已",
    FROM: "",
    MINUTES: "分鐘",
    IS_RESERVED_FOR:"預約者:",
    POUND_SIGN: "#",

    /** locale */
    TW: "中文",
    EN: "英文",

    DEVICE_FOUND: function (length){
        return "發現"+length.toString()+"個儀器"
    },
    DEVICE_NOT_FOUND: function (length){
        return "沒發現"+length.toString()+"個儀器"
    },

    genderSelect :[
        "機器",
        "男",
        "女"
    ],

    EDIT_DEVICE_GROUP_NAME: "更改儀器群組名稱",
    REMOVE_DEVICE_GROUP: "移除儀器列表",
    CREATE_DEVICE_GROUP: "新增儀器列表",
    CREATE_LIST: "新增列表",
    LIST_NAME: "清單名稱",
    SELECT_DEVICE_LIST: "選擇清單",
    VIEW_REPORT: "檢視報表",
    RENAME: "重新命名"
}

export default tw;
