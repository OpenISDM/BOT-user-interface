/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        BOTField.js

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

import React, { Fragment } from 'react'
import styleSheet from '../../config/styleSheet'
import { Field } from 'formik'

const BOTField = ({
	name,
	iconName,
	error,
	touched,
	placeholder,
	label,
	example,
	className,
	boxWidth,
}) => {
	return (
		<div
			className={className}
			style={{
				position: 'relative',
			}}
		>
			{iconName && (
				<i
					className={iconName}
					aria-hidden="true"
					style={{
						position: 'absolute',
						left: 10,
						top: 16,
						color: styleSheet.iconColor,
					}}
				/>
			)}
			<Field
				type="text"
				name={name}
				error={error}
				touched={touched}
				className={'form-control'}
				placeholder={placeholder}
				label={label}
				style={{
					width: boxWidth,
					height: '3rem',
					borderRadius: 0,
					paddingLeft: 35,
				}}
			/>
			{error && (
				<div
					className=""
					style={{
						fontSize: '0.6rem',
						color: styleSheet.warning,
						position: 'absolute',
						left: 0,
					}}
				>
					{error}
				</div>
			)}
			<div
				className=""
				style={{
					fontSize: '0.6rem',
					color: styleSheet.grey,
					position: 'absolute',
					right: 0,
				}}
			>
				{example}
			</div>
		</div>
	)
}

export default BOTField
