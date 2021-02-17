import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Formik, Form } from 'formik'
import { object, string } from 'yup'
import FormikFormGroup from './FormikFormGroup'
import Creatable from 'react-select/creatable'
import styleConfig from '../config/styleConfig'
import { AppContext } from '../context/AppContext'
import PropTypes from 'prop-types'

const validationSchema = object().shape({
	name: string()
		.min(1, 'Must be at least 1 characters')
		.required('Field is required'),
	department: string()
		.min(1, 'Must be at least 1 characters')
		.required('Field is required'),
})

const EditTransferLocationForm = ({
	show,
	actionName,
	handleClose,
	handleSubmit,
	title,
	locationOptions,
}) => {
	const { locale } = React.useContext(AppContext)

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header className="text-capitalize">{title}</Modal.Header>
			<Modal.Body>
				<Formik
					initialValues={{
						name: '',
						department: '',
					}}
					validationSchema={validationSchema}
					onSubmit={(values) => {
						handleSubmit(values)
					}}
					render={({
						values,
						errors,
						touched,
						isSubmitting,
						setFieldValue,
					}) => (
						<Form>
							<FormikFormGroup
								type="text"
								name="name"
								label={locale.texts.TRANSFERRED_LOCATION}
								error={errors.name}
								touched={touched.name}
								placeholder=""
								component={() => (
									<Creatable
										placeholder=""
										name="name"
										value={values.area}
										onChange={(value) => setFieldValue('name', value)}
										options={locationOptions}
										styles={styleConfig.reactSelect}
										components={{
											IndicatorSeparator: () => null,
										}}
									/>
								)}
							/>
							<FormikFormGroup
								type="text"
								name="department"
								label={locale.texts.DEPARTMENT}
								placeholder=""
								error={errors.department}
								touched={touched.department}
							/>
							<Modal.Footer>
								<Button
									variant="outline-secondary"
									name={actionName}
									onClick={handleClose}
								>
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

EditTransferLocationForm.propTypes = {
	show: PropTypes.bool,
	actionName: PropTypes.string,
	handleClose: PropTypes.func,
	handleSubmit: PropTypes.func,
	title: PropTypes.string,
	locationOptions: PropTypes.object,
}

export default EditTransferLocationForm
