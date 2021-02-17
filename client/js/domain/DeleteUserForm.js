import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Formik, Form } from 'formik'
import Select from 'react-select'
import { object, string } from 'yup'
import FormikFormGroup from './FormikFormGroup'
import styleConfig from '../config/styleConfig'
import { AppContext } from '../context/AppContext'
import PropTypes from 'prop-types'

const DeleteUserForm = ({ show, title, data, handleClose, handleSubmit }) => {
	const { locale } = React.useContext(AppContext)

	const userOptions = data.map((item) => {
		return {
			value: item.id,
			label: item.name,
		}
	})

	return (
		<Modal show={show} size="sm" onHide={handleClose}>
			<Modal.Header closeButton>{title}</Modal.Header>

			<Modal.Body>
				<Formik
					initialValues={{
						name: '',
					}}
					validationSchema={object().shape({
						name: string().required(locale.texts.NAME_IS_REQUIRED),
					})}
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
								name="nameName"
								label={locale.texts.DELETE}
								error={errors.nameName}
								touched={touched.nameName}
								placeholder={locale.texts.USERNAME}
								component={() => (
									<Select
										placeholder={locale.texts.SELECT_USER}
										name="name"
										value={values.name}
										onChange={(value) => setFieldValue('name', value)}
										options={userOptions || []}
										styles={styleConfig.reactSelect}
										components={{
											IndicatorSeparator: () => null,
										}}
									/>
								)}
							/>

							<Modal.Footer>
								<Button variant="outline-secondary" onClick={handleClose}>
									{locale.texts.CANCEL}
								</Button>
								<Button type="submit" variant="primary" disabled={isSubmitting}>
									{locale.texts.DELETE}
								</Button>
							</Modal.Footer>
						</Form>
					)}
				/>
			</Modal.Body>
		</Modal>
	)
}

DeleteUserForm.propTypes = {
	show: PropTypes.bool,
	title: PropTypes.string,
	data: PropTypes.array,
	handleClose: PropTypes.func,
	handleSubmit: PropTypes.func,
}

export default DeleteUserForm
