/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        Switcher.js

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
import { AppContext } from '../../context/AppContext'

export const SWITCH_ENUM = {
	OFF: 0,
	ON: 1,
}

const Switcher = ({ leftLabel, rightLabel, status, onChange, subId }) => {
	const { locale } = React.useContext(AppContext)
	status = parseInt(status)

	return (
		<div className="switch-field text-capitalize">
			<input
				type="radio"
				id={`left:${subId}`}
				name="switch"
				value={SWITCH_ENUM.ON}
				onChange={onChange}
				checked={status === SWITCH_ENUM.ON}
			/>
			<label htmlFor={`left:${subId}`}>
				{locale.texts[leftLabel.toUpperCase()]}
			</label>

			<input
				type="radio"
				id={`right:${subId}`}
				name="switch"
				value={SWITCH_ENUM.OFF}
				onChange={onChange}
				checked={status === SWITCH_ENUM.OFF}
			/>
			<label htmlFor={`right:${subId}`}>
				{locale.texts[rightLabel.toUpperCase()]}
			</label>
		</div>
	)
}

export default Switcher
