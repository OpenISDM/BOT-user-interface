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
