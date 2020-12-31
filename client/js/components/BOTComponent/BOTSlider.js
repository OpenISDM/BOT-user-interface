/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        BOTSlider.js

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

import 'rc-tooltip/assets/bootstrap.css'
import React, { useState } from 'react'
import Slider, { SliderTooltip } from 'rc-slider'
const { Handle } = Slider
const handle = (props) => {
	const { value, dragging, index, ...restProps } = props
	return (
		<SliderTooltip
			prefixCls="rc-slider-tooltip"
			overlay={`${value}`}
			visible={dragging}
			placement="top"
			key={index}
		>
			<Handle value={value} {...restProps} />
		</SliderTooltip>
	)
}

const BOTSlider = ({ min = 0, max = 100, defaultValue = 0, onChange }) => {
	const [value, setValue] = useState([defaultValue])
	return (
		<div
			style={{
				marginTop: '10px',
				marginBottom: '10px',
				marginLeft: '5px',
				marginRight: '5px',
			}}
		>
			<div style={{}}>{value}</div>
			<Slider
				min={min}
				max={max}
				defaultValue={defaultValue}
				handle={handle}
				onChange={(value) => {
					setValue(value)
					onChange(value)
				}}
			/>
		</div>
	)
}

export default BOTSlider
