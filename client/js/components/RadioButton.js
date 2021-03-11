import React from 'react'
import styleConfig from '../config/styleConfig'
import PropTypes from 'prop-types'

const RadioButton = ({
	field: { name, value, onChange, onBlur },
	id,
	label,
	...props
}) => {
	return (
		<div className="pretty p-default p-round" style={styleConfig.radioButton}>
			<input
				type="radio"
				name={name}
				value={id}
				checked={id === value}
				onChange={onChange}
				onBlur={onBlur}
				{...props}
			/>
			<div className="state p-primary">
				<label>{label}</label>
			</div>
		</div>
	)
}

RadioButton.propTypes = {
	field: PropTypes.object,
	id: PropTypes.number,
	label: PropTypes.string,
	className: PropTypes.string,
}

export default RadioButton
