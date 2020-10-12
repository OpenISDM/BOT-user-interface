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

import React, { Component } from 'react'
import { Modal, Image, Button } from 'react-bootstrap'
import config from '../../config'
import LocaleContext from '../../context/LocaleContext'
import AuthContext from '../../context/AuthenticationContext'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import {
	CenterContainer,
	PageTitle,
	Title,
} from '../BOTComponent/styleComponent'
import styleConfig from '../../config/styleConfig'
import FormikFormGroup from '../presentational/FormikFormGroup'
import { Link, useHistory } from 'react-router-dom'
import { set } from 'js-cookie'
import apiHelper from '../../helper/apiHelper'

import ImageWebp from '../utils/ImageWebp'

const imageLength = 80

const ResetPassword = ({ match }) => {
	const locale = React.useContext(LocaleContext)
	const auth = React.useContext(AuthContext)
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
				initialValues={{
					new: '',
					confirm: '',
				}}
				// validationSchema = {
				//     Yup.object().shape({

				// })}

				onSubmit={(values, { setStatus }) => {
					apiHelper.authApiAgent
						.resetPassword({
							token,
							password: values.new,
						})
						.then((res) => {
							history.push('/resetpassword/success')
						})
						.catch((err) => {
							console.log(err)
						})
				}}
				render={({
					values,
					errors,
					status,
					touched,
					isSubmitting,
					setFieldValue,
				}) => (
					<Form>
						<Title page>{locale.texts.RESET_PASSWORD}</Title>
						{status && (
							<div className="alert alert-danger mb-2 warning">
								<i className="fas fa-times-circle mr-2" />
								{locale.texts[status.toUpperCase().replace(/ /g, '_')]}
							</div>
						)}
						<FormikFormGroup
							type="password"
							name="new"
							className="mb-4"
							label={locale.texts.NEW_PASSWORD}
						/>
						<FormikFormGroup
							type="password"
							name="confirm"
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

export default ResetPassword
