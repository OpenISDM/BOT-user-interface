import React from 'react'
import { Modal, Button, ListGroup } from 'react-bootstrap'
import { Formik, Field, Form } from 'formik'
import { object } from 'yup'
import moment from 'moment'
import { AppContext } from '../context/AppContext'
import {
	EditedTime,
	Primary,
	Paragraph,
	FormFieldName,
} from '../components/StyleComponents'
import FormikFormGroup from './FormikFormGroup'
import PropTypes from 'prop-types'

const style = {
	index: {
		minWidth: 10,
	},
	item: {
		minWidth: 30,
	},
	blockOne: {
		minWidth: 'initial',
	},
}

class PatientViewModal extends React.Component {
	static contextType = AppContext

	state = {
		display: true,
	}

	handleClose = () => {
		this.props.handleClose(() => {
			this.setState({
				display: true,
			})
		})
	}

	render() {
		const { show, handleSubmit, data, title } = this.props
		const { locale } = this.context

		const patientData = data[0] ? data[0] : {} // Get only first patient item for now

		const {
			name = '',
			type_alias,
			asset_control_number,
			lbeacon_area,
			record,
			records,
		} = patientData

		const recordBlock = {
			display: this.state.display ? '' : 'none',
		}

		return (
			<Modal
				show={show}
				onHide={this.handleClose}
				size="md"
				enforceFocus={false}
			>
				<Modal.Header>
					{locale.texts[title.toUpperCase().replace(/ /g, '_')]}
				</Modal.Header>
				<Modal.Body>
					<Formik
						initialValues={{
							record: '',
						}}
						validationSchema={object().shape({})}
						onSubmit={(values) => {
							handleSubmit(values)
						}}
						render={({ values, errors, touched, isSubmitting }) => (
							<Form>
								<FormikFormGroup
									type="text"
									name="name"
									label={locale.texts.NAME}
									value={name}
									error={errors.name}
									touched={touched.name}
									placeholder=""
									disabled
								/>
								<FormikFormGroup
									type="text"
									name="name"
									label={locale.texts.ALIAS}
									value={type_alias}
									error={errors.name}
									touched={touched.name}
									placeholder=""
									disabled
								/>
								<FormikFormGroup
									type="text"
									name="name"
									label={locale.texts.PATIENT_NUMBER}
									value={asset_control_number}
									error={errors.name}
									touched={touched.name}
									placeholder=""
									disabled
								/>
								<FormikFormGroup
									type="text"
									name="name"
									label={locale.texts.LOCATION}
									value={lbeacon_area !== undefined ? lbeacon_area.value : null}
									error={errors.name}
									touched={touched.name}
									placeholder=""
									disabled
								/>
								<hr />
								<div className="mb-2 text-capitalize">
									<FormFieldName>{locale.texts.ADD_NEW_RECORD}</FormFieldName>
									<Field
										component="textarea"
										value={values.record}
										name="record"
										className={
											'form-control' +
											(errors.record && touched.record ? ' is-invalid' : '')
										}
										rows={3}
									/>
								</div>
								<FormFieldName
									className="mb-2 cursor-pointer"
									onClick={() => {
										this.setState({
											display: !this.state.display,
										})
									}}
								>
									{locale.texts.PATIENT_HISTORICAL_RECORD}
									&nbsp;
									<i
										className={`fas ${
											this.state.display ? 'fa-angle-up' : 'fa-angle-down'
										}`}
									/>
								</FormFieldName>

								<div style={recordBlock}>
									{record && record.length !== 0 && (
										<hr style={{ margin: 0 }}></hr>
									)}

									<ListGroup className="text-none px-0 max-height-30 custom-scrollbar">
										{records && records.length !== 0 && (
											<div>
												{records.map((item, index) => {
													return recordBlockTypeTwo(item, index, locale)
												})}
											</div>
										)}
									</ListGroup>
								</div>
								<Modal.Footer>
									<Button
										variant="outline-secondary"
										className="text-capitalize"
										onClick={this.handleClose}
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
}

// const recordBlockTypeOne = (item, index, locale) => {
// 	return (
// 		<ListGroup.Item
// 			key={index}
// 			className="d-flex justify-content-start"
// 			style={style.blockOne}
// 		>
// 			<div style={style.index}>&bull;</div>
// 			&nbsp;
// 			<div key={index} className="pb-1">
// 				{moment(item.create_timestamp)
// 					.locale(locale.abbr)
// 					.format('YYYY/MM/DD hh:mm')}
// 				, &nbsp;
// 				{item.notes}
// 			</div>
// 		</ListGroup.Item>
// 	)
// }

const recordBlockTypeTwo = (item, index, locale) => {
	return (
		<ListGroup.Item key={index} style={style.blockOne} className="pl-0 mb-3">
			<div className="d-flex justify-content-start">
				<div className="color-black d-flex justify-content-start">
					<Primary>{item.recorded_user}</Primary>
					&nbsp;
					<EditedTime>
						{moment(item.created_timestamp).locale(locale.abbr).format('lll')}
					</EditedTime>
				</div>
			</div>
			<Paragraph>{item.record}</Paragraph>
		</ListGroup.Item>
	)
}

PatientViewModal.propTypes = {
	handleClose: PropTypes.func,
	show: PropTypes.bool,
	handleSubmit: PropTypes.func,
	data: PropTypes.array,
	title: PropTypes.string,
}

export default PatientViewModal
