/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        DeleteConfirmationForm.js

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
import { Formik, Form } from 'formik'
import LocaleContext from '../../context/LocaleContext'

const DeleteConfirmationForm = ({
	handleClose,
	handleSubmit,
	show,
	message,
}) => {
	const locale = React.useContext(LocaleContext)

	return (
		<Modal show={show} centered={true} onHide={handleClose} size="md">
			<Modal.Header closeButton>{locale.texts.REMINDER}</Modal.Header>
			<Modal.Body>
				<Formik
					onSubmit={() => {
						handleSubmit()
					}}
					render={({
						values,
						errors,
						status,
						touched,
						isSubmitting,
						setFieldValue,
					}) => (
						<Form className="text-capitalize">
							<div className="mb-5">{message}</div>
							<Modal.Footer>
								<Button variant="outline-secondary" onClick={handleClose}>
									{locale.texts.CANCEL}
								</Button>
								<Button type="submit" variant="primary" disabled={isSubmitting}>
									{locale.texts.YES}
								</Button>
							</Modal.Footer>
						</Form>
					)}
				/>
			</Modal.Body>
		</Modal>
	)
}

export default DeleteConfirmationForm
