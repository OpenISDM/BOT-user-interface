/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        transferredLocationController.js

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

import dbQueries from '../db/dbQueries/transferredLocationQueries.js';
import pool from '../db/dev/connection.js';

export default {
    getAllTransferredLocation: (request, response) => {
        pool.query(dbQueries.getAllTransferredLocation())
            .then((res) => {
                console.log('get transferred location');
                response.status(200).json(res.rows);
            })
            .catch((err) => {
                console.log(`get transferred Location failed: ${err}`);
            });
    },

    editTransferredLocation: (request, response) => {
        const { type, data } = request.body;

        let query = null;

        if (type === 'add branch') {
            query = dbQueries.editTransferredLocation('add branch', data);
        } else if (type === 'rename branch') {
            query = dbQueries.editTransferredLocation('rename branch', data);
        } else if (type === 'remove branch') {
            query = dbQueries.editTransferredLocation('remove branch', data);
        } else if (type === 'add department') {
            query = dbQueries.editTransferredLocation('add department', data);
        } else if (type === 'rename department') {
            query = dbQueries.editTransferredLocation(
                'rename department',
                data
            );
        } else if (type === 'remove department') {
            query = dbQueries.editTransferredLocation(
                'remove department',
                data
            );
        } else {
            console.log('editTransferredLocation: unrecognized command type');
        }

        pool.query(query)
            .then((res) => {
                console.log('edit transferred location succeed');
                response.status(200).json();
            })
            .catch((err) => {
                console.log(`edit transferred location failed: ${err}`);
            });
    },

    editLocation: (request, response) => {
        const { name, departmentName } = request.body;
        pool.query(dbQueries.editLocation(name, departmentName))
            .then((res) => {
                console.log('edit location succeed');
                response.status(200).json(res);
            })
            .catch((err) => {
                console.log(`edit location failed: ${err}`);
            });
    },
};
