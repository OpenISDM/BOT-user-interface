import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import { object, string } from 'yup'
import { AppContext } from '../context/AppContext'
import PropTypes from 'prop-types'

const EditPwdForm = ({ show, handleClose, handleSubmit }) => {
	const { locale } = React.useContext(AppContext)

	let new_password_store = ''

	return (
		<Modal show={show} onHide={handleClose} size="md">
			<Modal.Header closeButton className="text-capitalize">
				{locale.texts.EDIT_PASSWORD}
			</Modal.Header>
			<Modal.Body className="mb-2">
				<Formik
					initialValues={{
						new_password: '',
						check_password: '',
					}}
					validationSchema={object().shape({
						new_password: string()
							.required(locale.texts.ENTER_THE_PASSWORD)
							.test('new_password', '', (value) => {
								new_password_store = value
								return true
							})
							.max(20, locale.texts.LIMIT_IN_TWENTY_CHARACTER),

						check_password: string()
							.required(locale.texts.ENTER_THE_PASSWORD)
							.test(
								'check_password',
								locale.texts.PASSWORD_NOT_FIT,
								(value) => {
									if (value === new_password_store) {
										return true
									}
									return false
								}
							),
					})}
					onSubmit={(values) => {
						handleSubmit(values)
					}}
					render={({ errors, touched, isSubmitting }) => (
						<Form className="text-capitalize">
							<div className="form-group">
								<small id="TextIDsmall" className="form-text text-muted ">
									{locale.texts.NEW_PASSWORD}
								</small>
								<Field
									type="password"
									name="new_password"
									// placeholder={locale.texts.ENTER_THE_PASSWORD}
									className={
										'form-control' +
										(errors.new_password && touched.new_password
											? ' is-invalid'
											: '')
									}
								/>
								<ErrorMessage
									name="new_password"
									component="div"
									className="invalid-feedback"
								/>
							</div>

							<div className="form-group">
								<small id="TextIDsmall" className="form-text text-muted">
									{locale.texts.CHECK_PASSWORD}
								</small>
								<Field
									type="password"
									name="check_password"
									// placeholder={locale.texts.ENTER_THE_PASSWORD}
									className={
										'form-control' +
										(errors.check_password && touched.check_password
											? ' is-invalid'
											: '')
									}
								/>
								<ErrorMessage
									name="check_password"
									component="div"
									className="invalid-feedback"
								/>
							</div>

							<Modal.Footer>
								<Button
									variant="outline-secondary"
									className="text-capitalize"
									onClick={handleClose}
								>
									{locale.texts.CANCEL}
								</Button>
								<Button
									type="submit"
									className="text-capitalize"
									variant="primary"
									disabled={isSubmitting}
								>
									{locale.texts.SAVE}
								</Button>
							</Modal.Footer>
						</Form>
					)}
				/>
			</Modal.Body>
		</Modal>
	)
}

EditPwdForm.propTypes = {
	show: PropTypes.bool,
	handleClose: PropTypes.func,
	handleSubmit: PropTypes.func,
}

export default EditPwdForm
