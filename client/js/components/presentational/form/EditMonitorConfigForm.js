import React from 'react'
import { Modal, Button, Row, Col } from 'react-bootstrap'
import Select from 'react-select'
import { Formik, Form } from 'formik'
import DateTimePicker from '../../container/DateTimePicker'
import Switcher from '../../container/Switcher'
import styleConfig from '../../../config/styleConfig'
import FormikFormGroup from '../FormikFormGroup'
import { AppContext } from '../../../context/AppContext'
const EditMonitorConfigForm = ({
	selectedData,
	isEdited,
	areaOptions,
	show,
	handleClose,
	handleSubmit,
	title,
	type,
}) => {
	const { locale } = React.useContext(AppContext)

	return (
		<Modal
			show={show}
			onHide={handleClose}
			size="md"
			enforceFocus={false}
			className="text-capitalize"
		>
			<Modal.Header closeButton>
				{locale.texts[title.toUpperCase().replace(/ /g, '_')]}
			</Modal.Header>
			<Modal.Body>
				<Formik
					initialValues={{
						enable: selectedData ? selectedData.enable : 1,
						area: selectedData ? selectedData.area : '',
						start_time: selectedData ? selectedData.start_time : '',
						end_time: selectedData ? selectedData.end_time : '',
					}}
					onSubmit={(values, { setStatus, setSubmitting }) => {
						const monitorConfigPackage = {
							...values,
							id: isEdited == true ? selectedData.id : '',
							type,
							area_id: values.area.id,
						}
						handleSubmit(monitorConfigPackage)
					}}
					render={({
						values,
						errors,
						status,
						touched,
						isSubmitting,
						setFieldValue,
					}) => (
						<Form>
							<Row className="d-flex align-items-center">
								<Col>
									<Switcher
										leftLabel="on"
										rightLabel="off"
										onChange={(e) => {
											const { value } = e.target
											setFieldValue('enable', value)
										}}
										status={values.enable}
									/>
								</Col>
							</Row>
							<hr />
							<FormikFormGroup
								label={locale.texts.AREA}
								error={errors.area}
								touched={touched.area}
								placeholder=""
								component={() => (
									<Select
										placeholder={locale.texts.SELECT_AREA}
										name="area"
										options={areaOptions || []}
										value={values.area}
										styles={styleConfig.reactSelect}
										isDisabled={isEdited}
										onChange={(value) => setFieldValue('area', value)}
										components={{
											IndicatorSeparator: () => null,
										}}
									/>
								)}
							/>
							<Row noGutters className="mb-3">
								<Col>
									<small className="form-text text-muted">
										{locale.texts.ENABLE_START_TIME}
									</small>
									<DateTimePicker
										value={values.start_time}
										getValue={(value) => {
											setFieldValue('start_time', value.value)
										}}
										name="start_time"
										start="0"
										end="24"
									/>
								</Col>
								<Col>
									<small className="form-text text-muted">
										{locale.texts.ENABLE_END_TIME}
									</small>
									<DateTimePicker
										value={values.end_time}
										getValue={(value) => setFieldValue('end_time', value.value)}
										name="end_time"
										start="0"
										end="24"
									/>
								</Col>
							</Row>
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

export default EditMonitorConfigForm
