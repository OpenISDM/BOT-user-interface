import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Formik, Form } from 'formik'
import { AppContext } from '../context/AppContext'
import PropTypes from 'prop-types'

const DeleteConfirmationForm = ({
	handleClose,
	handleSubmit,
	show,
	message,
}) => {
	const { locale } = React.useContext(AppContext)

	return (
		<Modal show={show} centered={true} onHide={handleClose} size="md">
			<Modal.Header closeButton>{locale.texts.REMINDER}</Modal.Header>
			<Modal.Body>
				<Formik
					onSubmit={() => {
						handleSubmit()
					}}
					render={({ isSubmitting }) => (
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

DeleteConfirmationForm.propTypes = {
	handleClose: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired,
	message: PropTypes.string.isRequired,
}
export default DeleteConfirmationForm
