import IIS_SINICA_FLOOR_FOUR_MAP from '../img/IIS_Newbuilding_4F_reBack.png';
import NTUH_YUNLIN_WARD_FIVE_B_MAP from '../img/NTUH_Yunlin_Branch_Map.png';
import NTHU_MAP from '../img/nthu.png';

import black_pin from '../img/colorPin/Black.svg'
import darkGrey_pin from '../img/colorPin/DarkGrey.svg';
import sos from '../img/colorPin/sos.svg'
import geofence_fence from '../img/geo_fence_fence.svg'
import geofence_perimeter from '../img/geo_fence_perimeter.svg'
import white_pin from '../img/white_pin.svg';
import BOT_LOGO from '../img/BOT_LOGO_RED.png';

const config = {
    
    areaOptions: {
        1: "IIS_SINICA_FLOOR_FOUR",
        2: "NTUH_YUNLIN_WARD_FIVE_B",
        3: "NTHU",
    },
    
    surveillanceMap: {

        /* Surveillance map source*/
        defaultArea: "IIS_SINICA_FLOOR_FOUR",
        defaultMap: NTHU_MAP,
        IIS_SINICA_FLOOR_FOUR: NTHU_MAP,
        NTUH_YUNLIN_WARD_FIVE_B: NTUH_YUNLIN_WARD_FIVE_B_MAP,
        NTHU: NTHU_MAP,

        mapSelection: {
            IIS_SINICA_FLOOR_FOUR: {
                map: NTHU_MAP,
                mapBound:[[0,0], [1354 ,2568]],
            },
            NTUH_YUNLIN_WARD_FIVE_B: {
                map: NTUH_YUNLIN_WARD_FIVE_B_MAP,
                mapBound:[[0,0], [45450,56160]],
            },
            NTHU: {
                map: NTHU_MAP,
                mapBound:[[0,0],[]],
            }
        },

        /* Map customization */
        mapOptions: {
            crs: L.CRS.Simple,
            center: L.latLng(-2000, -4000),
            zoom: -5,
            minZoom: -5,
            maxZoom: 0,
            zoomDelta: 0.25,
            zoomSnap: 0,
            zoomControl: false,
            attributionControl: false,
            dragging: false,
            doubleClickZoom: false,
            scrollWheelZoom: false
        },

        iconOptions: {
            iconSize: 50,
            // stationaryIconUrl: black_pin,
            // movinfIconUrl: darkGrey_pin,
            // sosIconUrl: sos,
			// geofenceIconFence: geofence_fence,
            // geofenceIconPerimeter: geofence_perimeter,
            // searchedObjectIconUrl: white_pin,
            showNumber: false,
        },

        iconColor: {
            stationary: 'black',
            geofenceF: 'red',
            geofenceP: 'orange',
            searched: 'blue',
            unNormal: 'grey',
            sos: 'sos',
            number: 'white',

            // ['slateblue', 'tan', 'lightyellow', 'lavender', 'orange','lightblue', 'mistyrose', 'yellowgreen', 'darkseagreen', 'orchid']
            pinColorArray: ['orchid','mistyrose', 'tan', 'lightyellow', 'lavender','lightblue', 'yellowgreen']
        },

        /* For test. To start object tracking*/
        startInteval: true,

        /* Object tracking query inteval */
        intevalTime: 1000,

        /* Bound of surveillance map*/
        mapBound:[[0,0], [21130,35710]],

        // mapBound:[[0,0], [651,1584]],
        // mapBound:[[2000,-8500], [14067,18428]],

        
        /* Tracking object Rssi filter */
        locationAccuracyMapToDefault: {
            0: -100,
            1: -60,
            2: -50,
        },

        locationAccuracyMapToDB: {
            0: 'low_rssi',
            1: 'med_rssi',
            2: 'high_rssi',
        },

        /* Marker dispersity, can be any positive number */
        markerDispersity: 5,

        // objectTypeSet: new Set(['Bed', 'EKG Machine', 'Infusion pump', 'SONOSITE Ultrasound', 'Ultrasound', 'Bladder scanner', 'CPM'])
        objectType: ['三合一Monitoring', 'EKG', 'IV Pump', '烤燈', '血壓血氧監視器', '電擊器', 'CPM']

        
    },

    site: 'NTU Hospital Yunlin branch ward 5B',

    objectStatus: {
        PERIMETER: 'perimeter',
        FENCE: 'fence',
        NORMAL: 'normal',
        BROKEN: 'broken',
        RESERVE: 'reserve',
        TRANSFERRED: 'transferred',   
    },

    objectManage: {

        /* The definition of the time period that the object is not scanned by lbeacon
         * The time period unit is seconds */
        notFoundObjectTimePeriod: 30,

        geofenceViolationTimePeriod: 300,

        sosTimePeriod: 300,

        objectManagementRSSIThreshold: 0
    },

    transferredLocation: [
        "Yuanlin Christian Hospital",
        "NTU Hospital Yunlin branch",
        "NTU Hospital Taipei",
    ],
    
    locale: {
        defaultLocale: 'tw',
    },

    defaultRSSIThreshold: 1,

    image: {
        logo: BOT_LOGO,
    },

    companyName: 'BeDITech',

    systemAdmin: {

        openGlobalStateMonitor: !true,

        refreshSearchResult: true,

    },

    healthReport: {
        startInteval: false,
        pollLbeaconTabelIntevalTime: 60000,
        pollGatewayTableIntevalTime: 60000,
    },

    userPreference: {
        searchHistoryNumber: 4,
        cookies: {
            userInfo: {
                NAME: name,
                SEARCH_HISTORY: 'search_history',
                MY_DEVICES: 'mydevice'
            }
        },
        searchResultForm: 'List'
    },

    frequentSearchOption: {
        MY_DEVICES: 'my devices',
        ALL_DEVICES: 'all devices'
    },

    searchResult:{
        showImage: false,
        style: 'list',
        displayMode: 'showAll',
    },

    monitorType: {
        // 0: 'normal',
        1: 'geofence',
        2: 'panic',
        4: 'movement',
    },

    shiftOption: [
        'day shift',
        'swing shift',
        'night shift',
    ],

    shiftRecordFileDir: 'save_file_path',
    searchResultFileDir: 'search_result_dir',

    shiftRecordFileNameTimeFormat: 'MM_DD_YYYY',
    shiftRecordPdfContentTimeFormat: 'MM/DD/YYYY',

    roles: [
        'guest',
        'care_provider',
        'system_admin'
    ],

    defaultRole: 'care_provider', 


    pdfFormat: (userInfo, foundResult, notFoundResult, locale, time, option) => {
        const hasFoundResult = foundResult.length !== 0
        const hasNotFoundResult = notFoundResult.length !== 0
        const title = config.getPDFTitle(userInfo, locale, time, option)

        let foundTitle = hasFoundResult
            ?   `<h3 style='text-transform: capitalize; margin-bottom: 5px;'>
                    ${locale.texts.DEVICES_IN} ${locale.texts[config.site.toUpperCase().replace(/ /g, '_')]}
                </h3>`
            :   '';
        let foundData = hasFoundResult 
            ?   foundResult.map((item, index) => {
                    return `
                        <div key=${index} style='text-transform: capitalize;'>
                            ${index + 1}.${item.name}, 
                            ${locale.texts.LAST_FOUR_DIGITS_IN_ACN}: ${item.last_four_acn}, 
                            ${locale.texts.NEAR}${item.location_description}
                        </div>
                    `
                    
                }).join(' ')
            :   ''
        let notFoundTitle = hasNotFoundResult 
            ?   `<h3 className='mt-1' style='text-transform: capitalize; margin-bottom: 5px;'>
                    ${locale.texts.DEVICES_NOT_IN} ${locale.texts[config.site.toUpperCase().replace(/ /g, '_')]}
                </h3>`
            :   '';
        let notFoundData = hasNotFoundResult 
            ?   notFoundResult.map((item, index) => {
                    return `
                        <div key=${index} style='text-transform: capitalize;'>
                            ${index + 1}.${item.name}, 
                            ${locale.texts.LAST_FOUR_DIGITS_IN_ACN}: ${item.last_four_acn}, 
                            ${locale.texts.NEAR}${item.location_description}
                        </div>
                    `
                }).join(' ')
            :   '';
        let pdfFormat = title + foundTitle + foundData + notFoundTitle + notFoundData
        return pdfFormat
    },

    getPDFTitle: (userInfo, locale, time, option) => {
        let timestamp = `<div style='text-transform: capitalize;'>${locale.texts.DATE_TIME}: ${time}</div>`
        let header = ``;
        switch(option) {
            case 'shiftChange':
                const nextShiftIndex = (config.shiftOption.indexOf(userInfo.shift) + 1) % config.shiftOption.length
                const nextShift = locale.texts[config.shiftOption[nextShiftIndex].toUpperCase().replace(/ /g, '_')]
                const thisShift = locale.texts[userInfo.shift.toUpperCase().replace(/ /g, '_')]
                header += `<h1 style='text-transform: capitalize;'>
                        ${locale.texts.SHIFT_CHANGE_RECORD}-${locale.texts.CONFIRM_BY}
                    </h1>`
                let shift = `<div style='text-transform: capitalize;'>
                        ${locale.texts.SHIFT}: ${thisShift} ${locale.texts.SHIFT_TO} ${nextShift}
                    </div>`
                let checkby = `<div style='text-transform: capitalize;'>
                        ${locale.texts.DEVICE_LOCATION_STATUS_CHECKED_BY}: ${userInfo.name}, ${thisShift}
                    </div>`
                return header + timestamp + shift + checkby
            case 'searchResult':
                header += `<h1 style='text-transform: capitalize;'>
                        ${locale.texts.SEARCH_RESULT}
                    </h1>`
                return header + timestamp


        }

    }
}

export default config

