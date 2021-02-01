import React, { Fragment } from 'react'
import { Modal, Form } from 'react-bootstrap'
import moment from 'moment'
import config from '../../config'
import { AppContext } from '../../context/AppContext'
import GeneralConfirmForm from '../presentational/form/GeneralConfirmForm'
import DownloadPdfRequestForm from '../presentational/form/DownloadPdfRequestForm'
import Select from 'react-select'
import { setSuccessMessage } from '../../helper/messageGenerator'
import { Formik } from 'formik'
import { getDescription } from '../../helper/descriptionGenerator'
import pdfPackageGenerator from '../../helper/pdfPackageGenerator'
import apiHelper from '../../helper/apiHelper'
import { Title } from '../BOTComponent/styleComponent'
import { SAVE_SUCCESS } from '../../config/wordMap'
import BOTButton from '../BOTComponent/BOTButton'
import PropTypes from 'prop-types'

const style = {
	modalBody: {
		height: '60vh',
	},
	row: {
		wordBreak: 'break-all',
	},
	item: {
		minWidth: 30,
	},
	select: {
		control: (provided) => ({
			...provided,
			width: 200,
		}),
	},
}

class ShiftChange extends React.Component {
	static contextType = AppContext

	formikRef = React.createRef()

	state = {
		fileUrl: '',
		showPdfDownloadForm: false,
		showConfirmForm: false,
		showDownloadPdfRequest: false,
		searchResult: null,
		patients: null,
		notes: '',
	}

	confirmShift = () => {
		const showConfirmForm = config.GENERATE_SHIFT_RECORD_ENABLE_DOUBLE_CONFIRMED
		if (showConfirmForm) {
			this.setState({
				showConfirmForm: true,
			})
		} else {
			this.handleConfirmFormSubmit()
		}
	}

	handleConfirmFormSubmit = async () => {
		const { values } = this.formikRef.current.state
		const { locale, auth, stateReducer } = this.context
		const userId = auth.user.id
		const authentication = auth.user.name
		const [{ area, objectFoundResults, tableSelection }] = stateReducer
		const {
			listName,
			assignedDeviceGroupListids,
			assignedPatientGroupListids,
		} = this.props

		const { devicesResult = {}, patientsReslut = {} } = objectFoundResults

		const shiftChangeObjectPackage = {
			devicesResult,
			patientsReslut,
			selection: tableSelection,
			notes: this.state.notes,
		}

		const pdfPackage = pdfPackageGenerator.getPdfPackage({
			option: 'shiftChange',
			user: auth.user,
			data: shiftChangeObjectPackage,
			locale,
			signature: authentication,
			additional: {
				shift: values.shift,
				area: area.label,
				name: auth.user.name,
				listName,
			},
		})

		/**
		 * Just comment it for the future
		 */
		// this.state.patients.foundPatients.reduce((pkg, object) => {
		// 	const temp = pdfPackageGenerator.getPdfPackage({
		// 		option: 'patientRecord',
		// 		user: auth.user,
		// 		data: object,
		// 		locale,
		// 		signature: authentication,
		// 	})

		// 	if (pkg.pdf) {
		// 		pkg.pdf += `
		//             <div style="page-break-before:always"></div>
		//         `
		// 		pkg.pdf += temp.pdf
		// 	} else {
		// 		pkg = temp
		// 	}
		// 	return pkg
		// }, pdfPackage)
		/**
		 * Just comment it for the future
		 */

		await apiHelper.record.addShiftChangeRecord({
			userInfo: auth.user,
			pdfPackage,
			shift: values.shift,
			list_id: auth.user.list_id,
		})

		await apiHelper.userAssignmentsApiAgent.finish({
			userId,
			groupListIds: [
				...assignedDeviceGroupListids,
				...assignedPatientGroupListids,
			],
		})

		const callback = () => {
			this.props.handleClose(() => {
				setSuccessMessage(SAVE_SUCCESS)
			})
		}

		this.setState(
			{
				fileUrl: pdfPackage.path,
				showConfirmForm: false,
				showDownloadPdfRequest: true,
			},
			callback
		)

		this.props.handleSubmit()
	}

	handleClose = () => {
		this.setState({
			showConfirmForm: false,
			showDownloadPdfRequest: false,
		})
	}

	render() {
		const { locale, auth, stateReducer } = this.context
		const [{ objectFoundResults, tableSelection }] = stateReducer
		const { show, handleClose, listName } = this.props
		const { devicesResult = {}, patientsReslut = {} } = objectFoundResults
		const nowTime = moment().locale(locale.abbr).format(config.TIMESTAMP_FORMAT)
		const hasDevicesFound =
			devicesResult.found && devicesResult.found.length !== 0
		const hasDevicesNotFound =
			devicesResult.notFound && devicesResult.notFound.length !== 0
		const hasPatientsFound =
			patientsReslut.found && patientsReslut.found.length !== 0
		const hasPatientsNotFound =
			patientsReslut.notFound && patientsReslut.notFound.length !== 0

		const shiftOptions = Object.values(config.SHIFT_OPTIONS).map((shift) => {
			return {
				value: shift,
				label: locale.texts[shift.toUpperCase().replace(/ /g, '_')],
			}
		})

		const defaultShiftOption = {
			value: config.getShift(),
			label: locale.texts[config.getShift().toUpperCase().replace(/ /g, '_')],
		}

		return (
			<Fragment>
				<Modal show={show} size="lg" onHide={handleClose}>
					<Formik
						initialValues={{
							shift: defaultShiftOption,
						}}
						ref={this.formikRef}
						onSubmit={(values) => {
							this.confirmShift(values)
						}}
						render={({ values, setFieldValue, submitForm, isSubmitting }) => (
							<Fragment>
								<Modal.Header className="d-flex flex-column text-capitalize">
									<Title>{locale.texts.SHIFT_CHANGE_RECORD}</Title>
									<div>
										{locale.texts.DATE_TIME}: {nowTime}
									</div>
									<div>
										{locale.texts.DEVICE_LOCATION_STATUS_CHECKED_BY}:{' '}
										{auth.user.name}
									</div>
									<div>
										{locale.texts.LIST_NAME}: {listName}
									</div>
									<div className="d-flex align-items-center">
										{locale.texts.SHIFT}: &nbsp;
										<Select
											name="shift"
											options={shiftOptions || []}
											value={values.shift}
											onChange={(value) => setFieldValue('shift', value)}
											styles={style.select}
										/>
									</div>
								</Modal.Header>
								<Modal.Body
									className="overflow-hidden-scroll custom-scrollbar"
									style={style.modalBody}
								>
									{!hasDevicesFound && !hasDevicesNotFound && (
										<div className="d-flex justify-content-center">
											<p className="font-italic ">
												{locale.texts.NOT_ASSIGNED_TO_ANY_DEVICES}
											</p>
										</div>
									)}
									<TypeBlock
										title={locale.texts.DEVICES_FOUND}
										hasType={hasDevicesFound}
										typeArray={devicesResult.found}
										selection={tableSelection}
									/>
									<TypeBlock
										title={locale.texts.DEVICES_NOT_FOUND}
										hasType={hasDevicesNotFound}
										typeArray={devicesResult.notFound}
										selection={tableSelection}
									/>
									<TypeBlock
										title={locale.texts.PATIENTS_FOUND}
										hasType={hasPatientsFound}
										typeArray={patientsReslut.found}
										selection={tableSelection}
									/>
									<TypeBlock
										title={locale.texts.PATIENTS_NOT_FOUND}
										hasType={hasPatientsNotFound}
										typeArray={patientsReslut.notFound}
										selection={tableSelection}
									/>
									<Form.Group controlId="exampleForm.ControlTextarea1">
										<Form.Label>{locale.texts.NOTES}</Form.Label>
										<Form.Control
											as="textarea"
											rows={5}
											onChange={(e) => {
												this.setState({ notes: e.target.value })
											}}
										/>
									</Form.Group>
								</Modal.Body>
								<Modal.Footer>
									<BOTButton
										variant="outline-secondary"
										onClick={handleClose}
										text={locale.texts.CANCEL}
									/>
									<BOTButton
										type="submit"
										variant="primary"
										onClick={submitForm}
										disabled={isSubmitting}
										text={locale.texts.CONFIRM}
									/>
								</Modal.Footer>
							</Fragment>
						)}
					/>
				</Modal>
				<GeneralConfirmForm
					show={this.state.showConfirmForm}
					title={`${locale.texts.PLEASE_LOGIN_TO_CONFIRM}${locale.texts.SHIFT_CHANGE_RECORD}`}
					handleSubmit={this.handleConfirmFormSubmit}
					handleClose={this.handleClose}
					authenticatedRoles={null}
				/>
				<DownloadPdfRequestForm
					show={this.state.showDownloadPdfRequest}
					pdfPath={this.state.fileUrl}
					handleClose={this.handleClose}
				/>
			</Fragment>
		)
	}
}

ShiftChange.propTypes = {
	assignedDeviceGroupListids: PropTypes.array.isRequired,
	assignedPatientGroupListids: PropTypes.array.isRequired,
	show: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	listName: PropTypes.string.isRequired,
}

export default ShiftChange

const TypeBlock = ({ title, hasType, typeArray, selection }) => {
	const appContext = React.useContext(AppContext)
	const { locale } = appContext
	const showChecked = true

	return (
		<Fragment>
			{hasType && <Title sub>{title}</Title>}
			{hasType &&
				typeArray.map((item, index) => {
					const checked = selection.includes(item.id)

					return (
						<div className="d-flex justify-content-start" key={index}>
							<div style={style.item} className="d-flex justify-content-center">
								{index + 1}.
							</div>
							<div key={index} className="pb-1" style={style.row}>
								{getDescription({
									item,
									locale,
									keywordType: config,
									showChecked,
									checked,
								})}
							</div>
						</div>
					)
				})}
		</Fragment>
	)
}

TypeBlock.propTypes = {
	title: PropTypes.string,
	hasType: PropTypes.bool,
	typeArray: PropTypes.array,
	selection: PropTypes.array,
}
