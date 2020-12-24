/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        EditGeofenceConfig.js

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
import { Modal, Button, Row, Col } from 'react-bootstrap'
import { Formik, Field, Form } from 'formik'
import { object, string, array } from 'yup'
import { AppContext } from '../../../context/AppContext'
import Switcher, { SWITCH_ENUM } from '../../container/Switcher'
import styleConfig from '../../../config/styleConfig'
import LocaleContext from '../../../context/LocaleContext'
import FormikFormGroup from '../FormikFormGroup'
import BOTTimePicker from '../../BOTComponent/BOTTimePicker'
import config from '../../../config'

const style = {
	icon: {
		minus: {
			color: 'red',
			cursor: 'pointer',
		},
		add: {
			color: 'rgb(0, 123, 255, 0.6)',
			cursor: 'pointer',
		},
	},
	error: {
		color: '#dc3545',
	},
}

const lbeacon_error = {
	f: '',
	p: '',
}

const EditGeofenceConfig = ({
	show,
	isEdited,
	selectedData,
	lbeaconsTable,
	handleClose,
	handleSubmit,
}) => {
	const appContext = React.useContext(AppContext)
	const { locale, stateReducer } = appContext
	const [{ area }] = stateReducer

	const title = isEdited
		? locale.texts.EDIT_GEOFENCE_CONFIG
		: locale.texts.ADD_GEOFENCE_CONFIG

	const currentLocationLabel =
		locale.texts[config.mapConfig.areaOptions[area.id]]

	return (
		<Modal
			show={show}
			onHide={handleClose}
			size="md"
			id="EditGeofenceConfig"
			enforceFocus={false}
			className="text-capitalize"
		>
			<Modal.Header closeButton>{title}</Modal.Header>
			<Modal.Body>
				<Formik
					validateOnChange={false}
					validateOnBlur={false}
					initialValues={{
						enable: isEdited ? selectedData.enable : SWITCH_ENUM.ON,
						geofenceName: isEdited ? selectedData.name : '',
						p_lbeacon: isEdited ? selectedData.p_lbeacon : [],
						f_lbeacon: isEdited ? selectedData.f_lbeacon : [],
						p_rssi: isEdited ? selectedData.p_rssi : '',
						f_rssi: isEdited ? selectedData.f_rssi : '',
						start_time: isEdited ? selectedData.start_time : '00:00:00',
						end_time: isEdited ? selectedData.end_time : '23:59:59',
						selected_p_lbeacon: null,
						selected_f_lbeacon: null,
					}}
					validationSchema={object().shape({
						geofenceName: string().required(locale.texts.NAME_IS_REQUIRED),
						p_rssi: string()
							.required(locale.texts.ENTER_THE_RSSI)
							.test('p_rssi', locale.texts.MUST_BE_NEGATIVE_NUMBER, (value) => {
								if (value < 0) return true
							}),
						f_rssi: string()
							.required(locale.texts.ENTER_THE_RSSI)
							.test('f_rssi', locale.texts.MUST_BE_NEGATIVE_NUMBER, (value) => {
								if (value < 0) return true
							}),
						p_lbeacon: array().required(locale.texts.ALEAST_CHOOSE_ONE_UUID),
						f_lbeacon: array().required(locale.texts.ALEAST_CHOOSE_ONE_UUID),
					})}
					onSubmit={(values) => {
						const monitorConfigPackage = {
							id: isEdited ? selectedData.id : '',
							action: isEdited ? 'set' : 'add',
							name: values.geofenceName,
							enable: values.enable,
							start_time: values.start_time,
							end_time: values.end_time,
							area_id: area.id,
							perimeters_number_uuid: values.p_lbeacon.length,
							perimeters_uuid: values.p_lbeacon.join(','),
							perimeters_rssi: values.p_rssi,
							fences_number_uuid: values.f_lbeacon.length,
							fences_uuid: values.f_lbeacon.join(','),
							fences_rssi: values.f_rssi,
						}
						handleSubmit(monitorConfigPackage)
					}}
					render={({
						values,
						errors,
						touched,
						isSubmitting,
						setFieldValue,
					}) => (
						<Form>
							{(lbeacon_error.f = errors.f_lbeacon) && ''}
							{(lbeacon_error.p = errors.p_lbeacon) && ''}
							<Row className="d-flex align-items-center">
								<Col>
									<Switcher
										leftLabel="on"
										rightLabel="off"
										onChange={(e) => {
											const { value } = e.target
											setFieldValue('enable', value)
										}}
										status={values.enable}
									/>
								</Col>
							</Row>
							<hr />
							<Row noGutters>
								<Col>
									<FormikFormGroup
										type="text"
										name="geofenceName"
										label={locale.texts.NAME}
										error={errors.name}
										touched={touched.name}
										placeholder=""
									/>
								</Col>
								<Col>
									<FormikFormGroup
										type="text"
										label={locale.texts.AREA}
										placeholder={currentLocationLabel}
										disabled={true}
									/>
								</Col>
							</Row>
							<Row noGutters className="mb-3">
								<Col>
									<small className="form-text text-muted">
										{locale.texts.ENABLE_START_TIME}
									</small>
									<BOTTimePicker
										name="start_time"
										style={{ width: '100%' }}
										value={values.start_time}
										onChange={(value) => {
											setFieldValue('start_time', value)
										}}
									/>
								</Col>
								<Col>
									<small className="form-text text-muted">
										{locale.texts.ENABLE_END_TIME}
									</small>
									<BOTTimePicker
										name="end_time"
										style={{ width: '100%' }}
										value={values.end_time}
										onChange={(value) => {
											setFieldValue('end_time', value)
										}}
									/>
								</Col>
							</Row>
							<hr />
							<TypeGroup
								type="perimeters"
								abbr="p"
								title={locale.texts.PERIMETERS_GROUP}
								repository={values.p_lbeacon}
								values={values}
								error={errors}
								setFieldValue={setFieldValue}
								lbeaconsTable={lbeaconsTable}
							/>
							<hr />
							<TypeGroup
								type="fences"
								abbr="f"
								title={locale.texts.FENCES_GROUP}
								repository={values.f_lbeacon}
								values={values}
								error={errors}
								setFieldValue={setFieldValue}
								lbeaconsTable={lbeaconsTable}
							/>
							<Modal.Footer>
								<Button variant="outline-secondary" onClick={handleClose}>
									{locale.texts.CANCEL}
								</Button>
								<Button type="submit" variant="primary" disabled={isSubmitting}>
									{locale.texts.SAVE}
								</Button>
							</Modal.Footer>
						</Form>
					)}
				/>
			</Modal.Body>
		</Modal>
	)
}

export default EditGeofenceConfig

const parseLbeaconsGroup = (type, index) => {
	return [...type.slice(0, index), ...type.slice(index + 1)]
}

const TypeGroup = ({
	type,
	abbr,
	title,
	repository,
	values,
	error,
	setFieldValue,
	lbeaconsTable,
}) => {
	const locale = React.useContext(LocaleContext)

	const lbeaconOptions_p = lbeaconsTable
		.filter((item) => {
			return !values.p_lbeacon.includes(item.uuid)
		})
		.reduce((options, item) => {
			options.push({
				id: item.id,
				value: item.uuid,
				label: `${item.description}[${item.uuid}]`,
			})
			return options
		}, [])

	const lbeaconOptions_f = lbeaconsTable
		.filter((item) => {
			return !values.f_lbeacon.includes(item.uuid)
		})
		.reduce((options, item) => {
			options.push({
				id: item.id,
				value: item.uuid,
				label: `${item.description}[${item.uuid}]`,
			})
			return options
		}, [])

	const typeRssi = `${abbr}_rssi`

	return (
		<div className="form-group">
			<small className="form-text">{title}</small>

			<FormikFormGroup
				type="text"
				name={typeRssi}
				label={locale.texts.RSSI}
				placeholder=""
			/>

			<small className="form-text text-muted">UUID</small>

			{repository.map((item, index) => {
				return item == 'undefined,' ? null : (
					<Row noGutters className="py-1" key={index}>
						<Col
							lg={1}
							className="d-flex align-items-center justify-content-center"
						>
							<i
								className="fas fa-minus-circle"
								style={style.icon.minus}
								type={type}
								name="remove"
								value={index}
								onClick={() => {
									const typeGroup = `${abbr}_lbeacon`
									const value = parseLbeaconsGroup(values[typeGroup], index)
									setFieldValue(typeGroup, value)
								}}
							></i>
						</Col>
						<Col lg={11} className="pr-1">
							<Field
								name={`p-${index + 1}-uuid`}
								type="text"
								className={'form-control' + (error.name ? ' is-invalid' : '')}
								placeholder={item}
								value={item}
								disabled
							/>
						</Col>
					</Row>
				)
			})}
			<Row noGutters className="py-1">
				<Col lg={1}></Col>
				<Col lg={11} className="pr-1">
					<Select
						placeholder={locale.texts.SELECT_LBEACON}
						name={`${abbr}_lbeacon`}
						options={abbr == 'f' ? lbeaconOptions_f : lbeaconOptions_p}
						styles={styleConfig.reactSelect}
						onChange={(value) => {
							const typeGroup = `${abbr}_lbeacon`
							const group = values[typeGroup]
							group.push(value.value)
							setFieldValue(typeGroup, group)
						}}
						components={{
							IndicatorSeparator: () => null,
						}}
					/>
					{`lbeacon_error.${abbr}` && (
						<small className="form-text text-capitaliz" style={style.error}>
							{abbr == 'f' ? lbeacon_error.f : lbeacon_error.p}
						</small>
					)}
				</Col>
			</Row>
		</div>
	)
}
