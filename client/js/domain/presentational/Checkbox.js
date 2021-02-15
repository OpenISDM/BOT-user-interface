import React from 'react'
import styleConfig from '../../config/styleConfig'
import PropTypes from 'prop-types'

const Checkbox = ({ value, name, onChange, id, label, disabled }) => {
	return (
		<div className="pretty p-default p-round" style={styleConfig.checkbox}>
			<input
				name={name}
				id={id}
				value={value}
				checked={value}
				type="checkbox"
				onChange={onChange}
				disabled={disabled}
			/>
			<div className="state p-primary">
				<label>{label}</label>
			</div>
		</div>
	)
}

Checkbox.propTypes = {
	name: PropTypes.string.isRequired,
	value: PropTypes.object,
	onChange: PropTypes.func,
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	disabled: PropTypes.bool,
}

export default Checkbox
