/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        CheckboxGroup.js

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

class CheckboxGroup extends React.Component {
	handleChange = (event) => {
		const target = event.currentTarget
		const valueArray = [...this.props.value] || []

		if (target.checked) {
			valueArray.push(target.id)
		} else {
			valueArray.splice(valueArray.indexOf(target.id), 1)
		}
		this.props.onChange(this.props.id, valueArray)
	}

	handleBlur = () => {
		this.props.onBlur(this.props.id, true)
	}

	render() {
		// const { value, error, touched, label, className, children } = this.props
		const { value, children } = this.props
		return (
			<div className="d-flex flex-column">
				{React.Children.map(children, (child) => {
					return React.cloneElement(child, {
						value: value.includes(child.props.id),
						onChange: this.handleChange,
					})
				})}
			</div>
		)
	}
}

CheckboxGroup.propTypes = {
	id: PropTypes.string,
	value: PropTypes.object,
	error: PropTypes.object,
	touched: PropTypes.object,
	label: PropTypes.string,
	className: PropTypes.string,
	onBlur: PropTypes.func,
	onChange: PropTypes.func,
	children: PropTypes.object,
}

export default CheckboxGroup
