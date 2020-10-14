/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        monitorController.js

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
import dbQueries from '../db/monitorQueries'
import pool from '../db/connection'

export default {
	getMonitorConfig: (request, response) => {
		const { type } = request.body
		pool
			.query(dbQueries.getMonitorConfig(type))
			.then((res) => {
				console.log(`get ${type} succeed`)
				const toReturn = res.rows.map((item) => {
					item.start_time = item.start_time
						.split(':')
						.filter((item, index) => index < 2)
						.join(':')
					item.end_time = item.end_time
						.split(':')
						.filter((item, index) => index < 2)
						.join(':')
					return item
				})
				response.status(200).json(toReturn)
			})
			.catch((err) => {
				console.log(`get ${type} failed ${err}`)
			})
	},

	deleteMonitorConfig: (request, response) => {
		const { configPackage } = request.body
		pool
			.query(dbQueries.deleteMonitorConfig(configPackage))
			.then((res) => {
				console.log(`delete ${configPackage.type.replace(/_/g, ' ')}`)
				response.status(200).json(res)
			})
			.catch((err) => {
				console.log(`delete monitor config failed ${err}`)
			})
	},

	addMonitorConfig: (request, response) => {
		const { configPackage } = request.body

		pool
			.query(dbQueries.addMonitorConfig(configPackage))
			.then((res) => {
				console.log(`add ${configPackage.type} config success`)
				response.status(200).json(res)
			})
			.catch((err) => {
				console.log(`add ${type} fail ${err}`)
			})
	},

	setMonitorConfig: (request, response) => {
		const { configPackage } = request.body
		pool
			.query(dbQueries.setMonitorConfig(configPackage))
			.then((res) => {
				console.log(`set ${configPackage.type} config success`)
				response.status(200).json(res)
			})
			.catch((err) => {
				console.log(`set ${configPackage.type} config failed ${err}`)
			})
	},
}
