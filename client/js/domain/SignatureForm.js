import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Formik, Form } from 'formik'
import FormikFormGroup from './FormikFormGroup'
import { AppContext } from '../context/AppContext'
import PropTypes from 'prop-types'

const SignatureForm = ({ show, title, handleClose, handleSubmit }) => {
	const { locale } = React.useContext(AppContext)

	return (
		<Modal
			show={show}
			size="sm"
			onHide={handleClose}
			className="text-capitalize"
		>
			<Modal.Header closeButton>
				{title.toUpperCase().replace(/ /g, '_')}
			</Modal.Header>

			<Modal.Body>
				<Formik
					initialValues={{
						name: '',
					}}
					onSubmit={(values) => {
						handleSubmit(values)
					}}
					render={({ errors, touched, isSubmitting }) => (
						<Form className="text-capitalize">
							<FormikFormGroup
								type="text"
								name="name"
								label={locale.texts.NAME}
								error={errors.name}
								touched={touched.name}
								placeholder=""
							/>
							<Modal.Footer>
								<Button variant="outline-secondary" onClick={handleClose}>
									{locale.texts.CANCEL}
								</Button>
								<Button type="submit" variant="primary" disabled={isSubmitting}>
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

SignatureForm.propTypes = {
	show: PropTypes.bool,
	title: PropTypes.string,
	handleClose: PropTypes.func,
	handleSubmit: PropTypes.func,
}

export default SignatureForm
