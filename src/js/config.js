/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

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


import BOT_LOGO from '../img//logo/BOT_LOGO_RED.png';
import mapConfig from './config/mapConfig';
import viewConfig from './config/viewConfig';
import moment from 'moment';

const config = {

    VERSION: 'v1.0 b.1932',

    TIMESTAMP_FORMAT: 'LLL',

    TRACING_INTERVAL_UNIT: 'days',

    MAX_SEARCH_OBJECT_NUM: 5,

    TRACING_INTERVAL_VALUE: 1,

    DEFAULT_CONTACT_TREE_INTERVAL_UNIT: 'days',

    DEFAULT_CONTACT_TREE_INTERVAL_VALUE: 1,

    MAX_CONTACT_TRACING_LEVEL: 6,

    RECORD_TYPE: {
        EDITED_OBJECT: 'editedObject',
        SHIFT_CHANGE: 'shiftChange'
    },
    
    DEFAULT_USER: {
        roles: 'guest',
        areas_id: [0],
        permissions:[
            'form:view',
        ],
        locale: 'tw',
        main_area: 1,
    },

    DEFAULT_LOCALE: 'tw' ,

    LOGO: BOT_LOGO,

    statusOptions: [
        'normal',
        'broken',
        'reserve',
        'transferred'
    ],

    monitorOptions: [
        'geofence',
        'panic',
        'movement',
        'location'
    ],

    monitorTypeMap: {
        object: [1, 16],
        patient: [1,2,4,8]
    },

    monitorSettingType: {
        MOVEMENT_MONITOR: "movement monitor",
        LONG_STAY_IN_DANGER_MONITOR: "long stay in danger monitor",
        NOT_STAY_ROOM_MONITOR: "not stay room monitor",
        GEOFENCE_MONITOR: "geofence monitor",
    },

    monitorSettingUrlMap: {
        "movement monitor": "movement_config",
        "long stay in danger monitor": "location_long_stay_in_danger_config",
        "not stay room monitor": "location_not_stay_room_config",
        "geofence monitor": "geo_fence_config"
    },

    monitorSetting: {
        "movement monitor": "movement_config",
        "long stay in danger monitor": "location_long_stay_in_danger_config",
        location: "location_not_stay_room_config",
        geo: "geo_fence_config"
    },

    getLbeaconDataIntervalTime: process.env.GET_LBEACON_DATA_INTERVAL_TIME_IN_MILLI_SEC || 3600000,

    getGatewayDataIntervalTime: process.env.GET_GATEWAY_DATA_INTERVAL_TIME_IN_MILLI_SEC || 3600000,

    objectStatus: {
        PERIMETER: "perimeter",
        FENCE: "fence",
        NORMAL: "normal",
        BROKEN: "broken",
        RESERVE: "reserve",
        TRANSFERRED: "transferred",   
    },

    FOLDER_PATH: {

        trackingRecord: `tracking_record`
    },

    AJAX_STATUS_MAP: {
        LOADING: 'loading',
        SUCCESS: 'succcess',
        NO_RESULT: 'no result',
        WAIT_FOR_SEARCH: 'wait for search',
    },

    PDF_FILENAME_TIME_FORMAT: "YYYY-MM-Do_hh_mm_ss",

    DEFAULT_ROLE: ['system_admin'], 

    ROLES_SELECTION: [
        'system_admin',
        'care_provider',
        'dev',
    ],

    HEALTH_STATUS_MAP: {
        0: 'normal',
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
        draggable: true
    },

    SHIFT_OPTIONS: [
        "day shift",
        "swing shift",
        "night shift",
    ],

    monitorType: {
        1: "geofence",
        2: "panic",
        4: "movement",
        8: "location",
        16: "bed",
    },

    monitorSettingType: {
        MOVEMENT_MONITOR: "movement monitor",
        LONG_STAY_IN_DANGER_MONITOR: "long stay in danger monitor",
        NOT_STAY_ROOM_MONITOR: "not stay room monitor",
        GEOFENCE_MONITOR: "geofence monitor",
    },

    monitorSettingUrlMap: {
        "movement monitor": "movement_config",
        "long stay in danger monitor": "location_long_stay_in_danger_config",
        "not stay room monitor": "location_not_stay_room_config",
        "geofence monitor": "geo_fence_config"
    },

    monitorSetting: {
        "movement monitor": "movement_config",
        "long stay in danger monitor": "location_long_stay_in_danger_config",
        location: "location_not_stay_room_config",
        geo: "geo_fence_config"
    },

    toastMonitorMap: {
        1: "warn",
        2: "error",
        4: "error",
        8: "error",
    },

    statusToCreatePdf: [
        "broken",
        "transferred"
    ],

    getShift: () => {
        const hour = moment().hours()
        if (hour < 17 && hour > 8){
            return config.SHIFT_OPTIONS[0]
        }else if(hour < 24 && hour > 17){
            return config.SHIFT_OPTIONS[1]
        }else{
            return config.SHIFT_OPTIONS[2]
        }
    },

    ...viewConfig,

    mapConfig,


}

export default config

