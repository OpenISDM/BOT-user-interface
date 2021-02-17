import React from 'react'
import { AppContext } from '../context/AppContext'
import PropTypes from 'prop-types'

export const SWITCH_ENUM = {
	OFF: 0,
	ON: 1,
}

const Switcher = ({ leftLabel, rightLabel, status, onChange, subId }) => {
	const { locale } = React.useContext(AppContext)
	status = parseInt(status)

	return (
		<div className="switch-field text-capitalize">
			<input
				type="radio"
				id={`left:${subId}`}
				name="switch"
				value={SWITCH_ENUM.ON}
				onChange={onChange}
				checked={status === SWITCH_ENUM.ON}
			/>
			<label htmlFor={`left:${subId}`}>
				{locale.texts[leftLabel.toUpperCase()]}
			</label>

			<input
				type="radio"
				id={`right:${subId}`}
				name="switch"
				value={SWITCH_ENUM.OFF}
				onChange={onChange}
				checked={status === SWITCH_ENUM.OFF}
			/>
			<label htmlFor={`right:${subId}`}>
				{locale.texts[rightLabel.toUpperCase()]}
			</label>
		</div>
	)
}

Switcher.propTypes = {
	leftLabel: PropTypes.string,
	rightLabel: PropTypes.string,
	status: PropTypes.number,
	onChange: PropTypes.func,
	subId: PropTypes.string,
}

export default Switcher
