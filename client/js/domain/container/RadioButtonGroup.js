import React from 'react'

const RadioButtonGroup = ({
	value,
	error,
	touched,
	id,
	label,
	className,
	children,
}) => {
	return (
		<div>
			<fieldset>{children}</fieldset>
		</div>
	)
}

export default RadioButtonGroup
