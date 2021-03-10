import React from 'react'
import { AppContext } from '../context/AppContext'
import { Modal, Row, Col, ButtonToolbar } from 'react-bootstrap'
import Button from '../components/Button'
import { Formik, Form } from 'formik'
import FormikFormGroup from '../domain/FormikFormGroup'
import API from '../api'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'

class RequestTraceForm extends React.Component {
	static contextType = AppContext

	state = {}

	render() {
		//const { show } = this.state
		const { show, handleClose, handleSubmit } = this.props
		return (
			<Modal show={show} onHide={handleClose} size="md">
				<Modal.Header>要求物件追蹤</Modal.Header>
				<Modal.Body>
					<Formik
						render={({
							values,
							errors,
							touched,
							isSubmitting,
							setFiledValue,
							submitForm,
						}) => (
							<Form>
								<FormikFormGroup label={'使用者名稱'} />
								<FormikFormGroup label={'使用者ID'} />
								<Row noGutters>
									<Col>
										<FormikFormGroup label={'設備名稱'} />
									</Col>
									<Col>
										<FormikFormGroup label={'別名'} />
									</Col>
								</Row>
								<Row noGutters>
									<Col>
										<FormikFormGroup label={'分類'} />
									</Col>
									<Col>
										<FormikFormGroup label={'所屬區域'} />
									</Col>
								</Row>
								<FormikFormGroup label={'財產編號'} />
								<FormikFormGroup label={'追蹤時長'} />
								<Row className="d-flex justify-content-center">
									{/* <ButtonToolbar> */}
									<div>
										<Button text={'增加物件'} />
									</div>
									<div>
										<Button text={'移除物件'} />
									</div>
									{/* </ButtonToolbar> */}
								</Row>
								<Modal.Footer>
									<ButtonToolbar className="d-flex justify-content-end">
										<Button text={'取消'} />
										<Button type="button" variant="primary" text={'提交'} />
									</ButtonToolbar>
								</Modal.Footer>
							</Form>
						)}
					/>
				</Modal.Body>
				{/* <Modal.Footer></Modal.Footer> */}
			</Modal>
		)
	}
}

RequestTraceForm.protoTypes = {
	show: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
}

export default RequestTraceForm
