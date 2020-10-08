/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        gatewayController.js

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

import 'dotenv/config'
import moment from 'moment-timezone'
import dbQueries from '../db/dbQueries/gatewayQueries'
import pool from '../db/dev/connection'

export default {
    getAllGateway: (request, response) => {
        const { locale } = request.query

        pool.query(dbQueries.getAllGateway)
            .then((res) => {
                console.log('get gateway table succeed')
                res.rows.map((item) => {
                    item.last_report_timestamp = moment
                        .tz(item.last_report_timestamp, process.env.TZ)
                        .locale(locale)
                        .format(process.env.TIMESTAMP_FORMAT)
                    item.registered_timestamp = moment
                        .tz(item.registered_timestamp, process.env.TZ)
                        .locale(locale)
                        .format(process.env.TIMESTAMP_FORMAT)
                })
                response.status(200).json(res)
            })
            .catch((err) => {
                console.log(`get gateway table failed ${err}`)
            })
    },

    deleteGateway: (request, response) => {
        const { idPackage } = request.body
        pool.query(dbQueries.deleteGateway(idPackage))
            .then((res) => {
                console.log('delete Gateway record succeed')
                response.status(200).json(res)
            })
            .catch((err) => {
                console.log(`delete gateway failed ${err}`)
            })
    },

    editGateway: (request, response) => {
        const { formOption } = request.body
        pool.query(dbQueries.editGateway(formOption))
            .then((res) => {
                console.log('edit lbeacon succeed')
                response.status(200).json(res)
            })
            .catch((err) => {
                console.log(`edit lbeacon failed ${err}`)
            })
    },
}
