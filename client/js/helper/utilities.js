/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        MainContainer.js

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

import moment from 'moment'
import { NORMAL } from '../config/wordMap'

/** Compare two objects, including strings, deep objects  */
export const isEqual = (obj1, obj2) => {
	if (typeof obj1 != typeof obj2) {
		return false
	}
	if (typeof obj1 == 'string') {
		return obj1.toUpperCase() === obj2.toUpperCase()
	}
	return JSON.stringify(obj1) === JSON.stringify(obj2)
}

/** Deep clone for json format */
export const JSONClone = (arr) => {
	if (arr == null) return arr
	return arr.map((object) => {
		return Object.assign({}, object)
	})
}

/** Check whether the platform supports Webp */
export const isWebpSupported = () => {
	const elem = document.createElement('canvas')

	if (elem.getContext && elem.getContext('2d')) {
		// was able or not to get WebP representation
		return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0
	}

	// very old browser like IE 8, canvas not supported
	return false
}

export const formatTime = (timeString) => {
	return moment(timeString).format('YYYY-MM-DD HH:mm:ss')
}

export const formatToMac = (string) => {
	const stringWithoutColons = string.replaceAll(':', '')
	if (stringWithoutColons.length === 12) {
		return stringWithoutColons.match(/.{1,2}/g).join(':')
	}
	return string
}

export const compareString = (firstString, secondString) => {
	if (firstString && secondString) {
		return `${firstString}`.toLowerCase() === `${secondString}`.toLowerCase()
	}
	return false
}

export const includes = (firstString, secondString) => {
	return `${firstString}`
		.toLowerCase()
		.includes(`${secondString}`.toLowerCase())
}

export const convertConfigValue = (config) => {
	return JSON.parse(config, (k, v) => {
		return v === 'true' ? true : v === 'false' ? false : v
	})
}

export const filterByField = (callback, data, key, filteredAttribute) => {
	let filteredData = data
	if (key) {
		filteredData = data.filter((obj) => {
			const resultArray = []
			if (filteredAttribute.includes('name')) {
				resultArray.push(callback(obj.name, key))
			}
			if (filteredAttribute.includes('type')) {
				resultArray.push(callback(obj.type, key))
			}
			if (filteredAttribute.includes('acn')) {
				resultArray.push(callback(obj.asset_control_number, key))
			}
			if (filteredAttribute.includes('status')) {
				if (obj.status && obj.status.label) {
					resultArray.push(callback(obj.status.label, key))
				}
			}
			if (filteredAttribute.includes('area')) {
				if (obj.area_name && obj.area_name.label) {
					resultArray.push(callback(obj.area_name.label, key))
				}
			}
			if (filteredAttribute.includes('monitor')) {
				resultArray.push(callback(obj.monitor_type, key))
			}
			if (filteredAttribute.includes('macAddress')) {
				resultArray.push(callback(obj.mac_address, key))
			}
			if (filteredAttribute.includes('sex')) {
				if (obj.object_type && obj.object_type.label) {
					resultArray.push(callback(obj.object_type.label, key))
				}
			}
			if (filteredAttribute.includes('transferred_location')) {
				if (obj.transferred_location && obj.transferred_location.label) {
					resultArray.push(callback(obj.transferred_location.label, key))
				}
			}
			if (filteredAttribute.includes('physician_name')) {
				resultArray.push(callback(obj.physician_name, key))
			}
			if (filteredAttribute.includes('monitor_type')) {
				resultArray.push(callback(obj.monitor_type, key))
			}
			return resultArray.includes(true)
		})
	}

	return filteredData
}

export const convertStatusToText = (locale, status) => {
	return status === NORMAL
		? locale.texts.RETURNED
		: locale.texts[status.toUpperCase().replace(/ /g, '_')]
}
