import React from 'react'
import RTSelect from 'react-select'
import PropTypes from 'prop-types'

const Select = ({ style, ...props }) => {
	return (
		<RTSelect
			styles={{
				...style,
				// Fixes the overlapping problem of the component
				menu: (provided) => ({ ...provided, zIndex: 9999 }),
			}}
			{...props}
		/>
	)
}

Select.propTypes = {
	style: PropTypes.object,
}

export default Select
