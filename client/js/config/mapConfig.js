/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        mapConfig.js

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

import siteConfig from '../../../site_module/siteConfig'
import viewConfig from './viewConfig'
import { monitorTypeChecker } from '../helper/dataTransfer'
import { RETURNED, RESERVE } from './wordMap'

/** Map configuration.
 *  Refer leaflet.js for more optional setting https://leafletjs.com/reference-1.5.0.html
 */
const mapConfig = {
    mapOptions: {
        crs: L.CRS.Simple,
        zoom: -5.5,
        minZoom: -5.46,
        maxZoom: 0,
        // zoomDelta: 1,
        zoomSnap: 0,
        zoomControl: true,
        attributionControl: false,
        dragging: true,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        maxBoundsOffset: [-10000, 10000],
        maxBoundsViscosity: 0.0,
    },

    browserMapOptions: {
        crs: L.CRS.Simple,
        zoom: -5.5,
        minZoom: -5.46,
        maxZoom: -4,
        zoomDelta: 0.25,
        zoomSnap: 0,
        zoomControl: true,
        attributionControl: false,
        dragging: true,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        maxBoundsOffset: [-10000, 10000],
        maxBoundsViscosity: 0.0,
    },

    tabletMapOptions: {
        crs: L.CRS.Simple,
        zoom: -6.6,
        minZoom: -6.8,
        maxZoom: -6,
        zoomDelta: 0.25,
        zoomSnap: 0,
        zoomControl: true,
        attributionControl: false,
        dragging: true,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        maxBoundsOffset: [-10000, 10000],
        maxBoundsViscosity: 0.0,
    },

    mobileMapOptions: {
        crs: L.CRS.Simple,
        zoom: -7.25,
        minZoom: -7.4,
        maxZoom: -7,
        zoomDelta: 0.25,
        zoomSnap: 0,
        zoomControl: true,
        attributionControl: false,
        dragging: true,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        maxBoundsOffset: [-10000, 10000],
        maxBoundsViscosity: 0.0,
    },

    bigScreenMapOptions: {
        crs: L.CRS.Simple,
        center: L.latLng(17000, 18000),
        zoom: -5.7,
        minZoom: -6,
        maxZoom: 0,
        zoomDelta: 0.25,
        zoomSnap: 0,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        doubleClickZoom: false,
        scrollWheelZoom: false,
    },

    /** Set the icon option for browser */
    iconOptions: {
        iconSize:
            [
                viewConfig.MARKER_SIZE_IN_DESKTOP,
                viewConfig.MARKER_SIZE_IN_DESKTOP,
            ] || 1,

        iconAnchor: [
            viewConfig.MARKER_SIZE_IN_DESKTOP / 2,
            viewConfig.MARKER_SIZE_IN_DESKTOP,
        ],

        showNumber: true,

        numberSize: 10,

        numberShiftTop: '',

        numberShiftLeft: '2%',

        specifiedNumberTop: '8%',

        /* Set the Marker dispersity that can be any positive number */
        markerDispersity: 60,

        geoFenceMarkerOptions: {
            color: 'rgba(0, 0, 0, 0)',

            fillColor: 'orange',

            fillOpacity: 0.4,

            radius: 20,
        },

        lbeaconMarkerOptions: {
            color: 'rgba(0, 0, 0, 0)',

            fillColor: 'orange',

            fillOpacity: 0.4,

            radius: 10,
        },

        lbeaconMarkerFailedOptions: {
            color: 'rgba(0, 0, 0, 0)',

            fillColor: 'red',

            fillOpacity: 0.4,

            radius: 10,
        },

        errorCircleOptions: {
            color: 'rgba(0, 0, 0, 0)',

            fillColor: 'orange',

            fillOpacity: 0.5,

            radius: 50,
        },
    },

    /** Set the icon option for mobile */
    iconOptionsInMobile: {
        iconSize:
            [
                viewConfig.MARKER_SIZE_IN_MOBILE,
                viewConfig.MARKER_SIZE_IN_MOBILE,
            ] || 1,

        iconAnchor: [
            viewConfig.MARKER_SIZE_IN_MOBILE / 2,
            viewConfig.MARKER_SIZE_IN_MOBILE,
        ],

        circleRadius: 8,

        circleRadiusForTablet: 15,

        showNumber: true,

        numberShiftTop: '-25%',

        numberShiftLeft: '3%',

        specifiedNumberTop: '-20%',

        numberSize: 8,

        /* Set the Marker dispersity that can be any positive number */
        markerDispersity: 60,

        geoFenceMarkerOptions: {
            color: 'rgba(0, 0, 0, 0)',

            fillColor: 'orange',

            fillOpacity: 0.4,

            radius: 8,
        },

        lbeaconMarkerOptions: {
            color: 'rgba(0, 0, 0, 0)',

            fillColor: 'orange',

            fillOpacity: 0.4,

            radius: 8,
        },
    },

    /** Set the icon options for big screen */
    iconOptionsInBigScreen: {
        iconSize: [50, 50] || 1,

        iconAnchor: [25, 50],

        showNumber: false,

        /* Set the Marker dispersity that can be any positive number */
        markerDispersity: 60,
    },

    /** Set the icon option for tablet */
    iconOptionsInTablet: {
        iconSize: [
            viewConfig.MARKER_SIZE_IN_TABLET,
            viewConfig.MARKER_SIZE_IN_TABLET,
        ],

        iconAnchor: [
            viewConfig.MARKER_SIZE_IN_TABLET / 2,
            viewConfig.MARKER_SIZE_IN_TABLET,
        ],

        showNumber: true,

        numberShiftTop: '-25%',

        numberShiftLeft: '3%',

        specifiedNumberTop: '-20%',

        numberSize: 8,

        /* Set the Marker dispersity that can be any positive number */
        markerDispersity: 60,

        geoFenceMarkerOptions: {
            color: 'rgba(0, 0, 0, 0)',

            fillColor: 'orange',

            fillOpacity: 0.4,

            radius: 10,
        },

        lbeaconMarkerOptions: {
            color: 'rgba(0, 0, 0, 0)',

            fillColor: 'orange',

            fillOpacity: 0.4,

            radius: 10,
        },
    },

    /** Set the representation of color pin
     * Icon options for AwesomeNumberMarkers
     * The process:
     * 1. Add the declaration of the desired icon option
     * 2. Add the CSS description in leafletMarker.css */
    iconColorList: [
        'black',
        'red',
        'orange',
        'blue',
        'grey',
        'white',
        'orchid',
        'mistyrose',
        'tan',
        'lightyello',
        'lavender',
        'lightblue',
        'yellowgreen',
        'sos',
        'female',
        'male',
        'blackRound',
        'whiteRound',
    ],

    iconColor: {
        normal: 'black',
        geofenceF: 'red',
        geofenceP: 'orange',
        searched: 'blue',
        unNormal: 'grey',
        sos: 'sos',
        number: 'white',
        female: 'female',
        male: 'male',
        female_1: 'female_2',
        male_1: 'male_1',
        blackBed: 'blackRound',
        whiteBed: 'whiteRound',

        // ["slateblue", "tan", "lightyellow", "lavender", "orange","lightblue", "mistyrose", "yellowgreen", "darkseagreen", "orchid"]
        pinColorArray: [
            'slateblue',
            'orange',
            'yellowgreen',
            'lightblue',
            'tan',
        ],
    },

    /** Set the schema to select the color pin */
    getIconColor: (item, hasColorPanel) => {
        if (item.panic) return this.iconColor.sos

        if (item.object_type == 0) {
            if (item.clear_bed) return mapConfig.iconColor.whiteBed
            if (monitorTypeChecker(item.monitor_type, 16))
                return mapConfig.iconColor.blackBed
            else if (hasColorPanel) return item.pinColor
            else if (item.searched) return mapConfig.iconColor.searched
            else if (item.status != RETURNED)
                return mapConfig.iconColor.unNormal
            return mapConfig.iconColor.normal
        } else if (item.object_type == 1) return mapConfig.iconColor.male
        else if (item.object_type == 2) return mapConfig.iconColor.female
    },

    getIconColorInBigScreen: (item, hasColorPanel) => {
        if (item.pinColor == -1) {
            return mapConfig.iconColor.normal
        }
        return mapConfig.iconColor.pinColorArray[item.pinColor]
    },

    areaOptions: Object.keys(siteConfig.areaModules).reduce((res, item) => {
        res[siteConfig.areaModules[item].id] = item
        return res
    }, {}),

    AREA_MODULES: siteConfig.areaModules,

    /* For test. To start object tracking*/
    startInteval: true,

    /* Set the tracking query inteval time(ms) */
    intervalTime: 1000,

    /** Radius of circle for collecting object based on the selection pin */
    PIN_SELECTION_RADIUS: 1000,

    popupOptions: {
        minWidth: '500',
        maxHeight: '300',
        className: 'customPopup',
        showNumber: false,
        autoPan: false,
    },

    /** Set the html content of popup of markers */
    getPopupContent: (object, objectList, locale) => {
        const content = `
            <div class="text-capitalize">
                <div class="font-size-120-percent">
                    ${object[0].location_description}
                </div>
                <hr/>
                <div class="popupContent custom-scrollbar max-height-30">
                    ${objectList
                        .map((item, index) => {
                            return `
                            <div id='${
                                item.mac_address
                            }' class="popupItem mb-2">
                                <div class="d-flex justify-content-start">
                                    <div class="min-width-1-percent">
                                        ${
                                            mapConfig.popupOptions.showNumber
                                                ? `${index + 1}.`
                                                : '&bull;'
                                        }
                                    </div>
                                    <div>
                                        ${
                                            item.object_type == 0
                                                ? `
                                                ${item.type},
                                                ${
                                                    locale.texts
                                                        .ASSET_CONTROL_NUMBER
                                                }: ${
                                                      viewConfig.ACNOmitsymbol
                                                  }${item.asset_control_number.slice(
                                                      -4
                                                  )},
                                                ${
                                                    item.status != RETURNED
                                                        ? `${
                                                              locale.texts[
                                                                  item.status.toUpperCase()
                                                              ]
                                                          }`
                                                        : `${item.residence_time}`
                                                }
                                                ${
                                                    item.status == RESERVE
                                                        ? `~ ${item.reserved_timestamp_final}`
                                                        : ''
                                                }
                                                ${
                                                    item.status == RESERVE
                                                        ? ` ${locale.texts.IS_RESERVED_FOR}`
                                                        : ''
                                                }

                                                ${
                                                    item.status == RESERVE
                                                        ? ` ${item.reserved_user_name}`
                                                        : ''
                                                }
                                            `
                                                : `
                                                ${item.name},
                                                ${locale.texts.PHYSICIAN_NAME}: ${item.physician_name},
                                                ${item.residence_time}
                                            `
                                        }
                                    </div>
                                </div>
                            </div>
                        `
                        })
                        .join('')}
                </div>
            </div>
        `
        return content
    },

    /** Set the html content of popup of Lbeacon markers */
    getLbeaconPopupContent: (lbeacon) => {
        return `
            <div>
                <div>
                    description: ${lbeacon.description}
                </div>
                <div>
                    coordinate: ${lbeacon.coordinate}
                </div>
                <div>
                    comment: ${lbeacon.comment}
                </div>
            </div>
        `
    },
}

export default mapConfig
