import moment from 'moment'
import Cookies from 'js-cookie'
import { NORMAL } from '../config/wordMap'
import config from '../config'
import permissionsTable from '../config/roles'
import generalTexts from '../locale/text'
import supportedLocale from '../locale/supportedLocale'

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
			const { name } = object
			if (itemMap[name]) {
				itemMap[name] += 1
			} else {
				itemMap[name] = 1
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
