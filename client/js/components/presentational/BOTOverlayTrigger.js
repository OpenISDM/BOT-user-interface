/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        BOTOverlayTrigger.js

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
import PropTypes from 'prop-types'
import { Popover, OverlayTrigger } from 'react-bootstrap'

const BOTOverlayTrigger = ({
	popoverTitle,
	popoverBody,
	id,
	placement,
	trigger,
	innerElement = <></>,
}) => {
	return (
		<OverlayTrigger
			trigger={trigger}
			key={id}
			placement={placement}
			overlay={
				<Popover id={`popover-positioned-${placement}`}>
					<Popover.Content className="popover-content">
						{popoverBody}
					</Popover.Content>
					<Popover.Title as="h3">{popoverTitle}</Popover.Title>
				</Popover>
			}
		>
			{innerElement}
		</OverlayTrigger>
	)
}

BOTOverlayTrigger.propTypes = {
	popoverTitle: PropTypes.string.isRequired,
	popoverBody: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	trigger: PropTypes.string.isRequired,
	placement: PropTypes.string.isRequired,
	innerElement: PropTypes.element,
}

export default BOTOverlayTrigger
