import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { AppContext } from '../context/AppContext'
import { Formik, Form } from 'formik'
import FormikFormGroup from './FormikFormGroup'
import PropTypes from 'prop-types'

const EditGatewayForm = ({
	title,
	selectedObjectData = {},
	show,
	handleClose,
	handleSubmit,
}) => {
	const { locale } = React.useContext(AppContext)
	const { uuid, description, comment } = selectedObjectData

	return (
		<Modal
			show={show}
			onHide={handleClose}
			size="md"
			className="text-capitalize"
		>
			<Modal.Header closeButton>
				{locale.texts[title.toUpperCase().replace(/ /g, '_')]}
			</Modal.Header>
			<Modal.Body>
				<Formik
					initialValues={{
						description: description || '',
						uuid,
						comment,
					}}
					onSubmit={(values) => {
						const { comment } = values
						const settingPackage = {
							...selectedObjectData,
							comment,
						}
						handleSubmit(settingPackage)
					}}
					render={({ isSubmitting }) => (
						<Form>
							<FormikFormGroup
								type="text"
								name="comment"
								label={locale.texts.COMMENT}
								placeholder=""
							/>
							<Modal.Footer>
								<Button variant="outline-secondary" onClick={handleClose}>
									{locale.texts.CANCEL}
								</Button>
								<Button type="submit" variant="primary" disabled={isSubmitting}>
									{locale.texts.SEND}
								</Button>
							</Modal.Footer>
						</Form>
					)}
				/>
			</Modal.Body>
		</Modal>
	)
}

EditGatewayForm.propTypes = {
	title: PropTypes.string,
	selectedObjectData: PropTypes.object,
	show: PropTypes.bool,
	handleClose: PropTypes.func,
	handleSubmit: PropTypes.func,
}

export default EditGatewayForm
