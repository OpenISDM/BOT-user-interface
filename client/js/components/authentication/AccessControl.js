import React from 'react'
import { isBrowser, isMobile, isTablet } from 'react-device-detect'
import AuthContext from '../../context/AuthenticationContext'
import PropTypes from 'prop-types'

const AccessControl = ({ permission, children, platform = [true] }) => {
	const auth = React.useContext(AuthContext)
	const ownedPermissions = auth.user.permissions
	const authenticated = auth.authenticated
	const permitted = permission ? ownedPermissions.includes(permission) : true
	const platformSupported = platform
		.map((item) => {
			switch (item) {
				case 'browser':
					return isBrowser
				case 'mobile':
					return isMobile
				case 'tablet':
					return isTablet
				default:
					return true
			}
		})
		.includes(true)

	if (authenticated && permitted && platformSupported) {
		return children
	}

	return () => null
}

AccessControl.propTypes = {
	permission: PropTypes.string.isRequired,
	children: PropTypes.element.isRequired,
	platform: PropTypes.array,
}

export default AccessControl
