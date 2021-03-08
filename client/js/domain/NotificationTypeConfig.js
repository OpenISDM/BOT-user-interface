import React, { useContext, useState, useEffect } from 'react'
import { Row, Col, Form } from 'react-bootstrap'
import { AppContext } from '../context/AppContext'
import FormikFormGroup from './FormikFormGroup'
import TimePicker from '../components/TimePicker'
import Slider from '../components/Slider'
import Select from '../components/Select'
import PropTypes from 'prop-types'

const NotificationTypeConfig = ({
	prefix = '',
	name,
	values = {},
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

	if (prefix) {
		prefix = `${prefix}_`
	}

	const hasEnable = parseInt(values[`${prefix}enable`]) === 1
	const [showTimePicker, setShowTimePicker] = useState(hasEnable)
	useEffect(() => {
		setShowTimePicker(hasEnable)
	}, [hasEnable])
	const onTimeValue = showTimePicker ? onTimeOptions[1] : onTimeOptions[0]

	const hasAlertLastSec = parseInt(values[`${prefix}alert_last_sec`]) > 0
	const [showSlider, setShowSlider] = useState(hasAlertLastSec)
	useEffect(() => {
		setShowSlider(hasAlertLastSec)
	}, [hasAlertLastSec])

	const closeAlertDefaultValue = showSlider
		? closeAlertOptions[1]
		: closeAlertOptions[0]

	return (
		<Col>
			{name ? (
				<div
					className="font-size-90-percent color-black d-flex justify-content-center"
					style={{ marginBottom: '5px' }}
				>
					{name}
				</div>
			) : null}
			<div style={{ paddingTop: '10px' }}>
				<FormikFormGroup
					type="text"
					label={locale.texts.MONITOR_ON_TIME}
					component={() => (
						<Select
							placeholder=""
							name={`${prefix}enable`}
							value={onTimeValue}
							onChange={(value) => {
								setShowTimePicker(value.id === 2)
								setFieldValue(`${prefix}enable`, value.value)
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
						<TimePicker
							name={`${prefix}start_time`}
							style={{ width: '100%' }}
							value={values[`${prefix}start_time`]}
							onChange={(value) => {
								setFieldValue(`${prefix}start_time`, value)
							}}
						/>
					</Col>
					<Col>
						<small className="form-text text-muted">
							{locale.texts.ENABLE_END_TIME}
						</small>
						<TimePicker
							name={`${prefix}end_time`}
							style={{ width: '100%' }}
							value={values[`${prefix}end_time`]}
							onChange={(value) => {
								setFieldValue(`${prefix}end_time`, value)
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
								name={`${prefix}alert_reset`}
								value={closeAlertDefaultValue}
								onChange={(value) => {
									setShowSlider(value.id === 2)
									if (value.id === 1) {
										setFieldValue(`${prefix}alert_last_sec`, 0)
									}
								}}
								options={closeAlertOptions}
							/>
							{showSlider ? (
								<Slider
									defaultValue={parseInt(values[`${prefix}alert_last_sec`])}
									onChange={(value) => {
										setFieldValue(`${prefix}alert_last_sec`, value)
									}}
								/>
							) : null}
							<div style={{ paddingTop: '5px' }}>
								<Form.Check
									type={'switch'}
									id={`${prefix}flash_lights`}
									checked={values[`${prefix}flash_lights`]}
									label={locale.texts.FLASH_LIGHTS}
									onChange={(e) => {
										setFieldValue(`${prefix}flash_lights`, e.target.checked)
									}}
								/>
								<Form.Check
									type={'switch'}
									id={`${prefix}alert_bells`}
									checked={values[`${prefix}alert_bells`]}
									label={locale.texts.ALERT_BELLS}
									onChange={(e) => {
										setFieldValue(`${prefix}alert_bells`, e.target.checked)
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
								id={`${prefix}msg_on_gui`}
								checked={values[`${prefix}msg_on_gui`]}
								label={locale.texts.SHOW_MESSAGE_ON_GUI}
								onChange={(e) => {
									setFieldValue(`${prefix}msg_on_gui`, e.target.checked)
								}}
							/>

							<Form.Check
								type={'switch'}
								id={`${prefix}send_sms`}
								checked={values[`${prefix}send_sms`]}
								label={locale.texts.SEND_SMS}
								onChange={(e) => {
									setFieldValue(`${prefix}send_sms`, e.target.checked)
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
	prefix: PropTypes.string,
	values: PropTypes.object,
	errors: PropTypes.object,
	touched: PropTypes.object,
	setFieldValue: PropTypes.object,
}

export default NotificationTypeConfig
