import BOT_LOGO from "../img//logo/BOT_LOGO_RED.png";
import moment from 'moment'
import siteConfig from '../../site_module/siteConfig';
import React from 'react'

const config = {

    version: "v1.1 b.1900",
    
    objectStatus: {
        PERIMETER: "perimeter",
        FENCE: "fence",
        NORMAL: "normal",
        BROKEN: "broken",
        RESERVE: "reserve",
        TRANSFERRED: "transferred",   
    },

    statusOptions: [
        'normal',
        'broken',
        'reserve',
        'transferred'
    ],

    defaultUser: {
        roles: "guest",
        areas_id: [0],
        permissions:[
            "form:view",
        ],
        locale: 'tw',
        main_area: 0,
    },

    /** Reserved Object interval time in minutes */
    reservedInterval: 30,

    /** Extend object reserved time in minutes  */
    reservedDelayTime: 10,

    ACNOmitsymbol: 'XXXXXX',
    
    locale: {
        defaultLocale: 'tw' ,
    },

    image: {
        logo: BOT_LOGO,
    },

    systemAdmin: {

        openGlobalStateMonitor: !true,

        refreshSearchResult: true,

    },


    getLbeaconDataIntervalTime: process.env.GET_LBEACON_DATA_INTERVAL_TIME_IN_MILLI_SEC || 3600000,

    getGatewayDataIntervalTime: process.env.GET_GATEWAY_DATA_INTERVAL_TIME_IN_MILLI_SEC || 3600000,

    frequentSearchOption: {
        MY_DEVICES: "my devices",
        ALL_DEVICES: "all devices",
        MY_PATIENTS: "my patients",
        ALL_PATIENTS: "all patients",
        OBJECTS: "objects"
    },

    searchResult:{
        showImage: false,
        style: "list",
        displayMode: "showAll",
    },

    searchResultProportion: '32vh',

    monitorType: {
        1: "geofence",
        2: "panic",
        4: "movement",
        8: "location",
    },

    monitor: {
        geofence: {
            typeId: 1,
            name: "geofence",
            readableName: "geofence",
            api: "geo_fence_config",
        },
        panic: {
            typeId: 2,
            name: "panic",
            readableName: "panic",
            api: null,
        },
        movement: {
            typeId: 4,
            name: "movement",
            readableName: "movement monitor",
            api: "location_not_stay_room_config",
        },
        location: {
            typeId: 8,
            name: "locationMonitor",
            readableName: "not stay room monitor",
            api: "location_not_stay_room_config"
        }
    },


    monitorOptions: [
        'geofence',
        'panic',
        'movement',
        'location'
    ],

    monitorTypeMap: {
        object: [1],
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

    shiftOption: [
        "day shift",
        "swing shift",
        "night shift",
    ],

    shiftRecordFolderPath: "shift_record",
    searchResultFolderPath: "search_result",

    folderPath: {

        broken: `${process.env.DEFAULT_FOLDER}/edit_object_record`,

        transferred: `${process.env.DEFAULT_FOLDER}/edit_object_record`,

        shiftChange: `${process.env.DEFAULT_FOLDER}/shift_record`,

        searchResult: `${process.env.DEFAULT_FOLDER}/search_result`,

        patientRecord: `${process.env.DEFAULT_FOLDER}/patient_record`,

        trackingRecord: `${process.env.DEFAULT_FOLDER}/tracking_record`
    },

    shiftRecordFileNameTimeFormat: "MM_DD_YYYY",
    shiftRecordPdfContentTimeoFrmat: "MM/DD/YYYY",
    geoFenceViolationTimeFormat: "H:mm MM/DD",
    confirmFormTimeFormat: "LLLL",
    shiftChangeRecordTimeFormat: "LLL",
    pdfFileContentTimeFormat: "LLL",
    pdfFileNameTimeFormat: "YYYY-MM-Do_hh_mm_ss",
    regularTimeFormat: "lll",

    roles: [
        "guest",
        "care_provider",
        "system_admin"
    ],

    defaultRole: ["care_provider"], 

    mobileWindowWidth: 600,

    objectType: {
        0: "medicalDevice",
        1: "inpatient"
    },

    healthStatusMap: {
        0: 'normal',
        9999: 'n/a',
    },

    productVersionMap: {
        9999: 'n/a',
    },

    toastProps: {
        position: "bottom-right",
        autoClose: false,
        newestOnTop: false,
        closeOnClick: true,
        rtl: false,
        pauseOnVisibilityChange: true,
        draggable: true
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
            return config.shiftOption[0]
        }else if(hour < 24 && hour > 17){
            return config.shiftOption[1]
        }else{
            return config.shiftOption[2]
        }
    },

    /** Create pdf package, including header, body and the pdf path
     * options include shiftChange, searchResult, broken report, transffered report
     */
    getPdfPackage: (option, user, data, locale, signature, additional) => {
        const header = config.pdfFormat.getHeader(user, locale, option, signature, additional, data, )
        const body = config.pdfFormat.getBody[option](data, locale, user, location, signature, additional)
        const path = config.pdfFormat.getPath(option, additional).path
        const pdf = header + body
        
        return {
            pdf,
            path,
            options: config.pdfFormat.pdfOptions
        }
    },

    /** Pdf format config */
    pdfFormat: {

        getHeader: (user, locale, option, signature, additional, data) => {
            let title = config.pdfFormat.getTitle(option, locale)
            let subTitle = config.pdfFormat.getSubTitle[option](locale, user, signature, additional, data)
            return title + subTitle
        },

        getTitle: (option, locale) => {
            return `
                <h3 style="text-transform: capitalize;">
                    ${locale.texts[config.pdfFormat.pdfTitle[option]].toUpperCase()}
                </h3>
            `
        },
    
        pdfTitle: {
            broken: "REQUEST_FOR_DEVICE_REPARIE",
            transferred: "DEVICE_TRANSFER_RECORD",
            shiftChange: "SHIFT_CHANGE_RECORD",
            searchResult: "SEARCH_RESULT",
            patientRecord: "PATIENT_RECORD",
            trackingRecord: "TRACKING_RECORD",
        },
    

        getPath: (option, additional) =>{
            let directory = config.folderPath[option]
            let name = config.pdfFormat.getFileName[option](option, additional)
            let path = `${directory}/${name}`
            return {
                directory,
                name,
                path
            }
        },
    
        getFileName: {
            broken: (option) => {
                return `${option}_report_${moment().format(config.pdfFileNameTimeFormat)}.pdf`
            },
            transferred: (option) => {
                return `${option}_report_${moment().format(config.pdfFileNameTimeFormat)}.pdf`
            },
            shiftChange: (option, additional) => {
                return `${additional.name}_${moment().format(config.pdfFileNameTimeFormat)}.pdf`
            },
            searchResult: option => {
                return `${option}_${moment().format(config.pdfFileNameTimeFormat)}.pdf`
            },
            patientRecord: option => {
                return `${option}_${moment().format(config.pdfFileNameTimeFormat)}.pdf`
            },
            trackingRecord: (option, additional) => {
                return `${option}_${moment().format(config.pdfFileNameTimeFormat)}.${additional.extension}`
            }
            
        },
    
        getBody: {
            broken: (data, locale) => {
                let title = config.pdfFormat.getBodyItem.getBodyTitle("broken device list", locale)
                let list = config.pdfFormat.getBodyItem.getDataContent(data, locale)
                let notes = config.pdfFormat.getBodyItem.getNotes(data, locale)
                return title + list + notes
            },
            transferred: (data, locale, user, location,signature) => {

                let area = data[0].transferred_location_label
                let signature_title = config.pdfFormat.getBodyItem.getBodyTitle("transferred to", locale, area)
                let list_title = config.pdfFormat.getBodyItem.getBodyTitle("transferred device list", locale)
                let signatureName = config.pdfFormat.getBodyItem.getSignature(locale,signature)
                let list = config.pdfFormat.getBodyItem.getDataContent(data, locale,signature)
                let notes = config.pdfFormat.getBodyItem.getNotes(data, locale,signature)
                return signature_title + signatureName + list_title + list + notes
            },

            shiftChange: (data, locale, user) => {
                let area =  locale.texts[config.mapConfig.areaOptions[parseInt(user.areas_id[0])]]
                let foundTitle = config.pdfFormat.getBodyItem.getBodyTitle(
                    "devices found", 
                    locale, 
                    area,
                    data.searchResult.foundResult.length !== 0
                )
                let foundResultList = config.pdfFormat.getBodyItem.getDataContent(
                    data.searchResult.foundResult, 
                    locale
                )
                let notFoundTitle = config.pdfFormat.getBodyItem.getBodyTitle(
                    "devices not found", 
                    locale, 
                    area,
                    data.searchResult.notFoundResult.length !== 0
                )
                let notFoundResultList = config.pdfFormat.getBodyItem.getDataContent(
                    data.searchResult.notFoundResult, 
                    locale
                )
                let patientFoundTitle  = config.pdfFormat.getBodyItem.getBodyTitle(
                    "patients found", 
                    locale, 
                    area,
                    data.patients.foundPatients.length !== 0
                )

                let patientFoundList = config.pdfFormat.getBodyItem.getPatientContent(
                    data.patients.foundPatients, 
                    locale
                )

                let patientNotFoundTitle  = config.pdfFormat.getBodyItem.getBodyTitle(
                    "patients not found", 
                    locale, 
                    area,
                    data.patients.notFoundPatients.length !== 0
                )

                let patientNotFoundList = config.pdfFormat.getBodyItem.getPatientContent(
                    data.patients.notFoundPatients, 
                    locale
                )

                return (
                    foundTitle + 
                    foundResultList + 
                    notFoundTitle + 
                    notFoundResultList + 
                    patientFoundTitle + 
                    patientFoundList +
                    patientNotFoundTitle +
                    patientNotFoundList
                )
            },

            searchResult: (data, locale, user, location) => {
                let area =  locale.texts[config.mapConfig.areaOptions[parseInt(user.areas_id[0])]]
                let foundTitle = config.pdfFormat.getBodyItem.getBodyTitle(
                    "devices found", 
                    locale, 
                    area, 
                    data.foundResult.length !== 0
                )
                let foundResultList = config.pdfFormat.getBodyItem.getDataContent(data.foundResult, locale)
                let notFoundTitle = config.pdfFormat.getBodyItem.getBodyTitle(
                    "devices not found", 
                    locale, 
                    area,
                    data.notFoundResult.length !== 0
                )
                let notFoundResultList = config.pdfFormat.getBodyItem.getDataContent(data.notFoundResult, locale)
                return foundTitle + foundResultList + notFoundTitle + notFoundResultList
            },

            patientRecord: (data, locale, user) => {
                let title = config.pdfFormat.getBodyItem.getBodyTitle(
                    "patient historical record", 
                    locale, 
                    '',
                    true
                )
                let content = config.pdfFormat.getBodyItem.getPatientData(
                    data, 
                    locale
                )

                return title + content
            },

            trackingRecord: (data, locale, user, location, signature, additional) => {
                let table;
                switch(additional.type) {
                    case 'name':
                        table = config.pdfFormat.getBodyItem.getLocationHistoryByNameAsTable(data, locale)
                        break;
                    case 'uuid':
                        table = config.pdfFormat.getBodyItem.getLocationHistoryByUUIDAsTable(data, locale)
                }                
                return table
            },
        },
        getBodyItem: {

            getBodyTitle: (title, locale, area, hasTitle = true) => {
                return hasTitle 
                    ?   `
                        <h4 style="
                            text-transform: capitalize;
                            margin-bottom: 5px; 
                            padding-bottom: 5px;
                            border-bottom: 1px solid black;"
                        >
                            ${locale.texts[title.toUpperCase().replace(/ /g, '_')].toUpperCase()}
                            ${area ? area : ''}
                        </h4>
                    `
                    : ``;
            },
    
            getDataContent: (data, locale) => {
                return data.map((item, index) => {
                    return `
                        <div style="margin-bottom: 10px;" key=${index}>
                            ${index + 1}. 
                            &nbsp;
                            ${item.name}, 
                            ${locale.texts.LAST_FOUR_DIGITS_IN_ACN}: ${item.last_four_acn.slice(-4)}, 
                            ${locale.texts.NEAR} ${item.location_description},
                            ${item.residence_time}
                        </div>
                    `
                }).join(" ")
            },

            getLocationHistoryByName: (data, locale) => {
                return data.map((item, index) => {
                    return `
                        <div style="margin-bottom: 10px;" key=${index}>
                            ${index + 1}. 
                            &nbsp;
                            ${item.area}, 
                            ${locale.texts.LAST_FOUR_DIGITS_IN_ACN}: ${item.last_four_acn.slice(-4)}, 
                            ${locale.texts.NEAR} ${item.location_description},
                            ${item.residence_time}
                        </div>
                    `
                }).join(" ")
            },

            getLocationHistoryByNameAsTable: (dataObject, locale) => {
                let {
                    columns, 
                    data
                } = dataObject

                let headers = columns.map(field => {
                    return `
                        <th 
                            style="text-align: left"
                        >
                            ${field.Header}
                        </th>
                    `
                }).join(" ")
                return `
                    <table 
                        style="width:100%; font-size: 0.8rem;"
                    >
                        ${headers}
                        ${data.map((item, index) => {
                            return `
                                <tr>
                                    <td>${item.area}</td>
                                    <td>${item.description}</td>
                                    <td>${item.startTime}</td>
                                    <td>${item.endTime}</td>
                                    <td>${item.residenceTime}</td>
                                </tr>
                            `
                        }).join(' ')}
                    </table>
                `
            },

            getLocationHistoryByUUIDAsTable: (dataObject, locale) => {
                let {
                    columns, 
                    data
                } = dataObject

                let headers = columns.map(field => {
                    return `
                        <th
                            style="text-align: left"
                        >
                            ${field.Header}
                        </th>
                    `
                }).join(" ")
                return `
                    <table 
                        style="width:100%; font-size: 0.8rem;"
                    >
                        ${headers}
                        ${data.map((item, index) => {
                            return `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${item.name}</td>
                                    <td>${item.mac_address}</td>
                                    <td>${item.area}</td>
                                    <td>${item.description}</td>
                                </tr>
                            `
                        }).join(' ')}
                    </table>
                `
            },

            getPatientContent: (data, locale) => {
                return data.map((item, index) => {
                    return `
                        <div style="margin-bottom: 10px;" key=${index}>
                            ${index + 1}. 
                            &nbsp;
                            ${item.name}, 
                            ${locale.texts.LAST_FOUR_DIGITS_IN_ACN}: ${item.last_four_acn.slice(-4)}, 
                            ${locale.texts.NEAR} ${item.location_description},
                            ${item.residence_time}
                        </div>
                    `
                }).join(" ")
            },

            getPatientData: (data, locale) => {
                return data.records.map((item, index) => {
                    return `
                        <div style="margin-bottom: 15px;" key=${index}>
                            <div 
                                style="margin-bottom: 5px; margin-top: 0px;"
                            >
                                &bull;
                                <div
                                    style="display: inline-block"
                                >
                                    ${item.recorded_user}
                                </div>
                                &nbsp;
                                <div style="font-size: 0.8em;display: inline-block;">
                                    ${moment(item.created_timestamp).locale(locale.abbr).format('lll')}
                                </div>
                            </div>
                            <div 
                                style="text-align: justify;text-justify:inter-ideograph;font-size: 0.8em"
                                class="text-muted"
                            >
                                ${item.record}
                            </div>
                        </div>
                    `
                }).join(" ")
            },
    
            getNotes: (data, locale) => {
                return `
                    <h3 style="text-transform: capitalize; margin-bottom: 5px; font-weight: bold">
                        ${data[0].notes ? `${locale.texts.NOTE}:` : ''}
                    </h3>
                    <div style="margin: 10px;">
                        ${data[0].notes ? data[0].notes : ""}
                    </div>
                `
            },

            getSignature: (locale,signature) => {
                return `
                    <div style="text-transform: capitalize; margin: 10px width: 200px;">
                        <div style="text-transform: capitalize; margin: 10px width: 100%;">
                            <p style="display: inline">${locale.texts.RECEIVER_ID}:</p>
                            <input 
                                style="
                                    width: 100%; 
                                    border-bottom: 1px solid black; 
                                    border-top: 0;
                                    border-left: 0;
                                    border-right: 0;
                                    display: inline-block"
                            />
                        </div>
                        <div style="text-transform: capitalize; margin: 10px width: 100%;">
                            <p style="display: inline">${locale.texts.RECEIVER_NAME}:</p>
                            <input 
                                style="
                                    width: 100%; 
                                    border-bottom: 1px solid black; 
                                    border-top: 0;
                                    border-left: 0;
                                    border-right: 0;
                                    display: inline-block"
                            />   
                        </div>
                        <div style="text-transform: capitalize; margin: 10px width: 100%;">
                            <p style="display: inline">${locale.texts.RECEIVER_SIGNATURE}:</p>
                            <input 
                                style="
                                    width: 100%; 
                                    border-bottom: 1px solid black; 
                                    border-top: 0;
                                    border-left: 0;
                                    border-right: 0;
                                    display: inline-block";
                                    value = ${signature}
                            />                  
                        </div>
                    </div>
                `
            }
        },
    
        getSubTitle: {
            shiftChange: (locale, user, signature, shiftOption) => {
                let timestamp = config.pdfFormat.getTimeStamp(locale)

                const lastShiftIndex = (config.shiftOption.indexOf(shiftOption.value) + 2) % config.shiftOption.length
                const lastShift = locale.texts[config.shiftOption[lastShiftIndex].toUpperCase().replace(/ /g, "_")]
                const thisShift = shiftOption.label
                let shift = `<div style="text-transform: capitalize;">
                        ${locale.texts.SHIFT}: ${lastShift} ${locale.texts.SHIFT_TO} ${thisShift}
                    </div>`
                let confirmedBy = `<div style="text-transform: capitalize;">
                    ${locale.abbr == 'en' 
                        ? `${locale.texts.CONFIRMED_BY} ${signature}`
                        : `${locale.texts.CONFIRMED_BY}: ${signature}`
                    }
                </div>`
                let checkby = `<div style="text-transform: capitalize;">
                        ${locale.texts.DEVICE_LOCATION_STATUS_CHECKED_BY}: ${user.name}, ${shiftOption.label}
                    </div>`
                return timestamp + confirmedBy + shift + checkby
            },
    
            searchResult: (locale, user) => {
                let timestamp = config.pdfFormat.getTimeStamp(locale)
                let username = config.pdfFormat.getSubTitleInfo.username(locale, user)
                return timestamp + username
            },
            broken: (locale, user) => {
                let timestamp = config.pdfFormat.getTimeStamp(locale)
                let username = config.pdfFormat.getSubTitleInfo.username(locale, user)
                return timestamp + username
            },
            transferred: (locale, user) => {
                let timestamp = config.pdfFormat.getTimeStamp(locale)
                let username = config.pdfFormat.getSubTitleInfo.username(locale, user)
                return timestamp + username
            },

            patientRecord: (locale, user, name, additional, data) => {
                let timestamp = config.pdfFormat.getTimeStamp(locale)
                let patientName = config.pdfFormat.getSubTitleInfo.patientName(locale, data)
                let providerName = config.pdfFormat.getSubTitleInfo.providerName(locale, data)
                let patientID = config.pdfFormat.getSubTitleInfo.patientID(locale, data)
                return timestamp + patientName + patientID + providerName
            },

            trackingRecord: (locale, user, name, additional, data) => {
                let {
                    key,
                    startTime,
                    endTime,
                    mode,
                } = additional

                let timestamp = config.pdfFormat.getTimeStamp(locale)
                key = config.pdfFormat.getSubTitleInfo.field(locale, 'KEY', key)
                startTime = config.pdfFormat.getSubTitleInfo.field(locale, 'START_TIME', startTime)
                endTime = config.pdfFormat.getSubTitleInfo.field(locale, 'END_TIME', endTime)

                return timestamp + key + startTime + endTime
            }
        },
    
        getSubTitleInfo: {
            username: (locale, user) => {
                return `
                    <div style="text-transform: capitalize;">
                        ${locale.texts.USERNAME}: ${user.name}
                    </div>
                `
            },
            patientName: (locale, object) => {
                return `
                    <div style="text-transform: capitalize;">
                        ${locale.texts.PATIENT_NAME}: ${object.name}
                    </div>
                `
            },
            patientID: (locale, object) => {
                return `
                    <div style="text-transform: capitalize;">
                        ${locale.texts.PATIENT_NUMBER}: ${object.asset_control_number}
                    </div>
                `
            },
            providerName: (locale, object) => {
                return `
                    <div style="text-transform: capitalize;">
                        ${locale.texts.PHYSICIAN_NAME}: ${object.physician_name}
                    </div>
                `
            },
            startTime: (locale, value) => {
                return `
                    <div style="text-transform: capitalize;">
                        ${locale.texts.START_TIME}: ${value}
                    </div>
                `
            },
            field: (locale, key, value) => {
                return `
                    <div style="text-transform: capitalize;">
                        ${locale.texts[key]}: ${value}
                    </div>
                `
            }
        },

        /** The pdf option setting in html-pdf */
        pdfOptions: {
            "format": "A4",
            "orientation": "portrait",
            "border": "1cm",
            "timeout": "12000"
        },

        getTimeStamp: (locale) => {
            return `
                <div style="text-transform: capitalize;">
                    ${locale.texts.DATE_TIME}: ${moment().locale(locale.abbr).format('LLL')}
                </div>
            `
        },
    },


    /** Map configuration.
     *  Refer leaflet.js for more optional setting https://leafletjs.com/reference-1.5.0.html
     */
    mapConfig: {
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
            maxBoundsViscosity: 0.0
        },

        browserMapOptions: {
            crs: L.CRS.Simple,
            zoom: -5.5,
            minZoom: -5.46,
            maxZoom: -5,
            zoomDelta: 0.25,
            zoomSnap: 0,
            zoomControl: true,
            attributionControl: false,
            dragging: true,
            doubleClickZoom: false,
            scrollWheelZoom: false,
            maxBoundsOffset: [-10000, 10000],
            maxBoundsViscosity: 0.0
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
            maxBoundsViscosity: 0.0
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
            maxBoundsViscosity: 0.0
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
            scrollWheelZoom: false
        },

        /** Set the icon option for browser */
        iconOptions: {

            iconSize: [process.env.MARKER_SIZE_IN_DESKTOP, process.env.MARKER_SIZE_IN_DESKTOP] || 1,

            iconAnchor: [process.env.MARKER_SIZE_IN_DESKTOP / 2, process.env.MARKER_SIZE_IN_DESKTOP],

            showNumber: true,

            numberSize: 10, 

            numberShiftTop: '',

            numberShiftLeft: '2%',

            specifiedNumberTop: '8%',

            /* Set the Marker dispersity that can be any positive number */
            markerDispersity: 100,

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

                radius: 20,
            },
        },

        /** Set the icon option for mobile */
        iconOptionsInMobile: {

            iconSize: [process.env.MARKER_SIZE_IN_MOBILE, process.env.MARKER_SIZE_IN_MOBILE] || 1,

            iconAnchor: [process.env.MARKER_SIZE_IN_MOBILE / 2, process.env.MARKER_SIZE_IN_MOBILE],

            circleRadius: 8,

            circleRadiusForTablet: 15,

            showNumber: true,

            numberShiftTop: '-25%',

            numberShiftLeft: '3%',

            specifiedNumberTop: '-20%',

            numberSize: 8, 

            /* Set the Marker dispersity that can be any positive number */
            markerDispersity: 100,

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
            markerDispersity: 100,
        }, 

        /** Set the icon option for tablet */
        iconOptionsInTablet: {

            iconSize: [process.env.MARKER_SIZE_IN_TABLET, process.env.MARKER_SIZE_IN_TABLET],

            iconAnchor: [process.env.MARKER_SIZE_IN_TABLET / 2, process.env.MARKER_SIZE_IN_TABLET],

            showNumber: true,

            numberShiftTop: '-25%',

            numberShiftLeft: '3%',

            specifiedNumberTop: '-20%',

            numberSize: 8, 

            /* Set the Marker dispersity that can be any positive number */
            markerDispersity: 100,

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
            "black",
            "red",
            "orange",
            "blue",
            "grey",
            "white",
            "orchid",
            "mistyrose",
            "tan",
            "lightyello",
            "lavender",
            "lightblue",
            "yellowgreen",
            "sos",
            "female",
            "male"
        ],

        iconColor: {
            normal: "black",
            geofenceF: "red",
            geofenceP: "orange",
            searched: "blue",
            unNormal: "grey",
            sos: "sos",
            number: "white",
            female: "female",
            male: "male",
            female_1: "female_2",
            male_1: "male_1",

            // ["slateblue", "tan", "lightyellow", "lavender", "orange","lightblue", "mistyrose", "yellowgreen", "darkseagreen", "orchid"]
            pinColorArray: ["orchid", "tan", "lightyellow", "lavender","lightblue", "yellowgreen"]

        },

        /** Set the schema to select the color pin */
        getIconColor: (item, hasColorPanel) => {
            if (item.panic) return config.mapConfig.iconColor.sos

            if (item.object_type == 0) {
                if (item.searched && hasColorPanel) return item.pinColor
                else if (item.searched) return config.mapConfig.iconColor.searched
                else if (item.status !== config.mapConfig.objectStatus.NORMAL) return config.mapConfig.iconColor.unNormal
                else return config.mapConfig.iconColor.normal
            } 
            else if (item.object_type == 1) return config.mapConfig.iconColor.male
            else if (item.object_type == 2) return config.mapConfig.iconColor.female
        },

        getIconColorInBigScreen: (item, hasColorPanel) => {

            if(item.pinColor == -1){
                return config.mapConfig.iconColor.normal
            }else{
                return config.mapConfig.iconColor.pinColorArray[item.pinColor]
            }
        },

        defaultAreaId: process.env.DEFAULT_AREA_ID,
    
        gender: {
            MAN: {
                id: 1,
            },
            GIRL:{
                id: 2,
            },
        },

        areaOptions: Object.keys(siteConfig.areaModules)
            .reduce((res, item) => {
                res[siteConfig.areaModules[item].id] = item
                return res
            }, {}),

        areaModules: siteConfig.areaModules,

        /* For test. To start object tracking*/
        startInteval: true,

        /* Set the tracking query inteval time(ms) */
        intervalTime: process.env.OBJECT_TRACKING_INTERVAL_TIME_IN_MILLI_SEC,

        objectStatus: {
            PERIMETER: "perimeter",
            FENCE: "fence",
            NORMAL: "normal",
            BROKEN: "broken",
            RESERVE: "reserve",
            TRANSFERRED: "transferred",   
        },

        popupOptions: {
            minWidth: "500",
            maxHeight: "300",
            className : "customPopup",
            showNumber: false,
            autoPan: false
        },

        /** Set the html content of popup of markers */
        getPopupContent: (object, objectList, locale) => {
            const content = `
                <div class="text-capitalize">
                    <div class="popupTitle">
                        ${object[0].location_description}
                    </div>
                    <div class="popupContent"> 
                        ${objectList.map((item, index) => {
                            return  `
                                <div id='${item.mac_address}' class="popupItem">
                                    <div class="d-flex justify-content-start">
                                        <div class="popupIndex">
                                            ${config.mapConfig.popupOptions.showNumber
                                                ?   `${index + 1}.`
                                                :   `&bull;`
                                            }
                                        </div>
                                        <div>
                                            ${item.object_type == 0
                                                ?   `
                                                    ${item.type},
                                                    ${locale.texts.ASSET_CONTROL_NUMBER}: ${config.ACNOmitsymbol}${item.last_four_acn.slice(-4)},
                                                    ${item.status !== "normal" 
                                                        ? `${locale.texts[item.status.toUpperCase()]}`
                                                        : `${item.residence_time}`    
                                                    }
                                                    ${item.status == "reserve" 
                                                        ? `~ ${item.reserved_timestamp_final}`
                                                        : ''
                                                    }
                                                    ${item.status == "reserve" 
                                                    ? ` ${locale.texts.IS_RESERVED_FOR}`
                                                    : ''
                                                } 

                                                    ${item.status == "reserve" 
                                                    ? ` ${item.reserved_user_name}`
                                                    : ''
                                                } 
                                                `
                                                :   `     
                                                    ${item.name}, 
                                                    ${locale.texts.PHYSICIAN_NAME}: ${item.physician_name},
                                                    ${item.residence_time}
                                                `
                                            }
                                        </div>
                                    </div>
                                </div>
                            `                            
                        }).join("")
                        }
                    </div>
                </div>
            ` 
            return content
        },

    },
}

export default config

