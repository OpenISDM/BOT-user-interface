import { OBJECT_TYPE, SEARCH_HISTORY } from '../config/wordMap'
import config from '../config'

/** Retrieve the object's offset from object's mac_address.
 * @param   mac_address The mac_address of the object retrieved from DB.
 * @param   lbeacon_coordinate The lbeacon's coordinate processed by createLbeaconCoordinate().*/
export const macAddressToCoordinate = (
	mac_address,
	lbeacon_coordinate,
	updated_by_n_lbeacons,
	dispersity
) => {
	const xx = mac_address.slice(15, 16)
	const yy = mac_address.slice(16, 17)
	const origin_x = lbeacon_coordinate[1]
	const origin_y = lbeacon_coordinate[0]
	const factor = updated_by_n_lbeacons < 3 ? dispersity : 1
	const xxx = origin_x + (parseInt(xx, 16) - 8) * factor
	const yyy = origin_y + (parseInt(yy, 16) - 8) * factor
	return [yyy, xxx]
}

/** Parsing the lbeacon's location coordinate from lbeacon_uuid*/
export const createLbeaconCoordinate = (lbeacon_uuid) => {
	/** Example of lbeacon_uuid: 00000018-0000-0000-7310-000000004610 */
	const zz = lbeacon_uuid.slice(0, 4)
	const xx = parseInt(lbeacon_uuid.slice(14, 18) + lbeacon_uuid.slice(19, 23))
	const yy = parseInt(lbeacon_uuid.slice(-8))
	return [yy, xx, zz]
}

/** Count the number of searched object  */
export const countNumber = (searchKey, item, numberSheet) => {
	let newNum = 1

	switch (searchKey.type) {
		case OBJECT_TYPE:
		case SEARCH_HISTORY:
			if (Object.keys(numberSheet).includes(item.keyword)) {
				newNum = numberSheet[item.keyword] += 1
			} else {
				numberSheet[item.keyword] = newNum
			}
			return newNum
		default:
			if (Object.keys(numberSheet).includes(searchKey.type)) {
				newNum = numberSheet[searchKey.type] += 1
			} else {
				numberSheet[searchKey.type] = newNum
			}
			return newNum
	}
}

/** Transfer monitor type binary code to type string */
export const transferMonitorTypeToString = (item, type) => {
	return Object.keys(config.monitorType)
		.reduce((checkboxGroup, index) => {
			if (item.monitor_type & index) {
				checkboxGroup.push(config.monitorType[index])
			}
			return checkboxGroup
		}, [])
		.join('/')
}

/** Check if the collection contains the type code */
export const monitorTypeChecker = (collect, typeCode) => {
	return collect & typeCode
}

/** Count numbers of each object in the result and return a map */
export const searchResultToMap = (result) => {
	return result.reduce((map, item) => {
		if (Object.keys(map).includes(item.type)) {
			map[item.type][0] += 1
			if (item.found) {
				map[item.type][1] += 1
			}
		} else {
			map[item.type] = []
			map[item.type][0] = 1
			map[item.type][1] = 0
			if (item.found) {
				map[item.type][1] += 1
			}
		}
		return map
	}, {})
}
