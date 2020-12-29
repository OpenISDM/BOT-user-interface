/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        geofenceController.js

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
import GeoFenceConfig from '../db/model/geoFenceConfig'

export default {
	getGeofenceConfig: async (request, response) => {
		const { areaId } = request.body
		try {
			const res = await GeoFenceConfig.findAll({ where: { area_id: areaId } })
			response.status(200).json(res)
		} catch (e) {
			console.log('getGeofenceConfig error: ', e)
		}
	},

	deleteMonitorConfig: async (request, response) => {
		const { ids } = request.body
		try {
			const res = await GeoFenceConfig.destroy({
				where: {
					id: ids,
				},
			})
			response.status(200).json(res)
		} catch (e) {
			console.log('deleteMonitorConfig error: ', e)
		}
	},

	addGeofenceConfig: async (request, response) => {
		const { configPackage } = request.body
		try {
			const {
				name,
				enable,
				start_time,
				end_time,
				area_id,
				is_global_fence,
				perimeters_number_uuid,
				perimeters_rssi,
				perimeters_uuid,
				fences_number_uuid,
				fences_rssi,
				fences_uuid,
			} = configPackage

			const res = await GeoFenceConfig.create({
				name,
				enable,
				start_time,
				end_time,
				area_id,
				is_global_fence,
				perimeters_number_uuid,
				perimeters_rssi,
				perimeters_uuid,
				fences_number_uuid,
				fences_rssi,
				fences_uuid,
			})
			response.status(200).json(res)
		} catch (e) {
			console.log('addGeofenceConfig error: ', e)
		}
	},

	setGeofenceConfig: async (request, response) => {
		const { configPackage } = request.body
		try {
			const {
				id,
				name,
				enable,
				start_time,
				end_time,
				area_id,
				is_global_fence,
				perimeters_number_uuid,
				perimeters_rssi,
				perimeters_uuid,
				fences_number_uuid,
				fences_rssi,
				fences_uuid,
			} = configPackage

			const res = await GeoFenceConfig.update(
				{
					name,
					enable,
					start_time,
					end_time,
					area_id,
					is_global_fence,
					perimeters_number_uuid,
					perimeters_rssi,
					perimeters_uuid,
					fences_number_uuid,
					fences_rssi,
					fences_uuid,
				},
				{
					where: { id },
				}
			)
			response.status(200).json(res)
		} catch (e) {
			console.log('setGeofenceConfig error: ', e)
		}
	},
}
