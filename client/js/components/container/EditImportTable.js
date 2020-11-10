/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        EditImportTable.js

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
import { Modal, Button } from 'react-bootstrap'
import LocaleContext from '../../context/LocaleContext'
import axios from 'axios'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import { toast } from 'react-toastify'
// import { cleanImportData, deleteImportData } from '../../dataSrc'
import { isEqual } from '../../helper/utilities'
import messageGenerator from '../../helper/messageGenerator'
import PropTypes from 'prop-types'

class EditImportTable extends React.Component {
	state = {
		show: this.props.show,
		inputValue: '',
		scanValue: '',
	}

	componentDidUpdate = (prevProps) => {
		if (!isEqual(prevProps, this.props)) {
			this.setState({
				show: this.props.show,
			})
		}
	}

	handleClose = () => {
		this.setState({
			inputValue: '',
			scanValue: '',
		})
		this.props.handleCloseForm()
	}

	handleSubmit = async () => {
		if (
			this.state.scanValue ===
			this.props.selectedObjectData.asset_control_number
		) {
			await axios.post('deleteImportData', {
				idPackage: this.props.selectedObjectData.id,
			})
			toast.success('Edit Import Table Success', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 5000,
				hideProgressBar: true,
			})
			setTimeout(this.props.handleSubmitForm(), 500)
		} else {
			messageGenerator.importErrorMessage('Tag 與產品編號不符')
			this.setState({
				scanValue: '',
			})
		}

		this.props.handleCloseForm()
	}

	updateInput = (event) => {
		this.setState({ scanValue: event.target.value })
	}

	render() {
		const locale = this.context
		const { selectedObjectData } = this.props

		return (
			<Modal show={this.state.show} onHide={this.handleClose} size="md">
				<Modal.Header closeButton className="font-weight-bold text-capitalize">
					{locale.texts.BINDING_SETTING}
				</Modal.Header>
				<Modal.Body>
					<Formik
						initialValues={{}}
						validationSchema={null}
						onSubmit={() => {
							this.handleSubmit()
						}}
						render={({ errors, touched, isSubmitting }) => (
							<Form className="text-capitalize">
								<div className="form-group">
									<Field
										type="text"
										name="ASN"
										placeholder="Asset control number"
										className={
											'form-control' +
											(errors.ASN && touched.ASN ? ' is-invalid' : '')
										}
										value={selectedObjectData.asset_control_number}
									/>
									<ErrorMessage
										name="ASN"
										component="div"
										className="invalid-feedback"
									/>
								</div>

								<div className="form-group">
									<Field
										type="text"
										name="MAC_Address"
										placeholder="MAC_Address"
										className={
											'form-control' +
											(errors.MAC_Address && touched.MAC_Address
												? ' is-invalid'
												: '')
										}
										value={selectedObjectData.mac_address || ''}
										disabled={true}
									/>
									<ErrorMessage
										name="MAC_Address"
										component="div"
										className="invalid-feedback"
									/>
								</div>
								<hr />
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
										onClick={this.handleSubmit}
									>
										{locale.texts.BINDING_DELETE}
									</Button>
								</Modal.Footer>
							</Form>
						)}
					/>
				</Modal.Body>
			</Modal>
		)
	}
}

EditImportTable.contextType = LocaleContext

EditImportTable.propTypes = {
	show: PropTypes.bool.isRequired,
	handleCloseForm: PropTypes.func.isRequired,
	handleSubmitForm: PropTypes.func.isRequired,
	selectedObjectData: PropTypes.object.isRequired,
}

export default EditImportTable
