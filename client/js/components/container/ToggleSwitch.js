/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        ToggleSwitch.js

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
import LocaleContext from '../../context/LocaleContext'

class ToggleSwitch extends React.Component {
	state = {
		toggle: this.props.locationAccuracyMap[this.props.rssi],
	}

	toggleState = (e) => {
		const name = e.target.name
		this.props.changeLocationAccuracy(e.target.value)
		this.setState({
			toggle: name,
		})
	}

	render() {
		const locale = this.context.texts

		return (
			<form className="switch-field text-capitalize">
				<input
					type="radio"
					id="switch_left"
					name={this.props.leftLabel}
					value={0}
					onChange={this.toggleState}
					checked={this.state.toggle == this.props.leftLabel}
				/>
				<label htmlFor="switch_left">
					{locale[this.props.leftLabel.toUpperCase()]}
				</label>

				<input
					type="radio"
					id="switch_middle"
					name={this.props.defaultLabel}
					value={1}
					onChange={this.toggleState}
					checked={this.state.toggle == this.props.defaultLabel}
				/>
				<label htmlFor="switch_middle">
					{locale[this.props.defaultLabel.toUpperCase()]}
				</label>

				<input
					type="radio"
					id="switch_right"
					name={this.props.rightLabel}
					value={2}
					onChange={this.toggleState}
					checked={this.state.toggle == this.props.rightLabel}
				/>
				<label htmlFor="switch_right">
					{locale[this.props.rightLabel.toUpperCase()]}
				</label>
			</form>
		)
	}
}

ToggleSwitch.contextType = LocaleContext

export default ToggleSwitch
