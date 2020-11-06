/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        recordApiAgent.js

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

import { record, monitor } from '../dataSrc'
import { post, put, del, patch } from '../helper/httpClient'

export default {
	async getRecord(type, locale) {
		return await post(record[type], {
			locale,
		})
	},

	async addShiftChangeRecord({ userInfo, pdfPackage, shift, list_id }) {
		return await put(record.shiftChange, {
			userInfo,
			pdfPackage,
			shift,
			list_id,
		})
	},

	async deleteShiftChangeRecord({ idPackage }) {
		return await del(record.shiftChange, {
			idPackage,
		})
	},

	async deleteEditObjectRecord({ idPackage }) {
		return await del(record.editedObject, {
			idPackage,
		})
	},

	async addPatientRecord({ objectPackage }) {
		return await post(record.patientRecord, {
			objectPackage,
		})
	},

	async delete(configPackage) {
		return await del(monitor, {
			configPackage,
		})
	},

	async add(configPackage) {
		return await patch(monitor, {
			configPackage,
		})
	},

	async put(configPackage) {
		return await put(monitor, {
			configPackage,
		})
	},
}
