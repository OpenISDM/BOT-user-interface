import React from 'react'
import { PrimaryButton } from '../components/styleComponent'
import PropTypes from 'prop-types'

const IconButton = ({ iconName, children, name, onClick }) => {
	return (
		<PrimaryButton variant="outline-primary" name={name} onClick={onClick}>
			<i className={`${iconName} mx-1`}></i>
			{children}
		</PrimaryButton>
	)
}

IconButton.propTypes = {
	iconName: PropTypes.string,
	children: PropTypes.node,
	name: PropTypes.string,
	onClick: PropTypes.func,
}

export default IconButton
