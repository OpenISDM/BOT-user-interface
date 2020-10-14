/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        objectController.js

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
import dbQueries from '../db/patientGroupListQueries'
import pool from '../db/connection'

export default {
	getPatientGroupList: (request, response) => {
		const query = dbQueries.getPatientGroup(request.body)
		pool
			.query(query)
			.then((res) => {
				response.status(200).json(res.rows)
			})
			.catch((err) => {
				console.log('addPatientGroup error: ', err)
			})
	},
	addPatientGroupList: (request, response) => {
		const { name } = request.body
		const query = dbQueries.addPatientGroup(name || 'New Group')
		pool
			.query(query)
			.then((res) => {
				response.status(200).json(res.rows[0].id)
			})
			.catch((err) => {
				console.log('addPatientGroup error: ', err)
			})
	},
	modifyPatientGroupList: (request, response) => {
		const { groupId, mode, itemACN, newName } = request.body
		console.log(groupId, mode, itemACN)
		let query = null
		if (mode == 0) {
			query = dbQueries.modifyPatientGroup(groupId, 0, itemACN)
		} else if (mode == 1) {
			query = dbQueries.modifyPatientGroup(groupId, 1, itemACN)
		} else if (mode == 2) {
			query = dbQueries.modifyPatientGroup(groupId, 2, newName)
		}
		pool
			.query(query)
			.then((res) => {
				response.status(200).json('ok')
			})
			.catch((err) => {
				console.log('err when modifyPatientGroup', err)
			})
	},
	changePatientList: (request, response) => {
		const { patient_group_id, user_id } = request.body
		const query = queryType.changePatientGroup(patient_group_id, user_id)
		pool
			.query(query)
			.then((res) => {
				console.log('success')
				response.status(200).json('ok')
			})
			.catch((err) => {
				console.log('error when change patient group,', err)
			})
	},
	deletePatientGroup: (request, response) => {
		const { groupId } = request.body
		const query = dbQueries.removePatientGroup(groupId)
		pool
			.query(query)
			.then((res) => {
				console.log('success')
				response.status(200).json('ok')
			})
			.catch((err) => {
				console.log('error when change patient group,', err)
			})
	},
}
