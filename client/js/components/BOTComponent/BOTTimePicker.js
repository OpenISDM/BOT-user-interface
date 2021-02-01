import React from 'react'
import moment from 'moment'
import TimePicker from 'rc-time-picker'
import PropTypes from 'prop-types'

import 'rc-time-picker/assets/index.css'

const covertToMoment = (value) => {
	const [h, m, s] = value.split(':')
	return moment().set({ hour: h, minute: m, second: s, millisecond: 0 })
}

const BOTTimePicker = ({
	value,
	onChange,
	style,
	showSecond = true,
	isStringTypeValue = true,
}) => {
	return (
		<TimePicker
			style={style}
			showSecond={showSecond}
			defaultValue={
				value && isStringTypeValue ? covertToMoment(value) : moment()
			}
			onChange={(momentValue) => {
				if (momentValue) {
					const stringValue = momentValue.format('HH:mm:ss')
					onChange(stringValue)
				}
			}}
		/>
	)
}

BOTTimePicker.propTypes = {
	value: PropTypes.object,
	showSecond: PropTypes.bool,
	onChange: PropTypes.func,
	style: PropTypes.object,
	isStringTypeValue: PropTypes.bool,
}

export default BOTTimePicker
