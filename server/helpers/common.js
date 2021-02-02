import moment from 'moment-timezone'
import {
	MOMENT_LOCALE_RELATIVE_TIME_FORMAT_EN,
	MOMENT_LOCALE_RELATIVE_TIME_FORMAT_TW,
} from '../config/config'

moment.updateLocale('en', {
	relativeTime: MOMENT_LOCALE_RELATIVE_TIME_FORMAT_EN,
})

moment.updateLocale('zh-tw', {
	relativeTime: MOMENT_LOCALE_RELATIVE_TIME_FORMAT_TW,
})

const findExpectedBitValue = ({ targetDecimal, expectedDecimal }) => {
	// convert to binary
	const targetResult = targetDecimal.toString(2)
	const expectedResult = expectedDecimal.toString(2)

	const targetBitValue =
		targetResult[targetResult.length - expectedResult.length]
	const expectedBitValue = expectedResult[0]

	return targetBitValue === expectedBitValue
}

const hexToDec = (hex) => {
	return hex
		.toLowerCase()
		.split('')
		.reduce((result, ch) => result * 16 + '0123456789abcdef'.indexOf(ch), 0)
}

const calculatePosition = ({ lbeaconUuid, baseX, baseY }) => {
	const area_id = parseInt(lbeaconUuid.slice(0, 4))
	const xx = baseX
	const yy = baseY

	return [yy, xx, area_id]
}

/** Parse the lbeacon's location coordinate from lbeacon_uuid*/
const parseLbeaconCoordinate = (lbeacon_uuid) => {
	const area_id = parseInt(lbeacon_uuid.slice(0, 4))
	const xx = parseInt(lbeacon_uuid.slice(14, 18) + lbeacon_uuid.slice(19, 23))
	const yy = parseInt(lbeacon_uuid.slice(-8))
	return [yy, xx, area_id]
}

export default {
	findExpectedBitValue,
	hexToDec,
	calculatePosition,
	parseLbeaconCoordinate,
	moment,
}
