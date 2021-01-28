/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        BOTButton.js

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

import React, { useCallback } from 'react'
import { Button } from 'react-bootstrap'
import { debounce } from 'lodash'
import PropTypes from 'prop-types'

const BOTButton = ({
	pressed = false,
	text = '',
	style,
	enableDebounce = true,
	onClick = () => {
		// do nothing
	},
	...props
}) => {
	const variant = pressed ? 'primary' : 'outline-primary'
	let debounceClick = onClick
	if (enableDebounce) {
		debounceClick = useCallback(
			debounce((e) => onClick(e), 1000, {
				leading: true,
				trailing: false,
			}),
			[]
		)
	}

	return (
		<Button
			style={{ margin: '1px', ...style }}
			variant={variant}
			onClick={(e) => {
				debounceClick(e)
			}}
			{...props}
		>
			{text}
		</Button>
	)
}

BOTButton.propTypes = {
	pressed: PropTypes.bool,
	text: PropTypes.string,
	style: PropTypes.object,
	onClick: PropTypes.func,
	enableDebounce: PropTypes.bool,
}

export default BOTButton
