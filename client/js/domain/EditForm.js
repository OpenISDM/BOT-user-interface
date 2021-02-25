/**
 * EditObjectForm is the Modal in ObjectManagementContainer.
 * To increase the input in this form, please add the following code
 * 1. Creat the state of the desired input name in constructor and the html content in render function
 * 2. Add the corresponding terms in handleSubmit and handleChange
 * 3. Modify the query_editObject function in queryType
 */
import React from 'react'
import { Modal, Button, Row, Col } from 'react-bootstrap'
import Select from '../components/Select'
import Creatable from 'react-select/creatable'
import config from '../config'
import { Formik, Form } from 'formik'
import { object, string } from 'yup'
import { AppContext } from '../context/AppContext'
import styleConfig from '../config/styleConfig'
import FormikFormGroup from './FormikFormGroup'
import { DISASSOCIATE, NORMAL } from '../config/wordMap'
import { isEmpty, macaddrValidation } from '../helper/validation'
import { formatToMac, compareString } from '../helper/utilities'
import API from '../api'
import PropTypes from 'prop-types'

const monitorTypeMap = {}
Object.keys(config.monitorType).forEach((key) => {
	monitorTypeMap[config.monitorType[key]] = key
})

export const ADDITION_OPTION = {
	PATIENT: {
		label: 'ROOM',
		value: 'room',
        idText: 'ID'
	},
	DEVICE: {
		label: 'TYPE',
		value: 'type',
        idText: 'ACN'
	},
	STAFF: {
		label: 'TYPE',
		value: 'type',
        idText: 'ID'
	},
}
class EditForm extends React.Component {
	static contextType = AppContext

	state = {
		transferredLocationOptions: [],
	}

	componentDidMount = () => {
		this.getTransferredLocation()
	}

	getTransferredLocation = async () => {
		const res = await API.TransferredLocation.getAll()
		const optionsMap = {}
		if (res) {
			res.data.forEach(({ id, name, department }) => {
				const option = {
					id,
					label: `${name}-${department}`,
					value: department,
				}
				if (!optionsMap[name]) {
					optionsMap[name] = []
				}
				optionsMap[name].push(option)
			})
			const transferredLocationOptions = Object.keys(optionsMap).map((key) => {
				return {
					label: key,
					value: key,
					options: [...optionsMap[key]],
				}
			})
			this.setState({
				transferredLocationOptions,
			})
		}
	}

	render() {
		const { locale } = this.context
		const {
			title,
			selectedRowData = {},
			show,
			handleClose,
			areaTable,
			isReadOnly,
			associatedMacSet = [],
			associatedAsnSet = [],
			handleSubmit,
			additionOptions,
			macOptions,
			handleClick,
			additionOptionType,
		} = this.props

		const areaOptions = areaTable.map((area) => {
			return {
				value: area.name,
				label: area.readable_name,
				id: area.id,
			}
		})

		const {
			id = '',
			name = '',
			type = '',
			status,
			asset_control_number = '',
			mac_address = '',
			area_name = '',
			monitor_type = [],
			isBind = false,
			room = '',
		} = selectedRowData

		const initialValues = {
			name: name || '',
			type: type ? { label: type, value: type } : '',
			asset_control_number: isReadOnly ? asset_control_number : '',
			mac_address: isBind ? { label: mac_address, value: mac_address } : '',
			status: status ? status.value : NORMAL,
			area: area_name || '',
			monitorType:
				monitor_type && monitor_type.length > 0 ? monitor_type.split('/') : [],
			room: room || '',
		}

		const validationSchema = object().shape({
			name: string().required(locale.texts.NAME_IS_REQUIRED),
			type: string().required(locale.texts.TYPE_IS_REQUIRED),
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
			area: string().required(locale.texts.AREA_IS_REQUIRED),
		})

		return (
			<Modal show={show} onHide={handleClose} size="md">
				<Modal.Header closeButton>
					{locale.texts[title.toUpperCase().replace(/ /g, '_')]}
				</Modal.Header>
				<Modal.Body>
					<Formik
						initialValues={initialValues}
						validationSchema={validationSchema}
						onSubmit={(values) => {
							const monitor_type = values.monitorType
								? values.monitorType
										.filter((item) => item)
										.reduce((sum, item) => {
											sum += parseInt(monitorTypeMap[item])
											return sum
										}, 0)
								: 0
							const postOption = {
								id,
								...values,
								name: values.name.trim(),
								status: values.status,
								monitor_type,
								area_id: values.area.id || 0,
								mac_address: values.mac_address
									? values.mac_address.label.trim()
									: '',
								type: values.type ? values.type.value.trim() : '',
							}
							console.log(postOption)
							handleSubmit(postOption)
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
											label={
                                                additionOptionType
                                                ? locale.texts[additionOptionType.idText]
                                                : locale.texts.ID
                                            }
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
													isDisabled={isBind}
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
										{additionOptionType ? (
											<FormikFormGroup
												type="text"
												name="type"
												label={locale.texts[additionOptionType.label]}
												error={errors.type}
												touched={touched.type}
												placeholder=""
												component={() => (
													<Creatable
														name="type"
														value={values[additionOptionType.value]}
														placeholder=""
														className="my-1"
														onChange={(obj) => {
															setFieldValue('type', obj)
														}}
														options={additionOptions}
														isSearchable={true}
														styles={styleConfig.reactSelect}
														component={{ IndicatorSeparator: () => null }}
													/>
												)}
											/>
										) : null}
									</Col>
								</Row>
								<Row>
									<Col>
										<FormikFormGroup
											type="text"
											name="area"
											label={locale.texts.AUTH_AREA}
											error={errors.area}
											touched={touched.area}
											placeholder=""
											component={() => (
												<Select
													placeholder=""
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
											disabled={!isBind}
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

EditForm.propTypes = {
	selectedRowData: PropTypes.object.isRequired,
	macOptions: PropTypes.object.isRequired,
	additionOptions: PropTypes.object.isRequired,
	handleClick: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	isReadOnly: PropTypes.bool.isRequired,
	associatedMacSet: PropTypes.array.isRequired,
	areaTable: PropTypes.array.isRequired,
	title: PropTypes.string.isRequired,
	handleClose: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired,
	associatedAsnSet: PropTypes.array.isRequired,
	enableAdditionalOptions: PropTypes.bool,
	additionOptionsTitle: PropTypes.string,
	additionOptionType: PropTypes.string,
}

export default EditForm
