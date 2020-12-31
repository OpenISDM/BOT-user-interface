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

import React, { useContext, useState, useEffect } from 'react'
import { Row, Col, Form } from 'react-bootstrap'
import Select from 'react-select'
import { AppContext } from '../../context/AppContext'
import FormikFormGroup from '../presentational/FormikFormGroup'
import BOTTimePicker from '../BOTComponent/BOTTimePicker'
import BOTSlider from '../BOTComponent/BOTSlider'
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

	const hasEnable = parseInt(values[`${prefix}_enable`]) === 1
	const [showTimePicker, setShowTimePicker] = useState(hasEnable)
	useEffect(() => {
		setShowTimePicker(hasEnable)
	}, [hasEnable])
	let onTimeValue = showTimePicker ? onTimeOptions[1] : onTimeOptions[0]

	const hasAlertLastSec = parseInt(values[`${prefix}_alert_last_sec`]) > 0
	const [showSlider, setShowSlider] = useState(hasAlertLastSec)
	useEffect(() => {
		setShowSlider(hasAlertLastSec)
	}, [hasAlertLastSec])
	let closeAlertDefaultValue = showSlider
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
								setFieldValue(`${prefix}_enable`, value.value)
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
									if (value.id === 1) {
										setFieldValue(`${prefix}_alert_last_sec`, 0)
									}
								}}
								options={closeAlertOptions}
							/>
							{showSlider ? (
								<BOTSlider
									defaultValue={parseInt(values[`${prefix}_alert_last_sec`])}
									onChange={(value) => {
										setFieldValue(`${prefix}_alert_last_sec`, value)
									}}
								/>
							) : null}
							<div style={{ paddingTop: '5px' }}>
								<Form.Check
									type={'switch'}
									id={`${prefix}_flash_lights`}
									checked={values[`${prefix}_flash_lights`]}
									label={locale.texts.FLASH_LIGHTS}
									onChange={(e) => {
										setFieldValue(`${prefix}_flash_lights`, e.target.checked)
									}}
								/>
								<Form.Check
									type={'switch'}
									id={`${prefix}_alert_bells`}
									checked={values[`${prefix}_alert_bells`]}
									label={locale.texts.ALERT_BELLS}
									onChange={(e) => {
										setFieldValue(`${prefix}_alert_bells`, e.target.checked)
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
								checked={values[`${prefix}_msg_on_gui`]}
								label={locale.texts.SHOW_MESSAGE_ON_GUI}
								onChange={(e) => {
									setFieldValue(`${prefix}_msg_on_gui`, e.target.checked)
								}}
							/>

							<Form.Check
								type={'switch'}
								id={`${prefix}_send_sms`}
								checked={values[`${prefix}_send_sms`]}
								label={locale.texts.SEND_SMS}
								onChange={(e) => {
									setFieldValue(`${prefix}_send_sms`, e.target.checked)
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
