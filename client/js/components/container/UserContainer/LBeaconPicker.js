/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        LBeaconPicker.js

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
import { AppContext } from '../../../context/AppContext'
import apiHelper from '../../../helper/apiHelper'

class LBeaconPicker extends React.Component {
	static contextType = AppContext

	state = {
		beacons: [],
	}
	componentDidMount = () => {
		this.getBeacon()
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.area != this.props.area) {
			this.getBeacon()
		}
	}

	getBeacon = () => {
		if (this.props.area) {
			const { locale } = this.context

			apiHelper.lbeaconApiAgent
				.getLbeaconTable({
					locale: locale.abbr,
				})
				.then((res) => {
					const beacons = res.data.rows.filter((beacon) => {
						return (
							parseInt(beacon.uuid.slice(0, 4)) == parseInt(this.props.area)
						)
					})
					this.setState({
						beacons,
					})
				})
		}
	}

	onChange = (option) => {
		this.props.getValue(option.value, this.props.id, this.props.beacon_id)
	}

	render() {
		const options = this.state.beacons.map((item) => {
			return {
				value: item,
				label: item.uuid,
			}
		})
		const defaultValue = {
			value: this.props.value,
			label: this.props.value,
		}

		const { locale } = this.context
		return (
			<Select
				name="beaconPicker"
				value={defaultValue}
				onChange={(value) => this.onChange(value)}
				options={options}
				isSearchable={false}
				components={{
					IndicatorSeparator: () => null,
				}}
			/>
		)
	}
}

export default LBeaconPicker
