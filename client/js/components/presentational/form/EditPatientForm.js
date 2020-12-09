/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        EditPatientForm.js

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
import config from '../../../config'
import { AppContext } from '../../../context/AppContext'
import Creatable, { makeCreatableSelect } from 'react-select/creatable'
import { Formik, Field, Form } from 'formik'
import { object, string } from 'yup'
import CheckboxGroup from '../../container/CheckboxGroup'
import Checkbox from '../Checkbox'
import FormikFormGroup from '../FormikFormGroup'
import styleConfig from '../../../config/styleConfig'
import { DISASSOCIATE } from '../../../config/wordMap'
import { isEmpty, macaddrValidation } from '../../../helper/validation'

const monitorTypeMap = {}
Object.keys(config.monitorType).forEach((key) => {
	monitorTypeMap[config.monitorType[key]] = key
})

class EditPatientForm extends React.Component {
	static contextType = AppContext

	render() {
		const { locale } = this.context

		const {
			title,
			selectedRowData,
			physicianList = [],
			show,
			handleClose,
		} = this.props

		const {
			name,
			area_name,
			mac_address,
			asset_control_number,
			object_type,
			monitor_type = [],
			room,
		} = selectedRowData

		const areaOptions = this.props.areaTable.map((area) => {
			return {
				value: area.name,
				label: locale.texts[area.name.toUpperCase().replace(/ /g, '_')],
				id: area.id,
			}
		})

		// const genderOptions = Object.values(config.GENDER_OPTIONS).map((item) => {
		// 	item.label = locale.texts[item.value.toUpperCase()]
		// 	return item
		// })

		const physicianListOptions = physicianList.map((user) => {
			return {
				value: user.id,
				label: user.name,
			}
		})

		physicianList.map((user) => {
			selectedRowData.physician_id == user.id
				? (selectedRowData.physician = {
						value: user.id,
						label: user.name,
				  })
				: null
		})

		return (
			<Modal show={show} onHide={handleClose} size="md">
				<Modal.Header closeButton className="text-capitalize">
					{locale.texts[title.toUpperCase().replace(/ /g, '_')]}
				</Modal.Header>
				<Modal.Body>
					<Formik
						initialValues={{
							area: area_name || '',

							physician: '',

							name: name || '',

							mac_address: selectedRowData.isBind
								? {
										label: mac_address,
										value: mac_address,
								  }
								: null,

							asset_control_number: asset_control_number || '',

							// gender: object_type || '',

							monitorType:
								selectedRowData.length != 0 ? monitor_type.split('/') : [],

							room: room
								? {
										value: room,
										label: room,
								  }
								: null,
						}}
						validationSchema={object().shape({
							name: string()
								.required(locale.texts.NAME_IS_REQUIRED)
								.max(40, locale.texts.LIMIT_IN_FOURTY_CHARACTER),

							area: string().required(locale.texts.AREA_IS_REQUIRED),

							// gender: string().required(locale.texts.GENDER_IS_REQUIRED),

							asset_control_number: string()
								.required(locale.texts.NUMBER_IS_REQUIRED)
								.test(
									'asset_control_number',
									locale.texts.THE_ID_IS_ALREADY_USED,
									(value) => {
										if (value == undefined) return false

										if (!this.props.disableASN) {
											if (value != null) {
												if (
													this.props.objectTable
														.map((item) =>
															item.asset_control_number.toUpperCase()
														)
														.includes(value.toUpperCase())
												) {
													return false
												}
											}
										}
										return true
									}
								)
								.max(40, locale.texts.LIMIT_IN_FOURTY_CHARACTER),

							mac_address: object()
								.nullable()
								/** check if there are duplicated mac address in object table */
								.test(
									'mac_address',
									locale.texts.INCORRECT_MAC_ADDRESS_FORMAT,
									(obj) => {
										console.log(obj)
										if (obj == undefined) return true
										if (obj == null || isEmpty(obj)) return true
										if (selectedRowData.length == 0) return true
										return macaddrValidation(obj.label)
									}
								),
						})}
						onSubmit={(values, { setStatus, setSubmitting }) => {
							const monitor_type = values.monitorType
								? values.monitorType
										.filter((item) => item)
										.reduce((sum, item) => {
											sum += parseInt(monitorTypeMap[item])
											return sum
										}, 0)
								: 0

							physicianList.map((item) => {
								if (values.physician)
									item.name == values.physician.value
										? (values.physician.value = item.id)
										: null
							})

							const postOption = {
								...values,
								name: values.name.trim(),
								area_id: values.area.id,
								// gender_id: values.gender.value,
								monitor_type,
								room: values.room ? values.room.label : '',
								object_type: config.OBJECT_TYPE.PERSON,
								physicianIDNumber: values.physician
									? values.physician.value
									: this.props.physicianIDNumber,
								mac_address:
									isEmpty(values.mac_address) || values.mac_address == null
										? null
										: values.mac_address.label,
							}

							this.props.handleSubmit(postOption)
						}}
						render={({
							values,
							errors,
							status,
							touched,
							isSubmitting,
							setFieldValue,
							submitForm,
						}) => (
							<Form>
								<Row noGutters>
									<Col>
										<FormikFormGroup
											type="text"
											name="name"
											label={locale.texts.NAME}
											error={errors.name}
											touched={touched.name}
											placeholder=""
										/>
									</Col>
									<Col>
										{/* <FormikFormGroup
											name="gender"
											label={locale.texts.PATIENT_GENDER}
											error={errors.gender}
											touched={touched.gender}
											component={() => (
												<Select
													placeholder={locale.texts.CHOOSE_GENDER}
													name="gender"
													styles={styleConfig.reactSelect}
													value={values.gender}
													onChange={(value) => setFieldValue('gender', value)}
													options={genderOptions || []}
													components={{
														IndicatorSeparator: () => null,
													}}
												/>
											)}
										/> */}
									</Col>
								</Row>
								<Row noGutters>
									<Col>
										<FormikFormGroup
											type="text"
											name="asset_control_number"
											label={locale.texts.ID}
											error={errors.asset_control_number}
											touched={touched.asset_control_number}
											placeholder=""
											disabled={this.props.disableASN}
										/>
									</Col>
									<Col>
										<FormikFormGroup
											name="mac_address"
											label={locale.texts.TAG_ID}
											error={errors.mac_address}
											touched={touched.mac_address}
											component={() => (
												<Creatable
													name="mac_address"
													value={values.mac_address}
													className="my-1"
													onChange={(obj) => {
														obj.label = obj.value.match(/.{1,2}/g).join(':')
														setFieldValue('mac_address', obj)
													}}
													options={this.props.macOptions}
													isSearchable={true}
													isDisabled={selectedRowData.isBind}
													styles={styleConfig.reactSelect}
													placeholder=""
													components={{
														IndicatorSeparator: () => null,
													}}
												/>
											)}
										/>
									</Col>
								</Row>
								<Row noGutters>
									<Col>
										<FormikFormGroup
											type="text"
											name="area"
											label={locale.texts.AREA}
											error={errors.area}
											touched={touched.area}
											component={() => (
												<Select
													placeholder={locale.texts.SELECT_AREA}
													name="area"
													value={values.area}
													onChange={(value) => setFieldValue('area', value)}
													options={areaOptions || []}
													styles={styleConfig.reactSelect}
													components={{
														IndicatorSeparator: () => null,
													}}
												/>
											)}
										/>
									</Col>
									<Col>
										<FormikFormGroup
											type="text"
											name="physician"
											label={locale.texts.ATTENDING_PHYSICIAN}
											error={errors.physician}
											touched={touched.physician}
											component={() => (
												<Select
													placeholder={locale.texts.SELECT_PHYSICIAN}
													name="physician"
													value={values.physician}
													onChange={(value) =>
														setFieldValue('physician', value)
													}
													options={physicianListOptions || []}
													styles={styleConfig.reactSelect}
													components={{
														IndicatorSeparator: () => null,
													}}
												/>
											)}
										/>
									</Col>
								</Row>
								<FormikFormGroup
									type="text"
									name="room"
									label={locale.texts.ROOM}
									error={errors.room}
									touched={touched.room}
									component={() => (
										<Select
											placeholder={locale.texts.SELECT_ROOM}
											name="room"
											styles={styleConfig.reactSelect}
											value={values.room}
											onChange={(value) => setFieldValue('room', value)}
											options={this.props.roomOptions || []}
											components={{
												IndicatorSeparator: () => null,
											}}
										/>
									)}
								/>
								<hr />
								<FormikFormGroup
									name="monitorType"
									label={locale.texts.MONITOR_TYPE}
									error={errors.monitorType}
									touched={touched.monitorType}
									component={() => (
										<CheckboxGroup
											id="monitorType"
											label={locale.texts.MONITOR_TYPE}
											value={values.monitorType}
											onChange={setFieldValue}
										>
											{Object.keys(config.monitorType)
												.filter((key) =>
													config.monitorTypeMap.patient.includes(parseInt(key))
												)
												.map((key, index) => {
													return (
														<Field
															key={index}
															component={Checkbox}
															name="checkboxGroup"
															id={config.monitorType[key]}
															label={config.monitorType[key]}
														/>
													)
												})}
										</CheckboxGroup>
									)}
								/>
								<Modal.Footer>
									<div className="mr-auto">
										<Button
											onClick={this.props.handleClick}
											variant="link"
											name={DISASSOCIATE}
											disabled={!selectedRowData.isBind}
										>
											{locale.texts.UNBIND}
										</Button>
									</div>
									<div>
										<Button variant="outline-secondary" onClick={handleClose}>
											{locale.texts.CANCEL}
										</Button>
										<Button
											type="button"
											variant="primary"
											disabled={isSubmitting}
											onClick={submitForm}
										>
											{locale.texts.SAVE}
										</Button>
									</div>
								</Modal.Footer>
							</Form>
						)}
					/>
				</Modal.Body>
			</Modal>
		)
	}
}

export default EditPatientForm
