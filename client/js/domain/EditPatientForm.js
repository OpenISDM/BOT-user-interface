import React from 'react'
import { Modal, Button, Row, Col } from 'react-bootstrap'
import Select from '../components/Select'
import config from '../config'
import { AppContext } from '../context/AppContext'
import Creatable from 'react-select/creatable'
import { Formik, Form } from 'formik'
import { object, string } from 'yup'
import FormikFormGroup from './FormikFormGroup'
import styleConfig from '../config/styleConfig'
import { DISASSOCIATE } from '../config/wordMap'
import { isEmpty, macaddrValidation } from '../helper/validation'
import { formatToMac, compareString } from '../helper/utilities'
import PropTypes from 'prop-types'

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
			selectedRowData = {},
			show,
			handleClose,
			areaTable,
			isReadOnly,
			macOptions,
			handleSubmit,
			roomOptions,
			handleClick,
			associatedAsnSet = [],
			associatedMacSet = [],
		} = this.props

		const {
			name,
			area_name,
			mac_address,
			asset_control_number,
			room,
		} = selectedRowData

		const areaOptions = areaTable.map((area) => {
			return {
				value: area.name,
				label: area.readable_name,
				id: area.id,
			}
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
							name: name || '',
							mac_address: selectedRowData.isBind
								? {
										label: mac_address,
										value: mac_address,
								  }
								: '',
							asset_control_number: asset_control_number || '',
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
							asset_control_number: string()
								.required(locale.texts.ASSET_CONTROL_NUMBER_IS_REQUIRED)
								.test(
									'asset_control_number',
									locale.texts.THE_ASSET_CONTROL_NUMBER_IS_ALREADY_USED,
									(value) => {
										const acnString = `${value}`.trim().toUpperCase()
										if (compareString(asset_control_number, acnString)) {
											return true
										}
										return !associatedAsnSet.includes(acnString)
									}
								)
								.max(40, locale.texts.LIMIT_IN_FOURTY_CHARACTER),
							mac_address: object()
								.required(locale.texts.MAC_ADDRESS_IS_REQUIRED)
								.test(
									'mac_address',
									locale.texts.INCORRECT_MAC_ADDRESS_FORMAT,
									(obj) => {
										if (!obj || isEmpty(obj)) {
											return true
										}
										const macString = `${obj.label}`.trim().toUpperCase()
										return macaddrValidation({ macaddr: macString })
									}
								)
								.test(
									'mac_address',
									locale.texts.THE_MAC_ADDRESS_IS_ALREADY_USED,
									(obj) => {
										let macWithColons = ''
										if (obj && obj.label) {
											macWithColons = `${obj.label}`.trim().toUpperCase()
										}

										if (compareString(mac_address, macWithColons)) {
											return true
										}
										return !associatedMacSet.includes(macWithColons)
									}
								),
						})}
						onSubmit={(values) => {
							handleSubmit({
								...values,
								name: values.name.trim(),
								area_id: values.area.id,
								room: values.room ? values.room.label : '',
								type: config.OBJECT_TABLE_SUB_TYPE.PATIENT,
								mac_address: values.mac_address
									? values.mac_address.label.trim()
									: '',
							})
						}}
						render={({
							values,
							errors,
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
										<FormikFormGroup
											type="text"
											name="asset_control_number"
											label={locale.texts.ID}
											error={errors.asset_control_number}
											touched={touched.asset_control_number}
											placeholder=""
											disabled={isReadOnly}
										/>
									</Col>
								</Row>
								<Row noGutters>
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
														obj.label = formatToMac(obj.value)
														setFieldValue('mac_address', obj)
													}}
													options={macOptions}
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
									<Col>
										<FormikFormGroup
											type="text"
											name="room"
											label={locale.texts.ROOM}
											error={errors.room}
											touched={touched.room}
											component={() => (
												<Creatable
													placeholder={locale.texts.SELECT_ROOM}
													name="room"
													styles={styleConfig.reactSelect}
													value={values.room}
													onChange={(value) => setFieldValue('room', value)}
													options={roomOptions || []}
													isSearchable={true}
													components={{
														IndicatorSeparator: () => null,
													}}
												/>
											)}
										/>
									</Col>
								</Row>
								<Row>
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
													isDisabled={isReadOnly}
													components={{
														IndicatorSeparator: () => null,
													}}
												/>
											)}
										/>
									</Col>
								</Row>
								<Modal.Footer>
									<div className="mr-auto">
										<Button
											onClick={handleClick}
											variant="link"
											name={DISASSOCIATE}
											disabled={!selectedRowData.isBind}
										>
											{locale.texts.REPLACE_TAG}
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

EditPatientForm.propTypes = {
	title: PropTypes.string,
	selectedRowData: PropTypes.object,
	areaTable: PropTypes.array,
	show: PropTypes.bool,
	handleClose: PropTypes.func,
	isReadOnly: PropTypes.bool,
	macOptions: PropTypes.array,
	handleSubmit: PropTypes.func,
	roomOptions: PropTypes.array,
	handleClick: PropTypes.func,
	associatedMacSet: PropTypes.array,
	associatedAsnSet: PropTypes.array,
}

export default EditPatientForm
