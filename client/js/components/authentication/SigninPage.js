/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        SigninPage.js

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
import { Button, Dropdown } from 'react-bootstrap'
import config from '../../config'
import { Formik, Form } from 'formik'
import { object, string } from 'yup'
import {
	CenterContainer,
	JustifyCenterDiv,
} from '../BOTComponent/styleComponent'
import FormikFormGroup from '../presentational/FormikFormGroup'
import { Link, useHistory } from 'react-router-dom'
import routes from '../../config/routes/routes'
import { AppContext } from '../../context/AppContext'
import ImageWebp from '../utils/ImageWebp'

const imageLength = 80

const SigninPage = () => {
	const appContext = React.useContext(AppContext)
	const { stateReducer, locale, auth } = appContext
	const [, dispatch] = stateReducer

	const history = useHistory()
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
					username: '',
					password: '',
				}}
				validationSchema={object().shape({
					username: string().required(locale.texts.USERNAME_IS_REQUIRED),
					password: string().required(locale.texts.PASSWORD_IS_REQUIRED),
				})}
				onSubmit={(values, actions) => {
					const callback = () => history.push('/')
					auth.login(values, { actions, dispatch, callback, locale })
				}}
				render={({ errors, status, touched, isSubmitting }) => (
					<Form>
						{status && (
							<div className="alert alert-danger mb-2 warning">
								<i className="fas fa-times-circle mr-2" />
								{locale.texts[status.toUpperCase().replace(/ /g, '_')]}
							</div>
						)}
						<FormikFormGroup
							type="text"
							name="username"
							className="mb-4"
							error={errors.username}
							touched={touched.username}
							label={locale.texts.NAME}
							tabIndex={1}
						/>
						<FormikFormGroup
							type="password"
							name="password"
							className="mb-4"
							error={errors.password}
							touched={touched.password}
							additionalComponent={() => (
								<Link to={routes.FORGET_PASSWORD}>
									{locale.texts.FORGET_PASSWORD}
								</Link>
							)}
							label={locale.texts.PASSWORD}
							tabIndex={2}
						/>
						<div className="d-flex justify-content-between">
							<div className="d-flex justify-content-start">
								<Button
									type="submit"
									variant="primary"
									disabled={isSubmitting}
									tabIndex={3}
								>
									{locale.texts.LOG_IN}
								</Button>
							</div>
							<Dropdown
								onSelect={(e) => {
									auth.setLocale(e)
								}}
								drop="up"
							>
								<Dropdown.Toggle variant="light">{locale.name}</Dropdown.Toggle>
								<Dropdown.Menu bsPrefix="dropdown-menu ">
									{Object.values(locale.supportedLocale).map((lang) => {
										return (
											<Dropdown.Item
												className="lang-select"
												eventKey={lang.abbr}
												key={lang.abbr}
											>
												{lang.name}
											</Dropdown.Item>
										)
									})}
								</Dropdown.Menu>
							</Dropdown>
						</div>
					</Form>
				)}
			/>
			<JustifyCenterDiv>
				<div className="position-absolute bottom-0">{locale.texts.LICENCE}</div>
			</JustifyCenterDiv>
		</CenterContainer>
	)
}

export default SigninPage
