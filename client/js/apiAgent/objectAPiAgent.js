/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        objectApiAgent.js

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

import { object, objectPackage } from '../dataSrc'
import { get, put, post, patch, del } from '../helper/httpClient'

export default {
	/**
	 * get object data from object_table
	 */
	async getObjectTable({ locale, areas_id, objectType }) {
		return await get(object.object, {
			locale,
			areas_id,
			objectType,
		})
	},

	async getAlias() {
		return await get(object.alias)
	},

	async editAlias({ objectType, alias }) {
		return await put(object.alias, {
			objectType,
			alias,
		})
	},

	async editAliases({ objectTypeList }) {
		return await put(object.aliases, {
			objectTypeList,
		})
	},

	async post({ formOption, mode }) {
		return await post(object[mode], {
			formOption,
			mode,
		})
	},

	async put({ formOption, mode }) {
		return await put(object[mode], {
			formOption,
			mode,
		})
	},

	async editObjectPackage(
		locale,
		formOption,
		username,
		pdfPackage,
		reservedTimestamp
	) {
		return await put(objectPackage, {
			locale,
			formOption,
			username,
			pdfPackage,
			reservedTimestamp,
		})
	},

	async deleteObject({ formOption }) {
		return await del(object.object, {
			formOption,
		})
	},

	async disassociate({ formOption }) {
		return await patch(object.object, {
			formOption,
		})
	},

	async getIdleMacaddr() {
		return await post(object.idleMacaddr)
	},
}
