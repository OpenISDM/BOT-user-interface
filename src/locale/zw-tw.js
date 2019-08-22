const tw = {
    greeting :'哈囉',
    surveillance: '監控',
    health_report: '監測裝置報告',
    log_out: '登出',
    frequent_searches: '常用搜尋',
    object_types: '可搜尋物件',
    search: '搜尋',
    language: '語言',
    search_result: '搜尋結果',

    HOME : '首頁',
    HEALTH_REPORT: 'Health Report',
    GEOFENCE: 'Geofence',
    OBJECT_MANAGEMENT: '物件管理',
    // frequent search
    FREQUENT_SEARCH: '快速搜尋',
    ALL_DEVICE: '全部儀器',
    MY_DEVICE: '我的儀器',


    /* Location accuracy */
    LOCATION_ACCURACY: '位置精準度',
    LOW: '低',
    MED: '中',
    HIGH: '高', 

    // clear and save
    CLEAR : '清除',
    SAVE : '儲存',

     // user Information
    SIGN_IN: '登入',
    SIGN_UP: '註冊',
    SIGN_OUT: '登出',
    SHIFT_CHANGE_RECORD: '交接記錄',

    DEVICE_FOUND: function (length){
        return '發現'+length.toString()+'個儀器'
    },
    DEVICE_NOT_FOUND: function (length){
        return '沒發現'+length.toString()+'個儀器'
    },
    SEARCH_RESULT: '搜尋結果',

    User_Setting: '帳戶設定',
    Devices_Management: '儀器管理',
    Shift_Record_History: '換班紀錄',
    Edit_Object_Management: '儀器狀態更改紀錄',
    ACCESS_RIGHT: '使用者權限',
    MY_DEVICES: '我的儀器',
    OTHER_DEVICES: '其他儀器',

    CONFIRM: '確認', 
}

export default tw;
