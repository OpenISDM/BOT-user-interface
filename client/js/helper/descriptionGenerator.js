import config from '../config'
import React from 'react'
import AccessControl from '../domain/AccessControl'
import {
	RESERVE,
	RETURNED,
	TRANSFERRED,
	BROKEN,
	NORMAL,
} from '../config/wordMap'
import { isEqual } from 'lodash'
import { isSameValue } from '../helper/utilities'

export const getDescription = ({
	item,
	locale,
	keywordType,
	showChecked,
	checked,
}) => {
	let foundDeviceDescription = ''
	const reserveText =
		item.status === RESERVE
			? `~ ${item.reserved_timestamp_final} ${locale.texts.IS_RESERVED_FOR} ${item.reserved_user_name}`
			: ''
	const normalText = item.currentPosition
		? isEqual(item.status, NORMAL)
			? `${item.residence_time} `
			: ''
		: ''

	switch (item.object_type) {
		case '0':
			foundDeviceDescription += item.found
				? ` ${getName({ item, keywordType })}
                    ${getACN(item, locale)}
                    ${getPosition(item, locale)}
                    ${getStatus(item, locale)}
                    ${normalText}
                    ${reserveText}`
				: ` ${getName({ item, keywordType })}
                    ${getACN(item, locale)}
                    ${getSubDescription(item, locale)}`
			break
		case '1':
			foundDeviceDescription += `
                ${getName({ item, keywordType })}
                ${getID(item, locale)}
                ${getPosition(item, locale)}
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
			if (item.mac_address && item.currentPosition && isEqual(value, NORMAL)) {
				return `${locale.texts.WAS} ${locale.texts.NEAR} ${
					item.location_description ? item.location_description : ''
				} ${item.residence_time}`
			} else if (item.mac_address && item.currentPosition) {
				return `${getStatus(item, locale)}`
			} else if (item.mac_address) {
				return `${locale.texts.NOT_AVAILABLE}`
			}
			return `${locale.texts.NON_BINDING}`

		case locale.supportedLocale.tw.abbr:
			if (item.mac_address && item.currentPosition && isEqual(value, NORMAL)) {
				return `${item.residence_time}${locale.texts.WAS}${locale.texts.NEAR}${
					item.location_description ? item.location_description : ''
				}`
			} else if (item.mac_address && item.currentPosition) {
				return `${getStatus(item, locale)}`
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
					? `, ${locale.texts.WAS} ${locale.texts.NEAR} ${
							item.location_description
								? item.location_description
								: item.location_description
					  } ${item.residence_time}`
					: ''
				: `, ${locale.texts.NOT_AVAILABLE}`
		case locale.supportedLocale.tw.abbr:
			return item.currentPosition
				? isEqual(item.status, RETURNED)
					? `, ${item.residence_time}${locale.texts.WAS}${locale.texts.NEAR}${
							item.location_description
								? item.location_description
								: item.location_description
					  }`
					: ''
				: `, ${locale.texts.NOT_AVAILABLE}`
	}
}

export const getDeviceName = (item, locale, keywordType) => {
	return `${item[keywordType] || item.type}`
}

export const getName = ({ item, keywordType }) => {
	const showAlias = keywordType && config.KEYWORD_TYPE[0] === keywordType
	return showAlias && item.nickname ? `${item.nickname},` : `${item.name},`
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
        ${config.mapConfig.ACNOmitsymbol}${item.asset_control_number.slice(-4)},
    `
}

export const getPatientID = (item, locale) => {
	return `
        ${locale.texts.PATIENT_NUMBER}:
        ${config.mapConfig.ACNOmitsymbol}${item.asset_control_number.slice(-4)},
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
	return isEqual(value, NORMAL) ? '' : `${locale.texts[value.toUpperCase()]}`
}

export const getPosition = (item, locale) => {
	if (isSameValue(item.lbeacon_area.id, item.area_id)) {
		return `${item.location_description},`
	}

	return `${locale.texts.NEAR} ${item.lbeacon_area.value}${
		item.location_description ? `-${item.location_description}` : ''
	},`
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
