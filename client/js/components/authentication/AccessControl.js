/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        AccessControl.js

    File Description:
        BOT UI component

    Version:
        1.0, 20200601

    Abstract:
        BeDIS uses LBeacons to deliver 3D coordinates and textual descriptions of
        their locations to users' devices. Basically, a LBeacon is an inexpensive,
        Bluetooth device. The 3D coordinates and location description of every
        LBeacon are retrieved from BeDIS (Building/environment Data and Information
        System) and stored locally during deployment and maintenance times. Once
        initialized, each LBeacon broadcasts its coordinates and location
        description to Bluetooth enabled user devices within its coverage area. It
        also scans Bluetooth low-energy devices that advertise to announced their
        presence and collect their Mac addresses.

    Authors:
        Tony Yeh, LT1stSoloMID@gmail.com
        Wayne Kang, b05505028@ntu.edu.tw
        Edward Chen, r08921a28@ntu.edu.tw
        Joe Chou, jjoe100892@gmail.com
*/

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
