/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        lbeaconController.js

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

import 'dotenv/config.js';
import moment from 'moment-timezone';
import dbQueries from '../db/dbQueries/lbeaconQueries.js';
import pool from '../db/dev/connection.js';
import statusCode from '../config/statusCode.js';

export default {
    getAllLbeacon: (request, response) => {
        const { locale } = request.query;

        pool.query(dbQueries.getLbeaconTable)
            .then((res) => {
                console.log('get lbeacon table data succeed');
                res.rows.map((item) => {
                    /** Set the value that distinguish lbeacon is normal */

                    item.isInHealthInterval =
                        (item.health_status ==
                            process.env.IS_LBEACON_HEALTH_STATUS_CODE ||
                            item.health_status ==
                                statusCode.LBEACON_STATUS_NOT_AVAILABLE) &&
                        moment().diff(item.last_report_timestamp, 'minutes') <
                            process.env.LBEACON_HEALTH_TIME_INTERVAL_IN_MIN;

                    item.last_report_timestamp = moment
                        .tz(item.last_report_timestamp, process.env.TZ)
                        .locale(locale)
                        .format(process.env.TIMESTAMP_FORMAT);
                });
                response.status(200).json(res);
            })
            .catch((err) => {
                console.log(`get lbeacon table failed ${err}`);
            });
    },

    deleteLBeacon: (request, response) => {
        const { idPackage } = request.body;
        pool.query(dbQueries.deleteLBeacon(idPackage))
            .then((res) => {
                console.log('delete LBeacon record succeed');
                response.status(200).json(res);
            })
            .catch((err) => {
                console.log(`delete LBeacon failed ${err}`);
            });
    },

    editLbeacon: (request, response) => {
        const { formOption } = request.body;
        pool.query(dbQueries.editLbeacon(formOption))
            .then((res) => {
                console.log('edit lbeacon succeed');
                response.status(200).json(res);
            })
            .catch((err) => {
                console.log(`edit lbeacon failed ${err}`);
            });
    },
};
