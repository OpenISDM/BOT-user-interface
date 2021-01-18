/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        EditGatewayForm.js

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
import { AppContext } from '../../../context/AppContext'
import { Formik, Form } from 'formik'
import FormikFormGroup from '../FormikFormGroup'
import PropTypes from 'prop-types'

const EditGatewayForm = ({
	title,
	selectedObjectData = {},
	show,
	handleClose,
	handleSubmit,
}) => {
	const { locale } = React.useContext(AppContext)
	const { uuid, description, comment } = selectedObjectData

	return (
		<Modal
			show={show}
			onHide={handleClose}
			size="md"
			className="text-capitalize"
		>
			<Modal.Header closeButton>
				{locale.texts[title.toUpperCase().replace(/ /g, '_')]}
			</Modal.Header>
			<Modal.Body>
				<Formik
					initialValues={{
						description: description || '',
						uuid,
						comment,
					}}
					onSubmit={(values) => {
						const { comment } = values
						const settingPackage = {
							...selectedObjectData,
							comment,
						}
						handleSubmit(settingPackage)
					}}
					render={({ isSubmitting }) => (
						<Form>
							<FormikFormGroup
								type="text"
								name="comment"
								label={locale.texts.COMMENT}
								placeholder=""
							/>
							<Modal.Footer>
								<Button variant="outline-secondary" onClick={handleClose}>
									{locale.texts.CANCEL}
								</Button>
								<Button type="submit" variant="primary" disabled={isSubmitting}>
									{locale.texts.SEND}
								</Button>
							</Modal.Footer>
						</Form>
					)}
				/>
			</Modal.Body>
		</Modal>
	)
}

EditGatewayForm.propTypes = {
	title: PropTypes.string,
	selectedObjectData: PropTypes.object,
	show: PropTypes.bool,
	handleClose: PropTypes.func,
	handleSubmit: PropTypes.func,
}

export default EditGatewayForm
