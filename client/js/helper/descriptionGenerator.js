/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        descriptionGenerator.js

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

import config from '../config'
import React from 'react'
import AccessControl from '../components/authentication/AccessControl'
import {
	RESERVE,
	RETURNED,
	TRANSFERRED,
	BROKEN,
	NORMAL,
} from '../config/wordMap'
import { isEqual } from 'lodash'

export const getDescription = (
	item,
	locale,
	keywordType,
	showChecked,
	checked
) => {
	let foundDeviceDescription = ''
	const reserveText =
		item.status === RESERVE
			? `~ ${item.reserved_timestamp_final} ${locale.texts.IS_RESERVED_FOR} ${item.reserved_user_name}`
			: ''
	const returnedText = item.currentPosition
		? isEqual(item.status, NORMAL)
			? `${item.residence_time} `
			: ''
		: ''
	const areaPositionText = `${getAreaName(item, locale)}-${getPosition(
		item,
		locale
	)}`

	switch (item.object_type) {
		case '0':
			foundDeviceDescription += item.found
				? ` ${getDeviceName(item, locale, keywordType)}
                    ${getACN(item, locale)}
                    ${getPosition(item, locale)}
                    ${getStatus(item, locale)}
                    ${returnedText}
                    ${reserveText}`
				: ` ${getDeviceName(item, locale, keywordType)}
                    ${getACN(item, locale)}
                    ${getSubDescription(item, locale)}`
			break
		case '1':
		case '2':
			foundDeviceDescription += `
                ${getName(item, locale)}
                ${getID(item, locale)}
                ${item.currentPosition ? areaPositionText : ''}
                ${item.residence_time ? item.residence_time : ''}`
			break
	}

	if (showChecked) {
		const comfirmed = checked
			? locale.texts.CONFIRMED
			: locale.texts.UNCONFIRMED
		foundDeviceDescription = `(${comfirmed}) ${foundDeviceDescription}`
	}

	return foundDeviceDescription
}

export const getSubDescription = (item, locale) => {
	let { value = '' } = item.status
	if (!value) {
		value = item.status
	}
	switch (locale.abbr) {
		// case locale.supportedLocale.cn.abbr:
		// case locale.supportedLocale.ms.abbr:
		case locale.supportedLocale.en.abbr:
			if (
				item.mac_address &&
				item.currentPosition &&
				isEqual(value, RETURNED)
			) {
				return `${locale.texts.WAS} ${locale.texts.NEAR} ${item.location_description} ${item.residence_time}`
			} else if (item.mac_address && item.currentPosition) {
				return value
			} else if (item.mac_address) {
				return `${locale.texts.NOT_AVAILABLE}`
			}
			return `${locale.texts.NON_BINDING}`

		case locale.supportedLocale.tw.abbr:
			if (
				item.mac_address &&
				item.currentPosition &&
				isEqual(value, RETURNED)
			) {
				return `${item.residence_time}${locale.texts.WAS}${locale.texts.NEAR}${item.location_description}`
			} else if (item.mac_address && item.currentPosition) {
				return value
			} else if (item.mac_address) {
				return `${locale.texts.NOT_AVAILABLE}`
			}
			return `${locale.texts.NON_BINDING}`
	}
}

export const getBatteryVolumn = (item, locale) => {
	switch (locale.abbr) {
		// case locale.supportedLocale.ms.abbr:
		// case locale.supportedLocale.cn.abbr:

		case locale.supportedLocale.en.abbr:
			return item.currentPosition
				? isEqual(item.status, RETURNED)
					? `, ${locale.texts.WAS} ${locale.texts.NEAR} ${item.location_description} ${item.residence_time}`
					: ''
				: `, ${locale.texts.NOT_AVAILABLE}`
		case locale.supportedLocale.tw.abbr:
			return item.currentPosition
				? isEqual(item.status, RETURNED)
					? `, ${item.residence_time}${locale.texts.WAS}${locale.texts.NEAR}${item.location_description}`
					: ''
				: `, ${locale.texts.NOT_AVAILABLE}`
	}
}

export const getDeviceName = (item, locale, keywordType) => {
	return `${item[keywordType] || item.type}`
}

export const getName = (item) => {
	return `${item.name},`
}

export const getType = (item) => {
	return `${item.type},`
}

export const getNickname = (item) => {
	return `${item.nickname},`
}

export const getACN = (item, locale) => {
	return `
        ${locale.texts.ASSET_CONTROL_NUMBER}:
        ${config.ACNOmitsymbol}${item.asset_control_number.slice(-4)},
    `
}

export const getPatientID = (item, locale) => {
	return `
        ${locale.texts.PATIENT_NUMBER}:
        ${config.ACNOmitsymbol}${item.asset_control_number.slice(-4)},
    `
}

export const getPhysicianName = (item, locale) => {
	return `
        ${locale.texts.PHYSICIAN_NAME}: ${item.physician_name},
    `
}

export const getStatus = (item, locale) => {
	let { value = '' } = item.status
	if (!value) {
		value = item.status
	}
	return isEqual(value, RETURNED) ? '' : `${locale.texts[value.toUpperCase()]}`
}

export const getPosition = (item) => {
	return `${item.location_description},`
}

export const getMacaddress = (item, locale) => {
	return (
		<AccessControl permission={'form:develop'}>
			| {locale.texts.MAC_ADDRESS}: {item.mac_address}
		</AccessControl>
	)
}

export const getRSSI = (item, locale) => {
	return (
		<AccessControl permission={'form:develop'}>
			| {locale.texts.RSSI}: {item.rssi}
		</AccessControl>
	)
}

export const getAreaName = (item, locale) => {
	return `${locale.texts.NEAR} ${locale.texts[item.lbeacon_area.value]}`
}

export const getID = (item, locale) => {
	const comma = item.currentPosition ? ',' : ''
	return `${locale.texts.ID}: ${item.asset_control_number}${comma}`
}

export const getUpdatedByNLbeacons = (item, locale) => {
	return (
		<AccessControl permission={'form:develop'}>
			| {locale.texts.NUM_OF_UPDATED_LBEACON}: {item.updated_by_n_lbeacons}
		</AccessControl>
	)
}

export const getLastUpdatedUserName = (item, locale) => {
	const showUserName =
		isEqual(item.status, BROKEN) || isEqual(item.status, TRANSFERRED)
	const userName = item.edit_user_name ? item.edit_user_name : ''
	return showUserName ? ` | ${locale.texts.STATUS_CHANGED_BY}: ${userName}` : ''
}
