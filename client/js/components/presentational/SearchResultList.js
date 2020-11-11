/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        SearchResultList.js

    File Description:
        BOT UI component

    Version:
        1.0, 20200601

    Abstract:
        BeDIS uses LBeacons to deliver 3D coordinates and textual descriptions of
        their locations to users' devices. Basically, a LBeacon is an inexpensive,
        Bluetooth device. The 3D coordinates and location description of every
        LBeacon are retrieved from BeDIS (Building/environment Data and Information
        System) and stored locally during deployment and maintenance times. Once
        initialized, each LBeacon broadcasts its coordinates and location
        description to Bluetooth enabled user devices within its coverage area. It
        also scans Bluetooth low-energy devices that advertise to announced their
        presence and collect their Mac addresses.

    Authors:
        Tony Yeh, LT1stSoloMID@gmail.com
        Wayne Kang, b05505028@ntu.edu.tw
        Edward Chen, r08921a28@ntu.edu.tw
        Joe Chou, jjoe100892@gmail.com
*/

import React, { Fragment } from 'react'
import { AppContext } from '../../context/AppContext'
import {
	TabletView,
	MobileOnlyView,
	isTablet,
	CustomView,
	isMobile,
} from 'react-device-detect'
import TabletSearchResultList from '../platform/tablet/TabletSearchResultList'
import MobileSearchResultList from '../platform/mobile/MobileSearchResultList'
import BrowserSearchResultList from '../platform/browser/BrowserSearchResultList'
import ChangeStatusForm from './form/ChangeStatusForm'
import PatientViewModal from '../presentational/PatientViewModal'
import ConfirmForm from '../container/ConfirmForm'
import DownloadPdfRequestForm from '../presentational/form/DownloadPdfRequestForm'
import config from '../../config'
import moment from 'moment'
import apiHelper from '../../helper/apiHelper'
import messageGenerator from '../../helper/messageGenerator'
import pdfPackageGenerator from '../../helper/pdfPackageGenerator'
import { SET_ENABLE_REQUEST_TRACKING_DATA } from '../../reducer/action'
import { JSONClone } from '../../helper/utilities'
import PropTypes from 'prop-types'

class SearchResultList extends React.Component {
	static contextType = AppContext

	state = {
		showEditObjectForm: false,
		showConfirmForm: false,
		showAddDevice: false,
		showDownloadPdfRequest: false,
		showPath: false,
		showPatientView: false,
		showPatientResult: false,
		selectedObjectData: [],
		signatureName: '',
		selection: [],
		editedObjectPackage: [],
	}

	onSelect = (eventKey) => {
		const { stateReducer } = this.context
		const [, dispatch] = stateReducer
		const eventItem = eventKey.split(':')
		const isFound = parseInt(eventItem[0])
		const number = parseInt(eventItem[1])
		const selectItem = isFound
			? this.props.searchResult.filter((item) => item.found)[number]
			: this.props.searchResult.filter((item) => !item.found)[number]
		if (parseInt(selectItem.object_type) === 0) {
			/** The reason using array to encapture the selectedObjectData is to have the consisten data form passed into ChangeStatusForm */
			this.toggleSelection(number, isFound)
			this.props.highlightSearchPanel(true)
			dispatch({
				type: SET_ENABLE_REQUEST_TRACKING_DATA,
				value: false,
			})
		} else {
			this.setState({
				showPatientView: true,
				selectedObjectData: selectItem,
			})
		}
	}

	toggleSelection = (number, isFound) => {
		let selection = [...this.state.selection]
		const selectItem = isFound
			? this.props.searchResult.filter((item) => item.found)[number]
			: this.props.searchResult.filter((item) => !item.found)[number]
		const mac = selectItem.mac_address
		const index = selection.indexOf(mac)

		let selectedObjectData = [...this.state.selectedObjectData]
		if (this.state.showAddDevice) {
			if (index >= 0) {
				if (selection.length === 1) return
				selection = [
					...selection.slice(0, index),
					...selection.slice(index + 1),
				]
				selectedObjectData = [
					...selectedObjectData.slice(0, index),
					...selectedObjectData.slice(index + 1),
				]
			} else {
				selection.push(mac)
				selectedObjectData.push(selectItem)
			}
		} else {
			selection = [mac]
			selectedObjectData = [selectItem]
		}
		this.setState({
			showEditObjectForm: true,
			selection,
			selectedObjectData,
		})
	}

	handleChangeObjectStatusFormClose = () => {
		const { stateReducer } = this.context
		const [, dispatch] = stateReducer
		this.setState({
			showEditObjectForm: false,
			showConfirmForm: false,
			selection: [],
			selectedObjectData: [],
			showAddDevice: false,
		})
		dispatch({
			type: SET_ENABLE_REQUEST_TRACKING_DATA,
			value: true,
		})
		this.props.highlightSearchPanel(false)
	}

	handleChangeObjectStatusFormSubmit = (values) => {
		const editedObjectPackage = JSONClone(this.state.selectedObjectData).map(
			(item) => {
				item.status = values.action_options.toLowerCase()
				item.transferred_location = values.transferred_location
					? values.transferred_location
					: ''
				item.notes = values.notes
				return item
			}
		)

		this.setState({
			showEditObjectForm: false,
			editedObjectPackage,
		})

		this.setState(
			{
				showConfirmForm: true,
			},
			this.props.highlightSearchPanel(false)
		)
	}

	handleSignatureSubmit = (values) => {
		this.setState(
			{
				signatureName: values.name,
				showConfirmForm: true,
			},
			this.props.highlightSearchPanel(false)
		)
	}

	handleConfirmFormSubmit = async (isDelayTime) => {
		const signatureName = this.state.signatureName
		const { editedObjectPackage } = this.state
		const { locale, auth, stateReducer } = this.context
		const [, dispatch] = stateReducer
		const username = auth.user.name
		const shouldCreatePdf = config.statusToCreatePdf.includes(
			editedObjectPackage[0].status
		)
		const status = editedObjectPackage[0].status
		const reservedTimestamp = isDelayTime
			? moment().add(10, 'minutes').format()
			: moment().format()

		/** Create the pdf package, including pdf, pdf setting and path */
		const pdfPackage =
			shouldCreatePdf &&
			pdfPackageGenerator.getPdfPackage({
				option: status,
				user: auth.user,
				data: this.state.editedObjectPackage,
				locale,
				signature: signatureName,
			})

		await apiHelper.objectApiAgent.editObjectPackage(
			locale,
			editedObjectPackage,
			username,
			pdfPackage,
			reservedTimestamp
		)

		const callback = () => {
			dispatch({
				type: SET_ENABLE_REQUEST_TRACKING_DATA,
				value: true,
			})
			messageGenerator.setSuccessMessage('edit object success')
		}
		this.setState(
			{
				showConfirmForm: shouldCreatePdf,
				showAddDevice: false,
				showDownloadPdfRequest: shouldCreatePdf,
				pdfPath: shouldCreatePdf && pdfPackage.path,
				selection: [],
			},
			callback
		)
	}

	handleAdditionalButton = () => {
		const selection = []
		const selectedObjectData = []
		if (this.state.showAddDevice) {
			selection.push(this.state.selection[0])
			selectedObjectData.push(this.state.selectedObjectData[0])
		}
		this.setState({
			showAddDevice: !this.state.showAddDevice,
			selection: this.state.showAddDevice ? selection : this.state.selection,
			selectedObjectData: this.state.showAddDevice
				? selectedObjectData
				: this.state.selectedObjectData,
		})
	}

	handleRemoveButton = (e) => {
		const mac = e.target.getAttribute('name')
		let selection = [...this.state.selection]
		let selectedObjectData = [...this.state.selectedObjectData]
		const index = selection.indexOf(mac)

		if (index > -1) {
			selection = [...selection.slice(0, index), ...selection.slice(index + 1)]
			selectedObjectData = [
				...selectedObjectData.slice(0, index),
				...selectedObjectData.slice(index + 1),
			]
		} else {
			return
		}
		this.setState({
			selection,
			selectedObjectData,
		})
	}

	handleClose = () => {
		this.setState({
			showDownloadPdfRequest: false,
			showConfirmForm: false,
			showPatientView: false,
			showAddDevice: false,
			selectedObjectData: [],
			selection: [],
			editedObjectPackage: [],
		})
	}

	handlePatientView = async (values) => {
		const { auth } = this.context
		const objectPackage = {
			userId: auth.user.id,
			record: values.record,
			id: this.state.selectedObjectData.id,
		}
		await apiHelper.record.addPatientRecord({
			objectPackage,
		})
		const callback = () => messageGenerator.setSuccessMessage('save success')
		this.setState(
			{
				showDownloadPdfRequest: false,
				showConfirmForm: false,
				showPatientView: false,
				selection: [],
				selectedObjectData: [],
			},
			callback
		)
	}

	handleClick = () => {
		this.props.highlightSearchPanel(true)
		this.setState({
			showEditObjectForm: true,
			selectedObjectData: this.props.searchResult,
			selection: this.props.searchResult.map((a) => a.mac_address),
			showAddDevice: true,
		})
	}

	render() {
		const { locale } = this.context
		const {
			searchKey,
			highlightSearchPanel,
			searchObjectArray,
			pinColorArray,
			showFoundResult,
			searchResult,
		} = this.props

		const { onSelect } = this

		const { selection } = this.state

		const result = searchResult.filter((item) => {
			// TODO: found value may be 1 or false two types
			// eslint-disable-next-line eqeqeq
			return item.found == showFoundResult
		})

		const title = showFoundResult
			? locale.texts.OBJECTS_FOUND
			: locale.texts.OBJECTS_NOT_FOUND

		const propsGroup = {
			searchResult: result,
			title,

			/** function */
			onSelect,
			highlightSearchPanel,

			/** state */
			selection,

			/** props */
			searchObjectArray,
			pinColorArray,
			searchKey,
		}
		return (
			<Fragment>
				<CustomView condition={isTablet !== true && isMobile !== true}>
					<BrowserSearchResultList {...propsGroup} />
				</CustomView>
				<TabletView>
					<TabletSearchResultList {...propsGroup} />
				</TabletView>
				<MobileOnlyView>
					<MobileSearchResultList {...propsGroup} />
				</MobileOnlyView>
				<ChangeStatusForm
					handleShowPath={this.props.handleShowPath}
					show={this.state.showEditObjectForm}
					title={locale.texts.DEVICE_STATUS}
					selectedObjectData={this.state.selectedObjectData}
					searchKey={searchKey}
					handleChangeObjectStatusFormClose={
						this.handleChangeObjectStatusFormClose
					}
					handleChangeObjectStatusFormSubmit={
						this.handleChangeObjectStatusFormSubmit
					}
					handleAdditionalButton={this.handleAdditionalButton}
					showAddDevice={this.state.showAddDevice}
					handleRemoveButton={this.handleRemoveButton}
				/>

				<PatientViewModal
					show={this.state.showPatientView}
					title="patient record"
					handleClose={this.handleClose}
					handleSubmit={this.handlePatientView}
					data={this.state.selectedObjectData}
				/>

				<ConfirmForm
					show={this.state.showConfirmForm}
					title="thank you for reporting"
					selectedObjectData={this.state.editedObjectPackage}
					handleChangeObjectStatusFormClose={
						this.handleChangeObjectStatusFormClose
					}
					handleConfirmFormSubmit={this.handleConfirmFormSubmit}
					showDownloadPdfRequest={this.state.showDownloadPdfRequest}
				/>

				<DownloadPdfRequestForm
					show={this.state.showDownloadPdfRequest}
					pdfPath={this.state.pdfPath}
					handleClose={this.handleClose}
				/>
			</Fragment>
		)
	}
}

SearchResultList.propTypes = {
	handleShowPath: PropTypes.func.isRequired,
	searchResult: PropTypes.object.isRequired,
	showFoundResult: PropTypes.bool.isRequired,
	searchKey: PropTypes.string.isRequired,
	pinColorArray: PropTypes.array.isRequired,
	searchObjectArray: PropTypes.array.isRequired,
	highlightSearchPanel: PropTypes.func.isRequired,
}

export default SearchResultList
