import React from 'react'
import { Modal, Row, Col, ButtonToolbar } from 'react-bootstrap'
import Creatable from 'react-select/creatable'
import { Formik, Field, Form } from 'formik'
import { FormFieldName } from '../components/StyleComponents'
import { object, string, number } from 'yup'
import RadioButton from '../components/RadioButton'
import Button from '../components/Button'
import RadioButtonGroup from '../components/RadioButtonGroup'
import { AppContext } from '../context/AppContext'
import styleConfig from '../config/styleConfig'
import FormikFormGroup from './FormikFormGroup'
import AccessControl from './AccessControl'
import API from '../api'
import { BROKEN, TRANSFERRED, TRACE, NORMAL } from '../config/wordMap'
import PropTypes from 'prop-types'
import { isEmpty } from '../helper/validation'

class ChangeStatusForm extends React.Component {
	static contextType = AppContext

	state = {
		transferredLocationOptions: [],
	}

	componentDidMount = () => {
		this.setFormMode()
		this.getTransferredLocation()
	}

	componentDidUpdate = () => {
		//console.log(this.props.formMode)
	}

	setFormMode = () => {
		const { isChangeStatusForm = true } = this.props

		this.setState({
			isChangeStatusForm,
			switchButtonText: isChangeStatusForm ? '要求追蹤' : '回報狀態',
			titleText: !isChangeStatusForm ? '回報狀態' : '要求追蹤',
		})
	}
	getTransferredLocation = async () => {
		try {
			const res = await API.TransferredLocation.getAll()
			const optionsMap = {}
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
		} catch (e) {
			console.log(e)
		}
	}

	handleClose = () => {
		this.props.handleChangeObjectStatusFormClose()
	}

	handleAddSubmit = async (name, department) => {
		try {
			await API.TransferredLocation.addOne({
				name,
				department,
			})
		} catch (e) {
			console.log(`add location failed ${e}`)
		}
	}

	handleClick = (e) => {
		const item = e.target.name
		const { selectedObjectData } = this.props
		switch (item) {
			case 'add device':
				this.props.handleAdditionalButton(item)
				break
			case 'request object trace':
				console.log('tracking path')
				this.props.handleShowPath(
					selectedObjectData.map((item) => item.asset_control_number)
				)
				this.props.handleChangeObjectStatusFormClose()
				break
		}
	}

	initValues = () => {
		let { selectedObjectData } = this.props

		selectedObjectData = selectedObjectData.length ? selectedObjectData : []

		const initValues = {
			name: selectedObjectData.length !== 0 ? selectedObjectData[0].name : '',
			type: selectedObjectData.length !== 0 ? selectedObjectData[0].type : '',
			asset_control_number:
				selectedObjectData.length !== 0
					? selectedObjectData[0].asset_control_number
					: '',
			action_options: '',
			status:
				selectedObjectData.length !== 0 ? selectedObjectData[0].status : '',
			transferred_location:
				selectedObjectData.length !== 0 &&
				selectedObjectData[0].status === TRANSFERRED
					? {
							id: selectedObjectData[0].transferred_location.id,
							value: selectedObjectData[0].transferred_location.value,
							label: `${selectedObjectData[0].transferred_location.name}-${selectedObjectData[0].transferred_location.department}`,
					  }
					: '',
			notes: selectedObjectData.length !== 0 ? selectedObjectData[0].notes : '',
			nickname:
				selectedObjectData.length !== 0 ? selectedObjectData[0].nickname : '',
			request_length: 10,
		}

		return initValues
	}

	switchFormMode = () => {
		//const [, dispatch] = this.context.stateReducer
		const { isChangeStatusForm } = this.state
		console.log('>>switchFormMode')

		this.setState({
			isChangeStatusForm: !isChangeStatusForm,
			switchButtonText: !isChangeStatusForm ? '要求物件追蹤' : '回報儀器狀態',
			titleText: !isChangeStatusForm ? '回報狀態' : '要求追蹤',
		})

		// i don't know why need it?
		// dispatch({
		// 	type: SET_FORM_MODE,
		// 	value: [],
		// })
	}
	generateCurrentStatus = (locale, status) => {
		switch (status) {
			case NORMAL:
				return locale.texts.NORMAL
			case BROKEN:
				return locale.texts.BROKEN
			case TRANSFERRED:
				return locale.texts.TRANSFERRED
			case TRACE:
				return locale.texts.TRACE
			default:
				return locale.texts.NORMAL
		}
	}

	getValidationSchema = () => {
		const { locale } = this.context
		return this.state.isChangeStatusForm
			? object().shape({
					action_options: string().required(locale.texts.STATUS_IS_REQUIRED),
					transferred_location: object()
						.when('action_options', {
							is: TRANSFERRED,
							then: object().required(locale.texts.LOCATION_IS_REQUIRED),
						})
						.test(
							'transferred_location',
							locale.texts.INCORRECT_TRANSFERRED_LOCATION_FORMAT,
							(obj) => {
								if (!obj || isEmpty(obj)) {
									return true
								}
								const [name, department] = obj.label.split('-')
								if (name && department) {
									return true
								}
								return false
							}
						),
			  })
			: object().shape({
					pathTimeLength: number().required('qqqqq'),
			  })
	}

	render() {
		const { locale } = this.context
		const { title } = this.props
		const { switchButtonText, isChangeStatusForm, titleText } = this.state
		let { selectedObjectData } = this.props
		selectedObjectData = selectedObjectData.length ? selectedObjectData : []

		return (
			<Modal
				show={this.props.show}
				dialogClassName="right-20-percent"
				onHide={this.handleClose}
				size="md"
				enforceFocus={false}
			>
				<Modal.Header closeButton>{titleText}</Modal.Header>
				<Modal.Body>
					<Formik
						enableReinitialize={true}
						initialValues={this.initValues()}
						validationSchema={this.getValidationSchema()}
						onSubmit={(values) => {
							this.props.handleChangeObjectStatusFormSubmit(values)
						}}
						render={({
							values,
							errors,
							touched,
							isSubmitting,
							setFieldValue,
						}) => (
							<Form className="text-capitalize">
								<div className="custom-scrollbar max-height-30">
									{selectedObjectData.map((item, index) => {
										return (
											<div key={index}>
												{index > 0 ? <hr /> : null}
												<Row noGutters className="text-capitalize">
													{selectedObjectData.length > 1 ? (
														<Col
															xs={1}
															sm={1}
															className="d-flex align-items-center"
														>
															<i
																className="fas fa-times cursor-pointer"
																onClick={this.props.handleRemoveButton}
																name={item.mac_address}
															/>
														</Col>
													) : null}
													<Col>
														<Row noGutters>
															<Col>
																<FormikFormGroup
																	type="text"
																	name="name"
																	label={locale.texts.NAME}
																	value={item.name}
																	error={errors.name}
																	touched={touched.name}
																	placeholder=""
																	disabled
																/>
															</Col>
															<Col>
																<FormikFormGroup
																	type="text"
																	name="area"
																	label={locale.texts.AREA}
																	value={locale.texts[item.lbeacon_area.value]}
																	disabled
																/>
															</Col>
														</Row>
														<Row noGutters>
															<Col>
																<FormikFormGroup
																	type="text"
																	name="type"
																	label={locale.texts.TYPE}
																	value={item.type}
																	error={errors.type}
																	touched={touched.type}
																	placeholder=""
																	disabled
																/>
															</Col>
															<Col>
																<FormikFormGroup
																	type="text"
																	name="nickname"
																	label={locale.texts.NICKNAME}
																	value={item.type_alias}
																	error={errors.nickname}
																	touched={touched.nickname}
																	placeholder=""
																	disabled
																/>
															</Col>
														</Row>
														<FormikFormGroup
															type="text"
															name="asset_control_number"
															label={locale.texts.ACN}
															error={errors.asset_control_number}
															value={item.asset_control_number}
															touched={touched.asset_control_number}
															placeholder=""
															disabled
														/>
													</Col>
												</Row>
											</div>
										)
									})}
								</div>
								<FormikFormGroup
									type="text"
									name="current_status"
									label={locale.texts.CURRENT_STATUS}
									display={isChangeStatusForm}
									error={errors.current_status}
									touched={touched.current_status}
									value={this.generateCurrentStatus(locale, values.status)}
									placeholder=""
									disabled
								/>
								<FormikFormGroup
									type="text"
									name="action_options"
									label={locale.texts.ACTION}
									error={errors.action_options}
									touched={touched.action_options}
									display={isChangeStatusForm}
									placeholder=""
									component={() => (
										<RadioButtonGroup>
											<div className="d-flex justify-content-between form-group my-1">
												<Field
													component={RadioButton}
													name="action_options"
													id={BROKEN}
													label={locale.texts.BROKEN}
												/>
												<Field
													component={RadioButton}
													name="action_options"
													id={TRANSFERRED}
													label={locale.texts.TRANSFERRED}
												/>
												<Field
													component={RadioButton}
													name="action_options"
													id={NORMAL}
													label={locale.texts.RETURNED}
												/>
											</div>
										</RadioButtonGroup>
									)}
								/>
								<FormikFormGroup
									type="text"
									name="pathTimeLength"
									display={!isChangeStatusForm}
									label={locale.texts.REQUEST_OBJECT_TRACE}
									error={errors.pathTimeLength}
									touched={touched.pathTimeLength}
									placeholder=""
								/>
								<FormikFormGroup
									type="text"
									name="transferred_location"
									label={locale.texts.TRANSFERRED_LOCATION}
									error={errors.transferred_location}
									touched={touched.transferred_location}
									display={values.action_options === 'transferred'}
									component={() => (
										<>
											<Creatable
												formatCreateLabel={(e) => {
													const createPix = locale.texts.CREATE
													const createTail = `[${locale.texts.TRANSFERRED_LOCATION}-${locale.texts.DEPARTMENT}]`
													const [
														name,
														department = `${locale.texts.DEPARTMENT}`,
													] = e.split('-')
													return `${createPix}: ${name}-${department} ${createTail}`
												}}
												name="transferred_location"
												value={values.transferred_location}
												onChange={async (obj) => {
													const [name, department] = obj.value.split('-')
													if (name && department) {
														await this.handleAddSubmit(name, department)
													}
													setFieldValue('transferred_location', obj)
												}}
												options={this.state.transferredLocationOptions}
												isSearchable={true}
												styles={styleConfig.reactSelect}
												placeholder={locale.texts.SELECT_LOCATION}
												components={{
													IndicatorSeparator: () => null,
												}}
											/>
										</>
									)}
								/>
								{isChangeStatusForm ? (
									<div className="mb-2 text-capitalize">
										<FormFieldName>{locale.texts.NOTES}</FormFieldName>
										<Field
											component="textarea"
											name="notes"
											className={
												'form-control' +
												(errors.notes && touched.notes ? ' is-invalid' : '')
											}
											rows={3}
										/>
									</div>
								) : null}

								<AccessControl platform={['browser', 'tablet']}>
									<Row className="d-flex justify-content-center pb-2">
										<ButtonToolbar>
											<Button
												name="add device"
												text={locale.texts.ADD_DEVICE}
												variant="outline-secondary"
												className="mr-2"
												onClick={this.handleClick}
												active={this.props.showAddDevice}
											/>
										</ButtonToolbar>
									</Row>
								</AccessControl>
								<Modal.Footer>
									<div className="mr-auto">
										<Button
											onClick={this.switchFormMode}
											variant="link"
											name={'switch form mode'}
											text={switchButtonText}
										/>
									</div>
									<div>
										<Button
											variant="outline-secondary"
											onClick={this.handleClose}
											text={locale.texts.CANCEL}
										/>
										<Button
											type="submit"
											variant="primary"
											disabled={isSubmitting}
											text={locale.texts.SAVE}
										/>
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

ChangeStatusForm.propTypes = {
	title: PropTypes.string.isRequired,
	show: PropTypes.bool.isRequired,
	showAddDevice: PropTypes.bool.isRequired,
	handleRemoveButton: PropTypes.func.isRequired,
	selectedObjectData: PropTypes.array.isRequired,
	handleChangeObjectStatusFormSubmit: PropTypes.func.isRequired,
	handleShowPath: PropTypes.func.isRequired,
	handleAdditionalButton: PropTypes.func.isRequired,
	handleChangeObjectStatusFormClose: PropTypes.func.isRequired,
	isChangeStatusForm: PropTypes.bool.isRequired,
}

export default ChangeStatusForm
