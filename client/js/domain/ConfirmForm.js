import React from 'react'
import { Modal, Button, Row, Col, ButtonToolbar } from 'react-bootstrap'
import config from '../config'
import moment from 'moment'
import { Formik, Form } from 'formik'
import { AppContext } from '../context/AppContext'
import FormikFormGroup from './FormikFormGroup'
import { RESERVE, TRANSFERRED } from '../config/wordMap'
import { convertStatusToText } from '../helper/utilities'
import PropTypes from 'prop-types'

class ConfirmForm extends React.Component {
	static contextType = AppContext

	state = {
		isShowForm: false,
		reserveInitTime: moment(),
		isDelayTime: false,
	}

	handleClose = () => {
		if (this.props.handleChangeObjectStatusFormClose) {
			this.props.handleChangeObjectStatusFormClose()
		}
		this.setState({
			isDelayTime: false,
		})
	}

	handleButtonClick = (e) => {
		const { name } = e.target
		switch (name) {
			case RESERVE:
				this.setState({
					isDelayTime: !this.state.isDelayTime,
				})
		}
	}

	render() {
		const style = {
			deviceList: {
				maxHeight: '20rem',
			},
		}

		const { title, selectedObjectData } = this.props

		const { isDelayTime } = this.state

		const { locale } = this.context

		const hasSelectedObjectData = !!selectedObjectData[0]
		const isTransferObject = !!(
			hasSelectedObjectData && selectedObjectData[0].status === TRANSFERRED
		)
		const isReservedObject = !!(
			hasSelectedObjectData && selectedObjectData[0].status === RESERVE
		)

		return (
			<Modal
				id="confirmForm"
				show={this.props.show}
				onHide={this.handleClose}
				size="md"
				className="text-capitalize"
			>
				<Modal.Header closeButton>
					{locale.texts[title.toUpperCase().replace(/ /g, '_')]}
				</Modal.Header>
				<Modal.Body>
					<Formik
						initialValues={{
							name:
								selectedObjectData.length !== 0
									? selectedObjectData[0].name
									: '',
							type:
								selectedObjectData.length !== 0
									? selectedObjectData[0].type
									: '',
							asset_control_number:
								selectedObjectData.length !== 0
									? selectedObjectData[0].asset_control_number
									: '',
						}}
						onSubmit={() => {
							this.props.handleConfirmFormSubmit(this.state.isDelayTime)
						}}
						render={({ errors, touched, isSubmitting }) => (
							<Form>
								<div className="custom-scrollbar" style={style.deviceList}>
									{selectedObjectData.map((item, index) => {
										return (
											<div key={index}>
												{index > 0 ? <hr /> : null}
												<Row noGutters>
													<Col>
														<FormikFormGroup
															type="text"
															name="name"
															label={locale.texts.NAME}
															errors={errors.name}
															touched={touched.name}
															placeholder=""
															disabled
														/>
													</Col>
													<Col>
														<FormikFormGroup
															type="text"
															name="type"
															label={locale.texts.TYPE}
															errors={errors.type}
															touched={touched.type}
															placeholder=""
															disabled
														/>
													</Col>
												</Row>
												<FormikFormGroup
													type="text"
													name="asset_control_number"
													label={locale.texts.ACN}
													errors={errors.asset_control_number}
													touched={touched.asset_control_number}
													placeholder=""
													disabled
												/>
											</div>
										)
									})}
								</div>
								<hr />
								<Row>
									<Col className="d-flex justify-content-center text-capitalize">
										<div className="d-flex flex-column">
											<h6 className="d-flex justify-content-center">
												{hasSelectedObjectData &&
													convertStatusToText(
														locale,
														selectedObjectData[0].status
													)}
												&nbsp;
												{isTransferObject && locale.texts.TO}
											</h6>

											{isTransferObject ? (
												<h6>
													<div>
														{selectedObjectData[0].transferred_location.label}
													</div>
												</h6>
											) : null}
											{isReservedObject && (
												<>
													{isReservedObject && locale.texts.FROM}
													<div className="d-flex justify-content-center">
														{isDelayTime
															? moment()
																	.add(config.reservedDelayTime, 'minutes')
																	.locale(locale.abbr)
																	.format('LT')
															: moment().locale(locale.abbr).format('LT')}
														~
														{isDelayTime
															? moment()
																	.add(
																		config.reservedInterval +
																			config.reservedDelayTime,
																		'minutes'
																	)
																	.locale(locale.abbr)
																	.format('LT')
															: moment()
																	.add(config.reservedInterval, 'minutes')
																	.locale(locale.abbr)
																	.format('LT')}
													</div>
													<Row className="d-flex justify-content-center">
														<ButtonToolbar>
															<Button
																variant="outline-secondary"
																className="mr-2 text-capitalize"
																onClick={this.handleButtonClick}
																name="reserve"
															>
																{this.state.isDelayTime
																	? locale.texts.RETURN
																	: locale.texts.DELAY_BY}{' '}
																{config.reservedDelayTime}{' '}
																{locale.texts.MINUTES}
															</Button>
														</ButtonToolbar>
													</Row>
												</>
											)}
										</div>
									</Col>
								</Row>
								<Row>
									<Col className="d-flex justify-content-center">
										<h6>
											{moment()
												.locale(locale.abbr)
												.format(config.TIMESTAMP_FORMAT)}
										</h6>
									</Col>
								</Row>

								<Modal.Footer>
									<Button
										variant="outline-secondary"
										onClick={this.handleClose}
										className="text-capitalize"
									>
										{locale.texts.CANCEL}
									</Button>
									<Button
										type="submit"
										className="text-capitalize"
										variant="primary"
										disabled={isSubmitting}
									>
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
}

ConfirmForm.propTypes = {
	handleChangeObjectStatusFormClose: PropTypes.func,
	title: PropTypes.string,
	selectedObjectData: PropTypes.object,
	show: PropTypes.bool,
	handleConfirmFormSubmit: PropTypes.func,
}

export default ConfirmForm
