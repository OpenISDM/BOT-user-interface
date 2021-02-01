const findExpectedBitValue = ({ targetDecimal, expectedDecimal }) => {
	// convert to binary
	const targetResult = targetDecimal.toString(2)
	const expectedResult = expectedDecimal.toString(2)

	const targetBitValue =
		targetResult[targetResult.length - expectedResult.length]
	const expectedBitValue = expectedResult[0]

	return targetBitValue === expectedBitValue
}

function hexToDec(hex) {
	return hex
		.toLowerCase()
		.split('')
		.reduce((result, ch) => result * 16 + '0123456789abcdef'.indexOf(ch), 0)
}

export default { findExpectedBitValue, hexToDec }
