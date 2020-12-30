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
import { Formik, Field } from 'formik'
import { object, string, array } from 'yup'
import Select from 'react-select'
import { AppContext } from '../../context/AppContext'
import FormikFormGroup from '../presentational/FormikFormGroup'
import BOTButton from '../BOTComponent/BOTButton'
import BOTMap from '../BOTComponent/BOTMap'
import config from '../../config'
import apiHelper from '../../helper/apiHelper'
import NotificationTypeConfig from '../container/NotificationTypeConfig'
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

class BOTAdminGeoFenceSetting extends React.Component {
	static contextType = AppContext

	state = {
		buttonSelected: AREAS.CURRENT_COVERED_AREA,
		personObjectTypes: [],
		deviceObjectTypes: [],
	}

	componentDidMount = () => {
		this.getData()
	}

	checkButtonIsPressed = (identity) => this.state.buttonSelected === identity

	setCurrentPressedButton = (identity) => {
		this.setState({
			buttonSelected: identity,
		})
	}

	getData = async () => {
		const [{ area }] = this.context.stateReducer
		const res = await apiHelper.geofenceApis.getGeofenceAreaConfig({
			areaId: area.id,
		})
		console.log(res.data)
	}

	submit = async () => {
		const areaConfig = {
			area_id: 3,
			monitorDeviceNameListids: [4, 3, 2],
			monitorPatientNameListids: [12, 23, 65],
			montiorObjectTypes: ['Patient', 'Vistor', 'Staff'],
			dayShift: {
				name: SHIFT_NAME.DAY_SHIFT,
				alert_last_sec: 0,
				active_alert_types: 1,
				enable: 1,
				start_time: '00:00:00',
				end_time: '10:00:00',
			},
			swingShift: {
				name: SHIFT_NAME.SWING_SHIFT,
				alert_last_sec: 0,
				active_alert_types: 3,
				enable: 1,
				start_time: '10:00:00',
				end_time: '16:00:00',
			},
			nightShift: {
				name: SHIFT_NAME.NIGHT_SHIFT,
				alert_last_sec: 0,
				active_alert_types: 7,
				enable: 1,
				start_time: '16:00:00',
				end_time: '23:59:59',
			},
		}

		const res = await apiHelper.geofenceApis.setGeofenceAreaConfig({
			areaConfig,
		})
	}

	render() {
		const { locale, stateReducer } = this.context
		const [{ area }] = stateReducer
		const currentAreaModule = Object.values(config.mapConfig.AREA_MODULES).find(
			(module) => parseInt(module.id) === parseInt(area.id)
		)

		const monitoredDevicesOptions = [
			{
				value: locale.texts.ALL_DEVICES,
				label: locale.texts.ALL_DEVICES,
				id: 1,
			},
		]

		const monitoredPatientsOptions = [
			{
				value: locale.texts.ALL_PATIENTS,
				label: locale.texts.ALL_PATIENTS,
				id: 1,
			},
		]

		const monitoredOtherObjectTypesOptions = [
			{
				value: locale.texts.CONTRACTORS,
				label: locale.texts.CONTRACTORS,
				id: 1,
			},
			{
				value: locale.texts.VISITORS,
				label: locale.texts.VISITORS,
				id: 2,
			},
		]

		const defaultShiftList = ['dayShift', 'swingShift', 'nightShift']
		let defaultShiftMapValue = {}
		defaultShiftList.forEach((key) => {
			defaultShiftMapValue = {
				...defaultShiftMapValue,
				[`${key}_start_time`]: '00:00:00',
				[`${key}_end_time`]: '23:59:59',
				[`${key}_enable`]: 0,
				[`${key}_alert_last_sec`]: 0,
				[`${key}_flash_lights`]: 0,
				[`${key}_alert_bells`]: 0,
				[`${key}_msg_on_gui`]: 0,
				[`${key}_send_sms`]: 0,
			}
		})

		return (
			<Col>
				<Formik
					enableReinitialize
					validateOnChange={false}
					validateOnBlur={false}
					initialValues={{
						devices: {},
						patients: {},
						otherObjectTypes: {},
						...defaultShiftMapValue,
					}}
					validationSchema={null}
					onSubmit={(values) => {}}
					render={({
						errors,
						touched,
						values,
						setFieldValue,
						isSubmitting,
					}) => (
						<>
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
									<BOTButton
										pressed={this.checkButtonIsPressed(AREAS.GLOBAL_AREA)}
										onClick={() => {
											this.setCurrentPressedButton(AREAS.GLOBAL_AREA)
											this.submit()
										}}
										text={locale.texts.WHOLE_SITE}
									/>
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
						</>
					)}
				/>
			</Col>
		)
	}
}

BOTAdminGeoFenceSetting.propTypes = {}

export default BOTAdminGeoFenceSetting
