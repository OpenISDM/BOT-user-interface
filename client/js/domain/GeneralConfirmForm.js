import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Formik, Form } from 'formik'
import { object, string } from 'yup'
import { AppContext } from '../context/AppContext'
import API from '../api'
import FormikFormGroup from './FormikFormGroup'
import PropTypes from 'prop-types'
import { Paragraph } from '../components/StyleComponents'

const style = {
	modal: {
		top: '10%',
	},
}

const GeneralConfirmForm = ({ show, handleClose, title }) => {
	const { locale } = React.useContext(AppContext)

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
						const res = await API.Auth.confirmValidation({
							username,
							password,
						})
						if (!res.data.confirmation) {
							setStatus(res.data.message)
							setSubmitting(false)
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
	title: PropTypes.string,
	authenticatedRoles: PropTypes.string,
}

export default GeneralConfirmForm
