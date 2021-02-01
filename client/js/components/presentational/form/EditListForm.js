import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Formik, Form } from 'formik'
import { AppContext } from '../../../context/AppContext'
import Select from 'react-select'
import FormikFormGroup from '../FormikFormGroup'
import styleConfig from '../../../config/styleConfig'

const EditListForm = ({
	show,
	handleClose,
	handleSubmit,
	title,
	areaOptions,
}) => {
	const { locale } = React.useContext(AppContext)

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton className="text-capitalize">
				{title}
			</Modal.Header>
			<Modal.Body>
				<Formik
					initialValues={{
						name: '',
						area: '',
					}}
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
								label={locale.texts.NAME}
								placeholder=""
							/>
							<FormikFormGroup
								type="text"
								name="area"
								label={locale.texts.AUTH_AREA}
								error={errors.area}
								touched={touched.area}
								placeholder=""
								component={() => (
									<Select
										placeholder=""
										name="area"
										value={values.area}
										onChange={(value) => setFieldValue('area', value)}
										options={areaOptions || []}
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

export default EditListForm
