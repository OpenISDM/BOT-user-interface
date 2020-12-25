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

import TransferLocations from '../db/model/transferLocations'

export default {
	getAll: async (request, response) => {
		try {
			const res = await TransferLocations.findAll()
			response.status(200).json(res)
		} catch (e) {
			console.log(`get all transferred Location failed: ${e}`)
		}
	},

	addOne: async (request, response) => {
		const { name, department } = request.body
		try {
			const res = await TransferLocations.upsert(
				{ name, department }, // Record to upsert
				{ returning: true } // Return upserted record
			)
			response.status(200).json(res)
		} catch (e) {
			console.log(`add transferred Location failed: ${e}`)
		}
	},

	removeByIds: async (request, response) => {
		const { transferLocationIds } = request.body
		try {
			const res = await TransferLocations.destroy({
				where: {
					id: transferLocationIds,
				},
			})
			response.status(200).json(res)
		} catch (e) {
			console.log(`remove transferred Locations failed: ${e}`)
		}
	},
}
