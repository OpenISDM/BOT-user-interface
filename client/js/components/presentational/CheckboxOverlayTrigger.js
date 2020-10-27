/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        Checkbox.js

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
import styleConfig from '../../config/styleConfig'

const CheckboxOverlayTrigger = ({
	popoverTitle,
	popoverBody,
	name,
	onChange,
	id,
	label,
	disabled,
	placement,
	trigger,
	checked,
}) => {
	return (
		<OverlayTrigger
			trigger={trigger}
			key={id}
			placement={placement}
			overlay={
				<Popover id={`popover-positioned-${placement}`}>
					{/* <Popover.Content> */}
					<textarea disabled style={{ height: '300px', width: '200px' }}>
						{popoverBody}
					</textarea>
					{/* </Popover.Content> */}
					<Popover.Title as="h3">{popoverTitle}</Popover.Title>
				</Popover>
			}
		>
			<div className="pretty p-default p-round" style={styleConfig.checkbox}>
				<input
					name={name}
					id={id}
					type="checkbox"
					checked={checked}
					onChange={onChange}
					disabled={disabled}
				/>
				<div className="state p-primary" style={{ marginLeft: '20px' }}>
					<label>{name}</label>
				</div>
			</div>
		</OverlayTrigger>
	)
}

CheckboxOverlayTrigger.propTypes = {
	popoverTitle: PropTypes.string.isRequired,
	popoverBody: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func,
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	trigger: PropTypes.string.isRequired,
	disabled: PropTypes.bool,
	checked: PropTypes.bool,
	placement: PropTypes.string.isRequired,
}

export default CheckboxOverlayTrigger
