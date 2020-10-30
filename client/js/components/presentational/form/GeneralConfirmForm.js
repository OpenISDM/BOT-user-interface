/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        GeneralConfirmForm.js

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
import { object, string } from 'yup'
import LocaleContext from '../../../context/LocaleContext'
import apiHelper from '../../../helper/apiHelper'
import FormikFormGroup from '../FormikFormGroup'
import PropTypes from 'prop-types'
import { Paragraph } from '../../BOTComponent/styleComponent'

const style = {
	modal: {
		top: '10%',
	},
}

const GeneralConfirmForm = ({ show, handleClose, handleSubmit, title }) => {
	const locale = React.useContext(LocaleContext)

	return (
		<Modal
			show={show}
			centered={true}
			size="sm"
			onHide={handleClose}
			style={style.modal}
		>
			<Modal.Body>
				<Paragraph sub>{title}</Paragraph>
				<Formik
					initialValues={{
						username: '',
						password: '',
					}}
					validationSchema={object().shape({
						password: string().required(locale.texts.PASSWORD_IS_REQUIRED),
					})}
					onSubmit={async (
						{ username, password },
						{ setStatus, setSubmitting }
					) => {
						const res = await apiHelper.authApiAgent.confirmValidation({
							username,
							password,
						})
						if (!res.data.confirmation) {
							setStatus(res.data.message)
							setSubmitting(false)
						} else {
							handleSubmit()
						}
					}}
					render={({ errors, status, touched, isSubmitting }) => (
						<Form>
							{status && (
								<div className={'alert alert-danger mb-2 warning'}>
									<i className="fas fa-times-circle mr-2" />
									{locale.texts[status.toUpperCase().replace(/ /g, '_')]}
								</div>
							)}
							<FormikFormGroup
								type="username"
								name="username"
								error={errors.username}
								touched={touched.username}
								autoComplete="off"
								placeholder={locale.texts.NAME}
							/>
							<FormikFormGroup
								type="password"
								name="password"
								error={errors.password}
								touched={touched.password}
								autoComplete="off"
								placeholder={locale.texts.PASSWORD}
							/>
							<Modal.Footer>
								<Button type="submit" variant="primary" disabled={isSubmitting}>
									{locale.texts.CONFIRM}
								</Button>
							</Modal.Footer>
						</Form>
					)}
				/>
			</Modal.Body>
		</Modal>
	)
}

GeneralConfirmForm.propTypes = {
	show: PropTypes.bool,
	handleClose: PropTypes.func,
	handleSubmit: PropTypes.func,
	title: PropTypes.string,
	authenticatedRoles: PropTypes.string,
}

export default GeneralConfirmForm
