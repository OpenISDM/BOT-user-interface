import map from '../img/chunghua_christian_hospital.png';

import black_pin from '../img/black_pin_v2.svg'
import darkGrey_pin from '../img/darkGrey_pin_v2.svg';
import sos from '../img/sos.svg'
import geofence_fence from '../img/geo_fence_fence.svg'
import geofence_perimeter from '../img/geo_fence_perimeter.svg'
import white_pin from '../img/white_pin.svg';
import BOT_LOGO from '../img/BOT_LOGO_RED_MOD.png';
import HealthReport from './components/container/HealthReport';

import BladderScanner from '../img/objectImage/Bladder Scanner.jpg'
import Bed from '../img/objectImage/Bed.jpg'
import SonositeUltrasound from '../img/objectImage/Sononite Ultrasound.jpg'
import InfusionPump from '../img/objectImage/Infusion Pump.jpg'
import EKG from '../img/objectImage/EKG.jpg'
import Ultrasound from '../img/objectImage/Ultrasound.jpg'
import CPM from '../img/objectImage/CPM.png'


const config = {


    CustomizedSetting: {
        geofenceViolatioAlertTime: 30,
        objectNotFoundAlertTime: 30,
    },

    surveillanceMap: {

        /* Surveillance map source*/
        map: map,

        /* Map customization */
        mapOptions: {
            crs: L.CRS.Simple,

            minZoom: -8,
            maxZoom: 0,
            zoomDelta: 0.25,
            zoomSnap: 0,
            zoomControl: true,
            attributionControl: false,
            dragging: true,
            doubleClickZoom: false,
            scrollWheelZoom: false,

        },

        iconOptions: {
            iconSize: 10,
            stationaryIconUrl: black_pin,
            movinfIconUrl: darkGrey_pin,
            sosIconUrl: sos,
			geofenceIconFence: geofence_fence,
            geofenceIconPerimeter: geofence_perimeter,
            searchedObjectIconUrl: white_pin,
            showNumber: true,
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
        mapBound:[[-6000, -8000], [13350,25600]],
        
        /* Tracking object Rssi filter */
        locationAccuracyMapToDefault: {
            0: -100,
            1: -65,
            2: -50,
        },

        locationAccuracyMapToDB: {
            0: 'low_rssi',
            1: 'med_rssi',
            2: 'high_rssi',
        },

        /* Marker dispersity, can be any positive number */
        markerDispersity: 7,

        objectTypeSet: new Set(['electric sphygmomanometer', 'monitor', 'IV pump', 'syringe pump', 'blood warming device'])
        
    },

    transferredLocation: [
        "Yuanlin Christian Hospital",
        "Nantou Christial Hospital",
        "Yunlin Christian Hospital",
        "More"
    ],
    
    locale: {
        defaultLocale: 'en'
    },

    image: {
        logo: BOT_LOGO,
    },

    statusOption: [
        "Normal",
        "Broken",
        "Reserve",
        "Transferred"
    ],
    shiftOption: [
        'day shift',
        'night shift',
        'graveyard shift'
    ],

    companyName: 'BeDITech',

    systemAdmin: {

        openGlobalStateMonitor: !true,
    },

    healthReport: {
        pollLbeaconTabelIntevalTime: 60000,
        pollGatewayTableIntevalTime: 60000,
    }, 
    objectImage: {
        // 'Bladder scanner' : BladderScanner, 
        // 'Bed' : Bed,
        // 'SONOSITE Ultrasound': Ultrasound,
        // 'Infusion pump': InfusionPump,
        // 'Ultrasound': Ultrasound ,
        // 'EKG Machine': EKG,
        // 'CPM': CPM ,

        
    },
    objectImageTable:{
        BladderScanner : 'Bladder scanner', 
        Bed : 'Bed',
        SonositeUltrasound: 'SONOSITE Ultrasound',
        InfusionPump: 'Infusion pump',
        Ultrasound: 'Ultrasound',
        EKG: 'EKG Machine',
        CPM: 'CPM',
    },

    frequentSearch:{
        showImage: false,
        maxfrequentSearchLength: 6
    },

    searchResult:{
        showImage: false,
        style: 'table',
        displayMode: 'switch',
    },

    searchBarKeyWords: {
        type: [ 
                'electric sphygmomanometer', 
                'monitor', 
                'IV pump', 
                'syringe pump', 
                'blood warming device'
        ],
        status: [
                "Normal",
                "Broken",
                "Reserve",
                "Transferred"
        ],
        found : ["found",
                 "not found",   
        ],
        panic: ["panic"],
        geofence: ["geofence"]
    },
    branches: [
        {
            name: '員林基督教醫院',
            section: [
                'ICU'
            ]
        },
        {
            name: '雲林基督教醫院',
            section: [
                'ICU', 
                {
                    name: '員林基督教醫院',
                    section: [
                        'ICU',
                        '1',
                        'abbbbbbbbbbbbb',
                        {
                            name: '2',
                            section: [ '123']
                        }
                        
                    ]
                }
            ]
        },
        {
            name: '彰化基督教醫院',
            section: ['ICU', ]
        },
        {
            name: '南投基督教醫院',
            section: ['ICU']
        },
    ]
        

    



}

export default config

