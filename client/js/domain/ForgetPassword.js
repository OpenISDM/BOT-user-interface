import React from 'react'
import { Button } from 'react-bootstrap'
import config from '../config'
import { AppContext } from '../context/AppContext'
import { Formik, Form } from 'formik'
import { object, string } from 'yup'
import {
	CenterContainer,
	Title,
	Paragraph,
} from '../components/StyleComponents'
import FormikFormGroup from './FormikFormGroup'
import { useHistory } from 'react-router-dom'
import API from '../api'
import { emailValidation } from '../helper/validation'
import ImageWebp from '../components/ImageWebp'

const imageLength = 80

const ForgetPassword = () => {
	const { locale } = React.useContext(AppContext)
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
					email: '',
				}}
				validationSchema={object().shape({
					email: string()
						.required(locale.texts.REQUIRED)
						.test(
							'email',
							locale.texts.EMAIL_ADDRESS_FORMAT_IS_INCORRECT,
							emailValidation
						),
				})}
				onSubmit={async (values, { setStatus }) => {
					const { email } = values
					setStatus('verifying')
					await API.Auth.sentResetPwdInstruction({
						email,
					})
					history.push('/resetpassword/instruction')
				}}
				render={({ errors, touched, isSubmitting }) => (
					<Form>
						{errors.email && touched.email && (
							<div className="alert alert-danger mb-2 warning">
								<i className="fas fa-times-circle mr-2" />
								{errors.email}
							</div>
						)}
						<Title page>{locale.texts.FORGET_PASSWORD}</Title>
						<Paragraph>{locale.texts.REQUEST_EMAIL_INSTRUCTION}</Paragraph>

						<FormikFormGroup
							type="text"
							name="email"
							className="my-4"
							label={locale.texts.EMAIL}
						/>
						<div className="d-flex justify-content-start">
							<Button type="submit" variant="primary" disabled={isSubmitting}>
								{locale.texts.SEND_RESET_INSTRUCTION}
							</Button>
						</div>
					</Form>
				)}
			/>
		</CenterContainer>
	)
}

export default ForgetPassword
