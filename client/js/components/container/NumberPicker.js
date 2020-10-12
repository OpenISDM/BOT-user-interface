/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        NumberPicker.js

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
import Select from 'react-select'
import { AppContext } from '../../context/AppContext'
import styleConfig from '../../config/styleConfig'

class NumberPicker extends React.Component {
	static contextType = AppContext

	state = {
		value: this.props.value
			? {
					value: this.props.value,
					label: this.props.value,
			  }
			: null,
	}

	onChange = (value) => {
		this.props.onChange(parseInt(value.value))
		this.setState({
			value,
		})
	}

	render() {
		const options = Array.from(Array(this.props.length).keys()).map((index) => {
			return {
				value: `${index + 1}`,
				label: `${index + 1}`,
			}
		})
		const { placeholder } = this.props
		return (
			<Select
				value={this.state.value}
				className="text-capitalize w-25"
				onChange={(value) => this.onChange(value)}
				options={options}
				isSearchable={false}
				styles={{
					control: (provided) => ({
						...provided,
						fontSize: '1rem',
						minHeight: '3rem',
						position: 'none',
						width: '160px',
						borderRadius: 0,
					}),
				}}
				components={{
					IndicatorSeparator: () => null,
				}}
				placeholder={placeholder}
			/>
		)
	}
}

export default NumberPicker
