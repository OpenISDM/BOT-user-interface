/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        importedObjectController.js

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
import dbQueries from '../db/dbQueries/importedObjectQueries'
import pool from '../db/dev/connection'

export default {
	getImportedObject: (request, response) => {
		const { locale, areaId } = request.body

		pool
			.query(dbQueries.getImportedObject())
			.then((res) => {
				console.log('get imported object')
				response.status(200).json(res)
			})
			.catch((err) => {
				console.log(`get imported object failed ${err}`)
			})
	},

	deleteImportedObject: (request, response) => {
		const { idPackage } = request.body
		pool
			.query(dbQueries.deleteImporedtObject(idPackage))
			.then((res) => {
				console.log('delete imported object succeed')
				response.status(200).json(res)
			})
			.catch((err) => {
				console.log(`delete imported object failed ${err}`)
			})
	},

	addImportedObject: (request, response) => {
		const idPackage = request.body.newData
		pool
			.query(dbQueries.addImportedObject(idPackage))
			.then((res) => {
				console.log('add imported objects succeed')
				response.status(200).json(res)
			})
			.catch((err) => {
				console.log(` ${err}`)
			})
	},
}
