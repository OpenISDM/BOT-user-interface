/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        ResetPassword.js

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
import { Button } from 'react-bootstrap'
import config from '../../config'
import { AppContext } from '../../context/AppContext'
import { Formik, Form } from 'formik'
import { CenterContainer, Title } from '../BOTComponent/styleComponent'
import FormikFormGroup from '../presentational/FormikFormGroup'
import { useHistory } from 'react-router-dom'
import apiHelper from '../../helper/apiHelper'
import PropTypes from 'prop-types'
import { object, string, ref } from 'yup'
import ImageWebp from '../utils/ImageWebp'

const imageLength = 80

const ResetPassword = ({ match }) => {
	const { locale } = React.useContext(AppContext)
	const history = useHistory()

	const { token } = match.params

	return (
		<CenterContainer>
			<div className="d-flex justify-content-center">
				<ImageWebp
					alt="logo"
					src={config.LOGO}
					srcWebp={config.LOGO_WEBP}
					width={imageLength}
				/>
			</div>
			<div className="d-flex justify-content-center">
				<div className="title mt-1 mb-4">{locale.texts.SLOGAN}</div>
			</div>
			<Formik
				enableReinitialize={true}
				initialValues={{
					account: '',
					password: '',
					confirm: '',
				}}
				validationSchema={object().shape({
					account: string().required(locale.texts.USERNAME_IS_REQUIRED),
					password: string().required(locale.texts.PASSWORD_IS_REQUIRED),
					confirm: string()
						.required(locale.texts.PASSWORD_IS_REQUIRED)
						.when('password', {
							is: (val) => !!(val && val.length > 0),
							then: string().oneOf(
								[ref('password')],
								locale.texts.PASSWORD_NOT_FIT
							),
						}),
				})}
				onSubmit={async (values) => {
					await apiHelper.authApiAgent.resetPassword({
						token,
						account: values.account,
						password: values.password,
					})
					history.push('/resetpassword/success')
				}}
				render={({ status, errors, touched, isSubmitting }) => (
					<Form>
						<Title page>{locale.texts.RESET_PASSWORD}</Title>
						{status && (
							<div className="alert alert-danger mb-2 warning">
								<i className="fas fa-times-circle mr-2" />
								{locale.texts[status.toUpperCase().replace(/ /g, '_')]}
							</div>
						)}
						<FormikFormGroup
							type="text"
							name="account"
							error={errors.account}
							className="mb-4"
							label={locale.texts.USERNAME}
							touched={touched.account}
						/>
						<FormikFormGroup
							type="password"
							name="password"
							error={errors.password}
							touched={touched.password}
							className="mb-4"
							label={locale.texts.NEW_PASSWORD}
						/>
						<FormikFormGroup
							type="password"
							name="confirm"
							error={errors.confirm}
							touched={touched.confirm}
							className="mb-4"
							label={locale.texts.CHECK_PASSWORD}
						/>
						<div className="d-flex justify-content-start">
							<Button type="submit" variant="primary" disabled={isSubmitting}>
								{locale.texts.CONFIRM}
							</Button>
						</div>
					</Form>
				)}
			/>
		</CenterContainer>
	)
}

ResetPassword.propTypes = {
	match: PropTypes.object.isRequired,
}

export default ResetPassword
