/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        BOTAdminGeoFenceSetting.js

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
import { Row, Col } from 'react-bootstrap'
import { Formik, Form } from 'formik'
import { object, string, array } from 'yup'
import Select from 'react-select'
import { AppContext } from '../../context/AppContext'
import FormikFormGroup from '../presentational/FormikFormGroup'
import BOTButton from '../BOTComponent/BOTButton'
import BOTMap from '../BOTComponent/BOTMap'
import config from '../../config'
import apiHelper from '../../helper/apiHelper'
import { getBitValue, findExpectedBitValue } from '../../helper/utilities'
import NotificationTypeConfig from '../container/NotificationTypeConfig'
import messageGenerator from '../../helper/messageGenerator'
import { SAVE_SUCCESS } from '../../config/wordMap'
import PropTypes from 'prop-types'

const AREAS = {
	CURRENT_COVERED_AREA: 0,
	GLOBAL_AREA: 1,
}

const SHIFT_NAME = {
	DAY_SHIFT: 'DAY_SHIFT',
	SWING_SHIFT: 'SWING_SHIFT',
	NIGHT_SHIFT: 'NIGHT_SHIFT',
}

const DEFAULT_CONSTRAINT_VALUE = {
	MONITORED_DEVICE_ALL: 0,
	MONITORED_PATIENT_ALL: 0,
}

class BOTAdminGeoFenceSetting extends React.Component {
	static contextType = AppContext

	state = {
		buttonSelected: AREAS.CURRENT_COVERED_AREA,
		personObjectTypes: [],
		deviceObjectTypes: [],
		areaConfig: {},
		geofenceNotificationConfigs: [],
	}

	componentDidMount = () => {
		this.getData()
		this.getNamedList()
	}

	checkButtonIsPressed = (identity) => this.state.buttonSelected === identity

	setCurrentPressedButton = (identity) => {
		this.setState({
			buttonSelected: identity,
		})
	}

	getNamedList = async () => {
		const [{ area }] = this.context.stateReducer
		const res = await apiHelper.namedListApiAgent.getNamedList({
			areaId: area.id,
			type: 1,
			isUserDefined: true,
		})
		console.log(res)
	}

	getData = async () => {
		const [{ area }] = this.context.stateReducer
		const res = await apiHelper.geofenceApis.getGeofenceAreaConfig({
			areaId: area.id,
		})

		if (res) {
			this.setState({
				areaConfig: res.data.areaConfig,
				geofenceNotificationConfigs: res.data.geofenceNotificationConfigs,
			})
		}
	}

	handleSubmit = async (submitValue) => {
		const res = await apiHelper.geofenceApis.setGeofenceAreaConfig({
			areaConfig: submitValue,
		})
		await messageGenerator.setSuccessMessage(SAVE_SUCCESS)
		this.getData()
	}

	caculateAlertTypes = ({ bell, light, gui, sms }) => {
		const bellBit = getBitValue({
			status: bell ? config.STATUS_ENUM.ENABLED : config.STATUS_ENUM.DISABLED,
			bitValueEnum: config.NOTIFICATION_ALERT_TYPES_ENUM.BELL,
		})
		const lightBit = getBitValue({
			status: light ? config.STATUS_ENUM.ENABLED : config.STATUS_ENUM.DISABLED,
			bitValueEnum: config.NOTIFICATION_ALERT_TYPES_ENUM.LIGHT,
		})
		const guiBit = getBitValue({
			status: gui ? config.STATUS_ENUM.ENABLED : config.STATUS_ENUM.DISABLED,
			bitValueEnum: config.NOTIFICATION_ALERT_TYPES_ENUM.GUI,
		})
		const smsBit = getBitValue({
			status: sms ? config.STATUS_ENUM.ENABLED : config.STATUS_ENUM.DISABLED,
			bitValueEnum: config.NOTIFICATION_ALERT_TYPES_ENUM.SMS,
		})

		return bellBit + lightBit + guiBit + smsBit
	}

	render() {
		const { locale, stateReducer } = this.context
		const [{ area }] = stateReducer
		const currentAreaModule = Object.values(config.mapConfig.AREA_MODULES).find(
			(module) => parseInt(module.id) === parseInt(area.id)
		)

		const { monitored_object_types } = this.state.areaConfig

		const monitoredDevicesOptions = [
			{
				value: DEFAULT_CONSTRAINT_VALUE.MONITORED_DEVICE_ALL,
				label: locale.texts.ALL_DEVICES,
				id: 1,
			},
		]

		const monitoredPatientsOptions = [
			{
				value: DEFAULT_CONSTRAINT_VALUE.MONITORED_PATIENT_ALL,
				label: locale.texts.ALL_PATIENTS,
				id: 2,
			},
		]

		const monitoredOtherObjectTypesOptions = [
			{
				value: config.OBJECT_TABLE_SUB_TYPE.CONTRACTOR,
				label: locale.texts.CONTRACTORS,
				id: 1,
			},
			{
				value: config.OBJECT_TABLE_SUB_TYPE.STAFF,
				label: locale.texts.STAFF,
				id: 2,
			},
			{
				value: config.OBJECT_TABLE_SUB_TYPE.VISITOR,
				label: locale.texts.VISITORS,
				id: 3,
			},
		]

		const defaultShiftList = Object.values(SHIFT_NAME)
		let defaultShiftMapValue = {}
		defaultShiftList.forEach((key) => {
			const shiftValue = this.state.geofenceNotificationConfigs.find(
				(item) => item.name === key
			)
			if (shiftValue) {
				defaultShiftMapValue = {
					...defaultShiftMapValue,
					[`${key}_start_time`]: shiftValue.start_time,
					[`${key}_end_time`]: shiftValue.end_time,
					[`${key}_enable`]: shiftValue.enable,
					[`${key}_alert_last_sec`]: shiftValue.alert_last_sec,
					[`${key}_flash_lights`]: findExpectedBitValue({
						targetDecimal: parseInt(shiftValue.active_alert_types),
						expectedDecimal: parseInt(
							config.NOTIFICATION_ALERT_TYPES_ENUM.LIGHT
						),
					}),
					[`${key}_alert_bells`]: findExpectedBitValue({
						targetDecimal: parseInt(shiftValue.active_alert_types),
						expectedDecimal: parseInt(
							config.NOTIFICATION_ALERT_TYPES_ENUM.BELL
						),
					}),
					[`${key}_msg_on_gui`]: findExpectedBitValue({
						targetDecimal: parseInt(shiftValue.active_alert_types),
						expectedDecimal: parseInt(config.NOTIFICATION_ALERT_TYPES_ENUM.GUI),
					}),
					[`${key}_send_sms`]: findExpectedBitValue({
						targetDecimal: parseInt(shiftValue.active_alert_types),
						expectedDecimal: parseInt(config.NOTIFICATION_ALERT_TYPES_ENUM.SMS),
					}),
				}
			} else {
				defaultShiftMapValue = {
					...defaultShiftMapValue,
					[`${key}_start_time`]: '00:00:00',
					[`${key}_end_time`]: '23:59:59',
					[`${key}_enable`]: 0,
					[`${key}_alert_last_sec`]: 0,
					[`${key}_flash_lights`]: false,
					[`${key}_alert_bells`]: false,
					[`${key}_msg_on_gui`]: false,
					[`${key}_send_sms`]: false,
				}
			}
		})

		let currentObjectType
		if (monitored_object_types) {
			const first = monitored_object_types.split(',')[0]
			currentObjectType = monitoredOtherObjectTypesOptions.find((item) => {
				return item.value === first
			})
		}

		const initialValues = {
			devices: monitoredDevicesOptions[0],
			patients: monitoredPatientsOptions[0],
			otherObjectTypes: currentObjectType,
			...defaultShiftMapValue,
		}
		return (
			<Col>
				<Formik
					enableReinitialize
					validateOnChange={false}
					validateOnBlur={false}
					initialValues={initialValues}
					onSubmit={(values) => {
						const submitValue = {
							area_id: area.id,
							monitorDeviceNameListids: [values.devices.value],
							monitorPatientNameListids: [values.patients.value],
							montiorObjectTypes: [values.otherObjectTypes.value],
							dayShift: {
								name: SHIFT_NAME.DAY_SHIFT,
								alert_last_sec: values[`${defaultShiftList[0]}_alert_last_sec`],
								active_alert_types: this.caculateAlertTypes({
									bell: values[`${defaultShiftList[0]}_alert_bells`],
									light: values[`${defaultShiftList[0]}_flash_lights`],
									gui: values[`${defaultShiftList[0]}_msg_on_gui`],
									sms: values[`${defaultShiftList[0]}_send_sms`],
								}),
								enable: values[`${defaultShiftList[0]}_enable`].value,
								start_time: values[`${defaultShiftList[0]}_start_time`],
								end_time: values[`${defaultShiftList[0]}_end_time`],
							},
							swingShift: {
								name: SHIFT_NAME.SWING_SHIFT,
								alert_last_sec: values[`${defaultShiftList[1]}_alert_last_sec`],
								active_alert_types: this.caculateAlertTypes({
									bell: values[`${defaultShiftList[1]}_alert_bells`],
									light: values[`${defaultShiftList[1]}_flash_lights`],
									gui: values[`${defaultShiftList[1]}_msg_on_gui`],
									sms: values[`${defaultShiftList[1]}_send_sms`],
								}),
								enable: values[`${defaultShiftList[1]}_enable`].value,
								start_time: values[`${defaultShiftList[1]}_start_time`],
								end_time: values[`${defaultShiftList[1]}_end_time`],
							},
							nightShift: {
								name: SHIFT_NAME.NIGHT_SHIFT,
								alert_last_sec: values[`${defaultShiftList[2]}_alert_last_sec`],
								active_alert_types: this.caculateAlertTypes({
									bell: values[`${defaultShiftList[2]}_alert_bells`],
									light: values[`${defaultShiftList[2]}_flash_lights`],
									gui: values[`${defaultShiftList[2]}_msg_on_gui`],
									sms: values[`${defaultShiftList[2]}_send_sms`],
								}),
								enable: values[`${defaultShiftList[2]}_enable`],
								start_time: values[`${defaultShiftList[2]}_start_time`],
								end_time: values[`${defaultShiftList[2]}_end_time`],
							},
						}
						this.handleSubmit(submitValue)
					}}
					render={({
						errors,
						touched,
						values,
						setFieldValue,
						isSubmitting,
					}) => {
						return (
							<Form>
								<Row style={{ justifyContent: 'space-between' }}>
									<div>
										<BOTButton
											pressed={this.checkButtonIsPressed(
												AREAS.CURRENT_COVERED_AREA
											)}
											onClick={() => {
												this.setCurrentPressedButton(AREAS.CURRENT_COVERED_AREA)
											}}
											text={locale.texts[currentAreaModule.name]}
										/>
										{/* <BOTButton
											pressed={this.checkButtonIsPressed(AREAS.GLOBAL_AREA)}
											onClick={() => {
												this.setCurrentPressedButton(AREAS.GLOBAL_AREA)
												this.submit()
											}}
											text={locale.texts.WHOLE_SITE}
										/> */}
									</div>

									<BOTButton
										pressed={true}
										text={locale.texts.SAVE}
										type="submit"
										variant="primary"
										disabled={isSubmitting}
									/>
								</Row>
								<hr />
								<Row style={{ height: '300px' }}>
									<BOTMap showGeoFence={true} />
								</Row>
								<hr />
								<div
									className="font-size-120-percent color-black d-flex justify-content-center"
									style={{ paddingBottom: '5px' }}
								>
									{locale.texts.MONITORED_OBJECTS}
								</div>
								<Row noGutters>
									<Col>
										<FormikFormGroup
											type="text"
											name="devices"
											label={locale.texts.DEVICES}
											error={errors.devices}
											touched={touched.devices}
											placeholder=""
											component={() => (
												<Select
													placeholder=""
													name="devices"
													value={values.devices}
													onChange={(value) => setFieldValue('devices', value)}
													options={monitoredDevicesOptions}
												/>
											)}
										/>
									</Col>
									<Col>
										<FormikFormGroup
											type="text"
											name="patients"
											label={locale.texts.PATIENTS}
											error={errors.patients}
											touched={touched.patients}
											placeholder=""
											component={() => (
												<Select
													placeholder=""
													name="patients"
													value={values.patients}
													onChange={(value) => setFieldValue('patients', value)}
													options={monitoredPatientsOptions}
												/>
											)}
										/>
									</Col>
									<Col>
										<FormikFormGroup
											type="text"
											name="otherObjectTypes"
											label={locale.texts.OTHER_OBJECT_TYPES}
											error={errors.otherObjectTypes}
											touched={touched.otherObjectTypes}
											placeholder=""
											component={() => (
												<Select
													placeholder=""
													name="otherObjectTypes"
													value={values.otherObjectTypes}
													onChange={(value) =>
														setFieldValue('otherObjectTypes', value)
													}
													options={monitoredOtherObjectTypesOptions}
												/>
											)}
										/>
									</Col>
								</Row>
								<hr />
								<div
									className="font-size-120-percent color-black d-flex justify-content-center"
									style={{ paddingBottom: '5px' }}
								>
									{locale.texts.ALERTS}
								</div>
								<Row>
									<NotificationTypeConfig
										values={values}
										errors={errors}
										touched={touched}
										name={locale.texts.DAY_SHIFT}
										prefix={defaultShiftList[0]}
										setFieldValue={setFieldValue}
									/>
									<NotificationTypeConfig
										values={values}
										errors={errors}
										touched={touched}
										name={locale.texts.SWING_SHIFT}
										prefix={defaultShiftList[1]}
										setFieldValue={setFieldValue}
									/>
									<NotificationTypeConfig
										values={values}
										errors={errors}
										touched={touched}
										name={locale.texts.NIGHT_SHIFT}
										prefix={defaultShiftList[2]}
										setFieldValue={setFieldValue}
									/>
								</Row>
							</Form>
						)
					}}
				/>
			</Col>
		)
	}
}

BOTAdminGeoFenceSetting.propTypes = {}

export default BOTAdminGeoFenceSetting
