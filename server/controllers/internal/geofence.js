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
import { Op } from '../../db/connection'
import {
	GeoFenceConfig,
	GeoFenceAreaConfig,
	NotificationConfig,
} from '../../db/models'

const MONITOR_TYPE = {
	NORMAL: 0,
	GEO_FENCE: 1,
	EMERGENCY: 2,
	ACTIVITY: 4,
	LOCATION: 8,
	BED_CLEARNESS: 16,
}

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

	getGeofenceAreaConfig: async (request, response) => {
		const { areaId } = request.query
		try {
			let areaConfig = await GeoFenceAreaConfig.findOne({
				where: { area_id: areaId },
				raw: true,
			})

			// Because monitored_object_types stores 'single quote' for BOT server convenience
			// So, We do this for client
			if (areaConfig) {
				const monitoredObjectTypes = `${areaConfig.monitored_object_types}`
				areaConfig.monitored_object_types = monitoredObjectTypes.replace(
					/'/g,
					''
				)
			} else {
				areaConfig = {}
				areaConfig.monitored_object_types = ''
			}

			const geofenceNotificationConfigs = await NotificationConfig.findAll({
				where: {
					area_id: areaId,
					monitor_type: MONITOR_TYPE.GEO_FENCE,
					name: { [Op.ne]: null },
				},
			})

			response.status(200).json({
				areaConfig,
				geofenceNotificationConfigs,
			})
		} catch (e) {
			console.log('getGeofenceAreaConfig error: ', e)
		}
	},

	setGeofenceAreaConfig: async (request, response) => {
		const { areaConfig } = request.body
		try {
			let { montiorObjectTypes = [] } = areaConfig
			const {
				area_id,
				monitorDeviceNamedListids = [],
				monitorPatientNamedListids = [],
				dayShift,
				swingShift,
				nightShift,
			} = areaConfig

			const queriedConfig = await GeoFenceAreaConfig.findOne({
				where: { area_id },
			})

			// Because monitored_object_types stores 'single quote' for BOT server convenience
			// So, We do this for GUI Server
			montiorObjectTypes = `'${montiorObjectTypes.join("','")}'`

			if (queriedConfig) {
				await GeoFenceAreaConfig.update(
					{
						monitored_object_types: montiorObjectTypes,
						monitored_patient_named_list_ids: monitorPatientNamedListids.join(),
						monitored_device_named_list_ids: monitorDeviceNamedListids.join(),
					},
					{ where: { area_id } }
				)
			} else {
				await GeoFenceAreaConfig.create({
					area_id,
					monitored_object_types: montiorObjectTypes,
					monitored_patient_named_list_ids: monitorPatientNamedListids.join(),
					monitored_device_named_list_ids: monitorDeviceNamedListids.join(),
				})
			}

			const shiftListPromises = [dayShift, swingShift, nightShift].map(
				async (shift) => {
					const {
						name,
						alert_last_sec,
						active_alert_types,
						enable,
						start_time,
						end_time,
					} = shift

					const queriedShift = await NotificationConfig.findOne({
						where: {
							area_id,
							name,
							monitor_type: MONITOR_TYPE.GEO_FENCE,
						},
					})
					if (queriedShift) {
						return NotificationConfig.update(
							{
								alert_last_sec,
								active_alert_types,
								enable,
								start_time,
								end_time,
							},
							{
								where: {
									area_id,
									name,
									monitor_type: MONITOR_TYPE.GEO_FENCE,
								},
							}
						)
					}
					return NotificationConfig.create({
						area_id,
						name,
						alert_last_sec,
						active_alert_types,
						enable,
						start_time,
						end_time,
						monitor_type: MONITOR_TYPE.GEO_FENCE,
					})
				}
			)

			await Promise.all(shiftListPromises)

			response.status(200).json({ message: 'OK' })
		} catch (e) {
			console.log('setGeofenceAreaConfig error: ', e)
		}
	},
}
