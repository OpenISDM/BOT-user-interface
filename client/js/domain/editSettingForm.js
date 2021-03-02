import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { AppContext } from '../context/AppContext'
import { Formik, Form } from 'formik'
import FormikFormGroup from './FormikFormGroup'
import PropTypes from 'prop-types'

const EditSettingForm = ({
	title,
	selectedObjectData = {},
	show,
	handleClose,
	handleSubmit,
	isShowDescription = true,
	isShowUUID = true,
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
						const { description, comment } = values
						const settingPackage = {
							...selectedObjectData,
							description,
							comment,
						}
						handleSubmit(settingPackage)
					}}
					render={({ errors, touched, isSubmitting }) => (
						<Form>
							{isShowUUID ? (
								<FormikFormGroup
									type="text"
									name="uuid"
									label={locale.texts.UUID}
									error={errors.uuid}
									touched={touched.uuid}
									placeholder=""
									disabled
								/>
							) : null}
							{isShowDescription ? (
								<FormikFormGroup
									type="text"
									name="description"
									label={locale.texts.DESCRIPTION}
									error={errors.description}
									touched={touched.description}
									placeholder=""
								/>
							) : null}
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

EditSettingForm.propTypes = {
	title: PropTypes.string,
	selectedObjectData: PropTypes.object,
	show: PropTypes.bool,
	handleClose: PropTypes.func,
	handleSubmit: PropTypes.func,
	isShowUUID: PropTypes.bool,
	isShowDescription: PropTypes.bool,
}

export default EditSettingForm
