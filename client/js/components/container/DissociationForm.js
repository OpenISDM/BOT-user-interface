/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        DissociationForm.js

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

/**
 * EditObjectForm is the Modal in ObjectManagementContainer.
 * To increase the input in this form, please add the following code
 * 1. Creat the state of the desired input name in constructor and the html content in render function
 * 2. Add the corresponding terms in handleSubmit and handleChange
 * 3. Modify the query_editObject function in queryType
 */

import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import { object, string } from 'yup'
import { AppContext } from '../../context/AppContext'
import messageGenerator from '../../helper/messageGenerator'
import PropTypes from 'prop-types'
import apiHelper from '../../helper/apiHelper'

class DissociationForm extends React.Component {
	static contextType = AppContext

	state = {
		inputValue: '',
		showDetail: '',
		objectName: '',
		objectType: '',
		mac_address: '',
		alertText: '',
		ISuxTest: false,
		ISuxTest_success: false,
		returnFlag: false,
		valueForDataArray: '',
	}

	handleClose = () => {
		this.setState({
			inputValue: '',
			showDetail: false,
			objectName: '',
			objectType: '',
			mac_address: '',
		})
		this.props.handleClose()
	}

	handleSubmit = async (postOption) => {
		await apiHelper.utilsApiAgent.deleteDevice({ formOption: [postOption] })
		this.props.refreshData()
		this.handleClose()
	}

	handleMacAddress(event) {
		this.setState({ mac_address: event.target.value })
	}

	updateInput = (event) => {
		this.setState({ inputValue: event.target.value })
		setTimeout(() => {
			this.handleChange()
		}, 500)
	}

	async handleChange() {
		this.setState({
			showDetail: false,
		})
		this.props.data.forEach((item) => {
			if (item.asset_control_number === this.state.inputValue)
				this.setState({ showDetail: true })
		})

		if (this.state.showDetail) {
			const res = await apiHelper.utilsApiAgent.getImportData({
				formOption: this.state.inputValue,
			})

			res.data.rows.forEach((item) => {
				this.setState({
					objectName: item.name,
					objectType: item.type,
				})
			})
		}
	}

	render() {
		const { locale } = this.context

		const { title, data, selectedObjectData, show } = this.props
		return (
			<Modal
				show={show}
				onHide={this.handleClose}
				size="md"
				className="text-capitalize"
			>
				<Modal.Header closeButton>
					{locale.texts[title.toUpperCase().replace(/ /g, '_')]}
				</Modal.Header>
				<Modal.Body className="mb-2">
					<Formik
						initialValues={{
							mac: '',
						}}
						//C10f0027a1a7
						validationSchema={object().shape({
							mac: string()
								.required(locale.texts.MAC_ADDRESS_IS_REQUIRED)
								.test(
									'mac',
									locale.texts.MAC_DO_NOT_MATCH,

									(value) => {
										if (value) {
											value = value.toString().toLowerCase()
										} else {
											return false
										}
										if (selectedObjectData) {
											if (selectedObjectData === 'handleAllDelete') {
												if (value) {
													if (value.length === 17 || value.length === 12) {
														this.setState({
															returnFlag: false,
														})
														this.props.objectTable.forEach((item) => {
															if (value === item.mac_address) {
																this.setState({
																	returnFlag: true,
																	valueForDataArray: value,
																})
															} else if (
																item.mac_address ===
																value.match(/.{1,2}/g).join(':')
															) {
																this.setState({
																	returnFlag: true,
																	valueForDataArray: value
																		.match(/.{1,2}/g)
																		.join(':'),
																})
															}
														})
													}
												}
											} else {
												if (!value) {
													return false
												}
												if (
													this.props.selectedObjectData.mac_address === value
												) {
													this.setState({
														returnFlag: true,
														valueForDataArray: value,
													})
												} else if (
													this.props.selectedObjectData.mac_address ===
													value.match(/.{1,2}/g).join(':')
												) {
													this.setState({
														returnFlag: true,
														valueForDataArray: value.match(/.{1,2}/g).join(':'),
													})
												} else {
													this.setState({
														returnFlag: false,
													})
												}
											}
										} else {
											this.props.objectTable.forEach((item) => {
												if (value === item.mac_address) {
													this.setState({
														returnFlag: true,
														valueForDataArray: value,
													})
												} else if (
													item.mac_address === value.match(/.{1,2}/g).join(':')
												) {
													this.setState({
														returnFlag: true,
														valueForDataArray: value.match(/.{1,2}/g).join(':'),
													})
												}
											})
										}

										if (this.state.returnFlag === true) {
											this.setState({
												objectName: data[this.state.valueForDataArray].name,
												objectType: data[this.state.valueForDataArray].type,
												showDetail: true,
												inputValue: value,
												returnFlag: false,
											})

											return true
										}
										this.setState({
											objectName: '',
											objectType: '',
											showDetail: false,
											inputValue: '',
										})
										return false
									}
								),
						})}
						onSubmit={(values) => {
							const callback = () =>
								messageGenerator.setSuccessMessage('save success')
							this.handleSubmit(values.mac)
							callback()
						}}
						render={({ errors, touched, isSubmitting, submitForm }) => (
							<Form className="text-capitalize">
								<div className="form-group">
									<Field
										type="text"
										name="mac"
										placeholder={locale.texts.PLEASE_ENTER_OR_SCAN_MAC_ADDRESS}
										className={
											'text-capitalize form-control' +
											(errors.mac && touched.mac ? ' is-invalid' : '')
										}
										// value={this.state.inputValue}
										// onChange={this.updateInput()}
									/>
									<ErrorMessage
										name="mac"
										component="div"
										className="invalid-feedback"
									/>
								</div>

								{this.state.showDetail && (
									<div>
										<div className="form-group">
											<div className="form-group">
												<small
													id="TextIDsmall"
													className="form-text text-muted"
												>
													{locale.texts.NAME}
												</small>
												<input
													type="readOnly"
													className="form-control"
													id="TextID"
													placeholder="名稱"
													disabled={true}
													value={this.state.objectName}
												></input>
											</div>
										</div>
										<div className="form-group">
											<div className="form-group">
												<small
													id="TextTypesmall"
													className="form-text text-muted"
												>
													{locale.texts.TYPE}
												</small>
												<input
													type="readOnly"
													className="form-control"
													id="TextType"
													placeholder="類型"
													disabled={true}
													value={this.state.objectType}
												></input>
											</div>
										</div>
									</div>
								)}

								{this.state.showDetail && (
									<Modal.Footer>
										<Button
											variant="outline-secondary"
											className="text-capitalize"
											onClick={this.handleClose}
										>
											{locale.texts.CANCEL}
										</Button>
										<Button
											type="button"
											className="text-capitalize"
											variant="primary"
											disabled={isSubmitting}
											onClick={submitForm}
										>
											{locale.texts.REMOVE}
										</Button>
									</Modal.Footer>
								)}
							</Form>
						)}
					/>
				</Modal.Body>
			</Modal>
		)
	}
}

DissociationForm.propTypes = {
	show: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	objectTable: PropTypes.object.isRequired,
	selectedObjectData: PropTypes.object.isRequired,
	handleClose: PropTypes.func.isRequired,
	refreshData: PropTypes.func.isRequired,
	data: PropTypes.array.isRequired,
}

export default DissociationForm
