/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        AreaPicker.js

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
import { Modal, Button, Row, Col } from 'react-bootstrap'
import Select from 'react-select'
import { AppContext } from '../../../context/AppContext'
import axios from 'axios'
import config from '../../../config'

class AreaPicker extends React.Component {
	static contextType = AppContext

	state = {
		selectedArea: '0',
		length: 24,
		areaList: {},
	}
	componentDidMount = () => {
		this.getArea()
	}

	getArea = () => {
		this.setState({
			areaList: config.mapConfig.areaOptions,
		})
	}

	onChange = (value) => {
		const id = this.props.id
		this.props.getValue(value, id)
		this.setState({
			time: value,
		})
	}

	render() {
		const { locale } = this.context
		const options = []
		for (const i in this.state.areaList) {
			options.push({
				value: i,
				label: locale.texts[this.state.areaList[i]],
			})
		}

		const defaultValue = {
			value: this.props.area_id,
			label: this.state.areaList[parseInt(this.props.area_id)],
		}
		return (
			<Select
				name="areaPicker"
				value={defaultValue}
				onChange={(value) => this.onChange(value)}
				options={options || []}
				isSearchable={false}
				components={{
					IndicatorSeparator: () => null,
				}}
			/>
		)
	}
}

export default AreaPicker
