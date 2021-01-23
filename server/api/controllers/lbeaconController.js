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

import 'dotenv/config'
import moment from 'moment-timezone'
import dbQueries from '../db/lbeaconQueries'
import pool from '../db/connection'

const LBEACON_STATUS_NOT_AVAILABLE = 9999

export default {
	getAllLbeacon: async (request, response) => {
		const isLbeaconHealthStatusCode = parseInt(
			process.env.IS_LBEACON_HEALTH_STATUS_CODE
		)
		const isLbeaconStatusNotAvailable = parseInt(LBEACON_STATUS_NOT_AVAILABLE)
		const isLbeaconHealthTimeIntervalInMin = parseInt(
			process.env.LBEACON_HEALTH_TIME_INTERVAL_IN_MIN
		)

		try {
			const res = await pool.query(dbQueries.getLbeaconTable)
			console.log('get lbeacon table data succeed')
			res.rows.forEach((item) => {
				item.isInHealthInterval =
					(parseInt(item.health_status) === isLbeaconHealthStatusCode ||
						parseInt(item.health_status) === isLbeaconStatusNotAvailable) &&
					moment().diff(item.last_report_timestamp, 'minutes') <
						isLbeaconHealthTimeIntervalInMin
			})
			response.status(200).json(res)
		} catch (e) {
			console.log(`get lbeacon table failed ${e}`)
		}
	},

	deleteLBeacon: async (request, response) => {
		const { ids } = request.body
		try {
			const res = pool.query(dbQueries.deleteLBeacon(ids))
			console.log('delete LBeacon record succeed')
			response.status(200).json(res)
		} catch (e) {
			console.log(`delete LBeacon failed ${e}`)
		}
	},

	editLbeacon: async (request, response) => {
		const { formOption } = request.body
		try {
			const res = await pool.query(dbQueries.editLbeacon(formOption))
			console.log('edit lbeacon succeed')
			response.status(200).json(res)
		} catch (e) {
			console.log(`edit lbeacon failed ${e}`)
		}
	},
}
