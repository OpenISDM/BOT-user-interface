import React from 'react'
import { Button, Dropdown } from 'react-bootstrap'
import config from '../config'
import { Formik, Form } from 'formik'
import { object, string } from 'yup'
import {
	CenterContainer,
	JustifyCenterDiv,
} from '../components/StyleComponents'
import FormikFormGroup from './FormikFormGroup'
import { Link, useHistory } from 'react-router-dom'
import routes from '../config/routes/routes'
import { AppContext } from '../context/AppContext'
import ImageWebp from '../components/ImageWebp'

const imageLength = 80

const SigninPage = () => {
	const appContext = React.useContext(AppContext)
	const { locale, auth } = appContext
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
					auth.login(values, { actions, callback, locale })
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
