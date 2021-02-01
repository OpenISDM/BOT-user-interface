import React from 'react'
import styleConfig from '../../config/styleConfig'

const RadioButton = ({
	field: { name, value, onChange, onBlur },
	id,
	label,
	className,
	...props
}) => {
	return (
		<div className="pretty p-default p-round" style={styleConfig.radioButton}>
			<input
				type="radio"
				name={name}
				value={id}
				checked={id == value}
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

export default RadioButton
