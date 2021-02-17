import React from 'react'
import PropTypes from 'prop-types'

const RadioButtonGroup = ({ children }) => {
	return (
		<div>
			<fieldset>{children}</fieldset>
		</div>
	)
}

RadioButtonGroup.propTypes = { children: PropTypes.node }

export default RadioButtonGroup
