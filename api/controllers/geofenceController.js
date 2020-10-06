/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        geofenceController.js

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

require('dotenv').config()
require('moment-timezone')
var exec = require('child_process').execFile
const dbQueries = require('../db/dbQueries/geofenceQueries')
const pool = require('../db/dev/connection')

module.exports = {
    getGeofenceConfig: (request, response) => {
        let { areaId } = request.body
        pool.query(dbQueries.getGeofenceConfig(areaId))
            .then((res) => {
                res.rows.map((item) => {
                    item.start_time = item.start_time
                        .split(':')
                        .filter((item, index) => index < 2)
                        .join(':')
                    item.end_time = item.end_time
                        .split(':')
                        .filter((item, index) => index < 2)
                        .join(':')
                    item.parsePerimeters = parseGeoFenceConfig(item.perimeters)
                    item.parseFences = parseGeoFenceConfig(item.fences)
                })
                console.log('get geofence config success')
                response.status(200).json(res)
            })
            .catch((err) => {
                console.log(`get geofence config fail ${err}`)
            })
    },

    deleteMonitorConfig: (request, response) => {
        let { configPackage } = request.body
        pool.query(dbQueries.deleteMonitorConfig(configPackage))
            .then((res) => {
                console.log(`delete ${configPackage.type.replace(/_/g, ' ')}`)
                response.status(200).json(res)
            })
            .catch((err) => {
                console.log(`delete monitor config failed ${err}`)
            })
    },

    addGeofenceConfig: (request, response) => {
        let { configPackage } = request.body

        let area_id = configPackage.area.id

        pool.query(dbQueries.addGeofenceConfig(configPackage))
            .then((res) => {
                console.log(`add geofence config success`)
                if (process.env.RELOAD_GEO_CONFIG_PATH) {
                    exec(
                        process.env.RELOAD_GEO_CONFIG_PATH,
                        `-p 9999 -c cmd_reload_geo_fence_setting -r geofence_list -f area_one -a ${area_id}`.split(
                            ' '
                        ),
                        function (err, data) {
                            if (err) {
                                console.log(
                                    `execute reload geofence setting failed ${err}`
                                )
                                response.status(200).json(res)
                            } else {
                                console.log(
                                    `execute reload geofence setting success`
                                )
                                response.status(200).json(res)
                            }
                        }
                    )
                } else {
                    response.status(200).json(res)
                    console.log('IPC has not set')
                }
            })
            .catch((err) => {
                console.log(`add geofence config failed ${err}`)
            })
    },

    setGeofenceConfig: (request, response) => {
        let { configPackage } = request.body

        let { area_id } = configPackage

        pool.query(dbQueries.setGeofenceConfig(configPackage))
            .then((res) => {
                console.log(`set geofence config success`)
                if (process.env.RELOAD_GEO_CONFIG_PATH) {
                    exec(
                        process.env.RELOAD_GEO_CONFIG_PATH,
                        `-p 9999 -c cmd_reload_geo_fence_setting -r geofence_list -f area_one -a ${area_id}`.split(
                            ' '
                        ),
                        function (err, data) {
                            if (err) {
                                console.log(
                                    `execute reload geofence setting failed ${err}`
                                )
                                response.status(200).json(res)
                            } else {
                                console.log(
                                    `execute reload geofence setting success`
                                )
                                response.status(200).json(res)
                            }
                        }
                    )
                } else {
                    response.status(200).json(res)
                    console.log('IPC has not set')
                }
            })
            .catch((err) => {
                console.log(`set geofence config failed ${err}`)
            })
    },
}

/** Parse geo fence config */
const parseGeoFenceConfig = (field = []) => {
    let fieldParse = field.split(',')
    let number = parseInt(fieldParse[0])
    let lbeacons = fieldParse.filter(
        (item, index) => index > 0 && index <= number
    )
    let rssi = fieldParse[number + 1]
    let coordinates = lbeacons.map((item) => {
        const area_id = parseInt(item.slice(0, 4))
        const xx = parseInt(item.slice(12, 20))
        const yy = parseInt(item.slice(-8))
        return [yy, xx]
    })
    return {
        number,
        lbeacons,
        rssi,
        coordinates,
    }
}
