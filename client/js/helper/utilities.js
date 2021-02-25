import moment from 'moment'
import Cookies from 'js-cookie'
import { NORMAL, RESERVE, RETURNED } from '../config/wordMap'
import config from '../config'
import permissionsTable from '../config/roles'
import generalTexts from '../locale/text'
import supportedLocale from '../locale/supportedLocale'
import { monitorTypeChecker } from './dataTransfer'

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

export const isSameValue = (firstValue, secondValue) => {
	const firstValueString = `${firstValue}`
	const secondValueString = `${secondValue}`
	return firstValueString === secondValueString
}

/** Clone for json format */
export const JSONClone = (arr) => {
	if (arr == null) return arr
	return arr.map((object) => {
		return Object.assign({}, object)
	})
}

/** Fastest object deep clone */
export const deepClone = (objects) => {
	return JSON.parse(JSON.stringify(objects))
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
	if (timeString) {
		return moment(timeString).format('YYYY-MM-DD HH:mm:ss')
	}
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

export const getCoordinatesFromUUID = ({ lBeaconUUID = '' }) => {
	const uuid = lBeaconUUID.replaceAll('-', '')
	if (uuid !== '') {
		const y = parseInt(uuid.slice(-8))
		const x = parseInt(uuid.slice(12, 20))
		return [y, x]
	}
	return [0, 0]
}

export const getBitValue = ({ status, bitValueEnum }) => {
	return parseInt(status) === parseInt(config.STATUS_ENUM.ENABLED)
		? bitValueEnum
		: 0
}

export const findExpectedBitValue = ({ targetDecimal, expectedDecimal }) => {
	// convert to binary
	const targetResult = targetDecimal.toString(2)
	const expectedResult = expectedDecimal.toString(2)

	const targetBitValue =
		targetResult[targetResult.length - expectedResult.length]
	const expectedBitValue = expectedResult[0]

	return targetBitValue === expectedBitValue
}

export const generateObjectSumString = ({ objectMap = {}, objectIds = [] }) => {
	let itemsNameString = ''
	const itemMap = {}

	objectIds.forEach((id) => {
		const object = objectMap[id]
		if (object) {
			const { type } = object
			if (itemMap[type]) {
				itemMap[type] += 1
			} else {
				itemMap[type] = 1
			}
		}
	})

	Object.keys(itemMap).forEach((itemKey) => {
		itemsNameString = `${itemsNameString}${itemKey} : ${
			itemMap[itemKey]
		} ${String.fromCharCode(13, 10)}`
	})

	return itemsNameString
}

export const getPermissionsByRoles = ({ roles = [] }) => {
	let permissions = []
	roles.forEach((role) => {
		permissions = [...permissions, ...permissionsTable[role].permission]
	})
	return [...new Set(permissions)]
}

export const localePackage = Object.values(supportedLocale).reduce(
	(localeMap, locale) => {
		localeMap[locale.abbr] = locale
		localeMap[locale.abbr].texts = {
			...generalTexts[locale.abbr],
		}
		return localeMap
	},
	{}
)

export const setCookies = (key, value) => {
	const encodedData = btoa(encodeURI(JSON.stringify(value)))
	Cookies.set(key, encodedData)
}

export const getCookies = (key) => {
	const encodedData = Cookies.get(key)
	return encodedData ? JSON.parse(decodeURI(atob(encodedData))) : null
}

export const removeCookies = (key) => {
	Cookies.remove(key)
}

export const delay = ({ callback, second = 1 }) => {
	return setTimeout(callback, second * 1000)
}

export const getIconColor = (item, searchObjectArray) => {
	let color
	let specifiedMarker

	if (item.emergency) {
		color = config.mapConfig.iconColor.sos
	}

	if (item.forbidden) {
		color = config.mapConfig.iconColor.forbidden
	}

	const pinColorIndex = searchObjectArray.indexOf(item.keyword)

	if (isSameValue(item.object_type, config.OBJECT_TYPE.DEVICE)) {
		color = config.mapConfig.iconColor.deivce.normal

		if (item.clear_bed) {
			color = config.mapConfig.iconColor.deivce.whiteBed
		}

		if (monitorTypeChecker(item.monitor_type, 16)) {
			color = config.mapConfig.iconColor.deivce.blackBed
		}

		if (item.searched && item.status !== NORMAL) {
			color = config.mapConfig.iconColor.deivce.grayWithoutDot
		} else if (item.status !== NORMAL) {
			color = config.mapConfig.iconColor.deivce.unNormal
		}

		if (item.searched) {
			color = config.mapConfig.iconColor.searched
		}

		if (pinColorIndex > -1) {
			color = config.mapConfig.iconColor.pinColorArray[pinColorIndex]
		}
	} else if (isSameValue(item.object_type, config.OBJECT_TYPE.PERSON)) {
		color = config.mapConfig.iconColor.person.normal

		if (item.alerted) {
			color = config.mapConfig.iconColor.person.alert
		}

		if (pinColorIndex > -1) {
			color = config.mapConfig.iconColor.pinColorArray[pinColorIndex]
			specifiedMarker = `Person${config.mapConfig.iconColor.pinColorArray[pinColorIndex]}`
		}
	}

	return specifiedMarker
		? {
				color,
				markerColor: specifiedMarker,
		  }
		: { color, markerColor: color }
}

export const getPopupContent = (object, objectList, locale) => {
	const content = objectList
		.map((item, index) => {
			const indexText = config.mapConfig.popupOptions.showNumber
				? `${index + 1}.`
				: '&bull;'
			const acn = `${locale.texts.ASSET_CONTROL_NUMBER}: ${
				config.mapConfig.ACNOmitsymbol
			}${item.asset_control_number.slice(-4)},`
			const residenceTime =
				item.status !== RETURNED
					? `${locale.texts[item.status.toUpperCase()]}`
					: `${item.residence_time}`
			const reservedTime =
				item.status === RESERVE ? `~ ${item.reserved_timestamp_final}` : ''
			const isReservedFor =
				item.status === RESERVE ? ` ${locale.texts.IS_RESERVED_FOR}` : ''
			const reservedUserName =
				item.status === RESERVE ? ` ${item.reserved_user_name}` : ''

			let careProvider = ''
			if (item.physician_names) {
				careProvider = ` ${locale.texts.PHYSICIAN_NAME}: ${item.physician_name},`
			}

			const itemContent =
				parseInt(item.object_type) === 0
					? `${item.type},
                        ${acn}
                        ${residenceTime}
                        ${reservedTime}
                        ${isReservedFor}
                        ${reservedUserName}
                    `
					: `${item.name},
                        ${careProvider}
                        ${item.residence_time}
                    `

			return `<div id='${item.mac_address}' class="popupItem mb-2">
                    <div class="d-flex justify-content-start">
                        <div class="min-width-1-percent">
                            ${indexText}
                        </div>
                        <div>
                            ${itemContent}
                        </div>
                    </div>
                    </div>
                    `
		})
		.join('')

	return `
        <div class="text-capitalize">
            <div class="font-size-120-percent">
                ${object[0].location_description}
            </div>
            <hr/>
            <div class="popupContent custom-scrollbar max-height-30">
                ${content}
            </div>
        </div>
    `
}

export const getLbeaconPopupContent = (lbeacon) => {
	return `
        <div>
            <div>
                description: ${lbeacon.description}
            </div>
            <div>
                coordinate: ${lbeacon.coordinate}
            </div>
            <div>
                comment: ${lbeacon.comment}
            </div>
        </div>
    `
}
