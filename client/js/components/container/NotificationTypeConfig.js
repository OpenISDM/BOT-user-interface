/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        NotificationTypeConfig.js

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

import React, { useContext, useState } from 'react'
import { Row, Col, Form } from 'react-bootstrap'
import Select from 'react-select'
import { object, string } from 'yup'
import { AppContext } from '../../context/AppContext'
import FormikFormGroup from '../presentational/FormikFormGroup'
import BOTTimePicker from '../BOTComponent/BOTTimePicker'
import BOTSlider from '../BOTComponent/BOTSlider'
import styleConfig from '../../config/styleConfig'
import PropTypes from 'prop-types'

const NotificationTypeConfig = ({
	prefix = '',
	name = '',
	values = {},
	errors = {},
	touched = {},
	setFieldValue,
}) => {
	const { locale } = useContext(AppContext)

	const onTimeOptions = [
		{
			value: 0,
			label: locale.texts.OFF,
			id: 1,
		},
		{
			value: 1,
			label: locale.texts.ON,
			id: 2,
		},
	]
	const closeAlertOptions = [
		{
			value: 0,
			label: locale.texts.CLOSE_MANUALLY,
			id: 1,
		},
		{
			value: 1,
			label: locale.texts.KEEP_ALERTING_IN_SEC,
			id: 2,
		},
	]

	const hasEnable = parseInt(values[`${prefix}_enable`].value) === 1
	const [showTimePicker, setShowTimePicker] = useState(hasEnable)
	const onTimeValue = showTimePicker
		? values[`${prefix}_enable`]
		: onTimeOptions[0]

	const hasAlertLastSec = parseInt(values[`${prefix}_alert_last_sec`]) > 0
	const [showSlider, setShowSlider] = useState(hasAlertLastSec)
	const closeAlertDefaultValue = showSlider
		? closeAlertOptions[1]
		: closeAlertOptions[0]

	return (
		<Col>
			<div
				className="font-size-90-percent color-black d-flex justify-content-center"
				style={{ marginBottom: '5px' }}
			>
				{name}
			</div>
			<div style={{ paddingTop: '10px' }}>
				<FormikFormGroup
					type="text"
					label={locale.texts.MONITOR_ON_TIME}
					component={() => (
						<Select
							placeholder=""
							name={`${prefix}_enable`}
							value={onTimeValue}
							onChange={(value) => {
								setShowTimePicker(value.id === 2)
								setFieldValue(`${prefix}_enable`, value)
							}}
							options={onTimeOptions}
						/>
					)}
				/>
			</div>
			{showTimePicker ? (
				<Row>
					<Col>
						<small className="form-text text-muted">
							{locale.texts.ENABLE_START_TIME}
						</small>
						<BOTTimePicker
							name={`${prefix}_start_time`}
							style={{ width: '100%' }}
							value={values[`${prefix}_start_time`]}
							onChange={(value) => {
								setFieldValue(`${prefix}_start_time`, value)
							}}
						/>
					</Col>
					<Col>
						<small className="form-text text-muted">
							{locale.texts.ENABLE_END_TIME}
						</small>
						<BOTTimePicker
							name={`${prefix}_end_time`}
							style={{ width: '100%' }}
							value={values[`${prefix}_end_time`]}
							onChange={(value) => {
								setFieldValue(`${prefix}_end_time`, value)
							}}
						/>
					</Col>
				</Row>
			) : null}

			<div style={{ paddingTop: '15px' }}>
				<FormikFormGroup
					type="text"
					label={locale.texts.ALERT_DEVICES_RESET}
					component={() => (
						<>
							<Select
								placeholder=""
								name={`${prefix}_alert_reset`}
								value={closeAlertDefaultValue}
								onChange={(value) => {
									setShowSlider(value.id === 2)
								}}
								options={closeAlertOptions}
							/>
							{showSlider ? (
								<BOTSlider
									onChange={(value) =>
										setFieldValue(`${prefix}_alert_last_sec`, value)
									}
								/>
							) : null}
							<div style={{ paddingTop: '5px' }}>
								<Form.Check
									type={'switch'}
									id={`${prefix}_flash_lights`}
									label={locale.texts.FLASH_LIGHTS}
									onChange={(value) => {
										setFieldValue(`${prefix}_flash_lights`, value)
									}}
								/>
								<Form.Check
									type={'switch'}
									id={`${prefix}_alert_bells`}
									label={locale.texts.ALERT_BELLS}
									onChange={(value) => {
										setFieldValue(`${prefix}_alert_bells`, value)
									}}
								/>
							</div>
						</>
					)}
				/>
			</div>

			<div style={{ paddingTop: '10px' }}>
				<FormikFormGroup
					type="text"
					label={locale.texts.NOTIFICATION_OPTIONS}
					component={() => (
						<>
							<Form.Check
								type={'switch'}
								id={`${prefix}_msg_on_gui`}
								label={locale.texts.SHOW_MESSAGE_ON_GUI}
								onChange={(value) => {
									setFieldValue(`${prefix}_msg_on_gui`, value)
								}}
							/>

							<Form.Check
								type={'switch'}
								id={`${prefix}_send_sms`}
								label={locale.texts.SEND_SMS}
								onChange={(value) => {
									setFieldValue(`${prefix}_send_sms`, value)
								}}
							/>
						</>
					)}
				/>
			</div>
		</Col>
	)
}

NotificationTypeConfig.propTypes = {
	name: PropTypes.string,
}

export default NotificationTypeConfig
