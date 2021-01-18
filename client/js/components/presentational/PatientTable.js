/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        PatientTable.js

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
import { keyBy } from 'lodash'
import { Row, Col, ButtonToolbar } from 'react-bootstrap'
import { AppContext } from '../../context/AppContext'
import DeleteConfirmationForm from '../presentational/DeleteConfirmationForm'
import EditPatientForm from '../presentational/form/EditPatientForm'
import { setSuccessMessage } from '../../helper/messageGenerator'
import { patientTableColumn } from '../../config/tables'
import config from '../../config'
import apiHelper from '../../helper/apiHelper'
import { formatTime } from '../../helper/utilities'
import { transferMonitorTypeToString } from '../../helper/dataTransfer'
import {
	ADD,
	UNBIND,
	DELETE,
	PERSON,
	SAVE_SUCCESS,
	DISASSOCIATE,
} from '../../config/wordMap'
import { PrimaryButton } from '../BOTComponent/styleComponent'
import BOTSelectTable from '../BOTComponent/BOTSelectTable'
import BOTObjectFilterBar from '../BOTComponent/BOTObjectFilterBar'
import { SET_TABLE_SELECTION } from '../../reducer/action'

class PatientTable extends React.Component {
	static contextType = AppContext

	state = {
		isShowBind: false,
		isPatientShowEdit: false,
		showDeleteConfirmation: false,
		formPath: '',
		formTitle: '',
		disableASN: false,
		data: [],
		dataMap: {},
		columns: [],
		areaTable: [],
		physicianList: [],
		roomOptions: [],
		objectFilter: [],
		objectTable: [],
		filteredData: [],
		filterSelection: {},
		idleMacaddrSet: [],
		locale: this.context.locale.abbr,
		associatedMacSet: [],
	}

	componentDidMount = () => {
		this.loadData()
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (this.context.locale.abbr !== prevState.locale) {
			this.loadData()
		}
	}

	loadData = async (callback) => {
		const { locale, auth } = this.context

		const objectTablePromise = apiHelper.objectApiAgent.getObjectTable({
			areas_id: auth.user.areas_id,
			objectType: [config.OBJECT_TYPE.PERSON],
		})
		const areaTablePromise = apiHelper.areaApiAgent.getAreaTable()
		const idleMacPromise = apiHelper.objectApiAgent.getIdleMacaddr()

		const [
			patientObjectTableRes,
			areaTableRes,
			idleMacRes,
		] = await Promise.all([
			objectTablePromise,
			areaTablePromise,
			idleMacPromise,
		])

		if (patientObjectTableRes && areaTableRes && idleMacRes) {
			const typeList = {}
			const data = patientObjectTableRes.data.rows.map((item) => {
				item.monitor_type = transferMonitorTypeToString(item, 'object')

				item.status = {
					value: item.status,
					label: item.status ? locale.texts[item.status.toUpperCase()] : null,
				}
				item.transferred_location = item.transferred_location.id && {
					value: `${item.transferred_location.name}-${item.transferred_location.department}`,
					label: `${item.transferred_location.name}-${item.transferred_location.department}`,
				}

				item.isBind = item.mac_address ? 1 : 0
				item.mac_address = item.mac_address
					? item.mac_address
					: locale.texts.NON_BINDING

				if (!Object.keys(typeList).includes(item.type)) {
					typeList[item.type] = {
						value: item.type,
						label: item.type,
					}
				}

				item.monitor_type = transferMonitorTypeToString(item)

				item.area_name = {
					value: item.area_name,
					label: locale.texts[item.area_name],
					id: item.area_id,
				}

				item.registered_timestamp = formatTime(item.registered_timestamp)

				return item
			})

			const dataMap = keyBy(data, 'id')

			const associatedMacSet = [
				...new Set(
					patientObjectTableRes.data.rows.map((item) => {
						return item.mac_address
					})
				),
			]

			const areaSelection = areaTableRes.data.rows.map((area) => {
				return {
					value: area.name,
					label: locale.texts[area.name],
				}
			})

			const idleMacaddrSet = idleMacRes.data.rows[0].mac_set
			const macOptions = idleMacaddrSet.map((mac) => {
				return {
					label: mac,
					value: mac.replace(/:/g, ''),
				}
			})

			this.setState(
				{
					data,
					filteredData: data,
					dataMap,
					isShowEdit: false,
					isShowBind: false,
					showDeleteConfirmation: false,
					disableASN: false,
					objectTable: patientObjectTableRes.data.rows,
					filterSelection: {
						...this.state.filterSelection,
						typeList,
						areaSelection,
					},
					associatedMacSet,
					areaTable: areaTableRes.data.rows,
					areaSelection,
					idleMacaddrSet,
					macOptions,
					locale: locale.abbr,
				},
				callback
			)
		}
	}

	handleClose = () => {
		this.setState({
			isShowBind: false,
			isPatientShowEdit: false,
			showDeleteConfirmation: false,
			disableASN: false,
		})
	}

	objectMultipleDelete = async () => {
		const formOption = []
		const deleteArray = []
		let deleteCount = 0
		let res = null

		switch (this.state.action) {
			case DISASSOCIATE:
				res = await apiHelper.objectApiAgent.disassociate({
					formOption: {
						id: this.state.selectedRowData.id,
					},
				})
				break

			case DELETE:
				this.state.data.forEach((item) => {
					this.state.selection.forEach((itemSelect) => {
						if (itemSelect === item.id) {
							deleteArray.push(deleteCount.toString())
						}
					})
					deleteCount += 1
				})

				deleteArray.forEach((item) => {
					if (this.state.data[item]) {
						formOption.push({
							id: this.state.data[item].id,
							mac_address: this.state.data[item].isBind
								? this.state.data[item].mac_address
								: null,
						})
					}
				})

				res = await apiHelper.objectApiAgent.deleteObject({
					formOption,
				})

				break
		}

		if (res) {
			this.getData(() => setSuccessMessage(SAVE_SUCCESS))
		}
	}

	handleSubmitForm = async (formOption) => {
		const { apiMethod } = this.state
		const res = await apiHelper.objectApiAgent[apiMethod]({
			formOption,
			mode: PERSON,
		})
		if (res) {
			this.getData(() => setSuccessMessage(SAVE_SUCCESS))
		}
	}

	handleClickButton = (e) => {
		const { name } = e.target
		const { locale } = this.context

		switch (name) {
			case ADD:
				this.setState({
					isPatientShowEdit: true,
					formTitle: name,
					selectedRowData: [],
					disableASN: false,
					apiMethod: 'post',
				})
				break
			case UNBIND:
				this.setState({
					isShowBind: true,
					apiMethod: 'post',
				})
				break
			case DELETE:
				this.setState({
					showDeleteConfirmation: true,
					action: DELETE,
					message: locale.texts.ARE_YOU_SURE_TO_DELETE,
				})
				break

			case DISASSOCIATE:
				this.setState({
					showDeleteConfirmation: true,
					action: DISASSOCIATE,
					message: locale.texts.ARE_YOU_SURE_TO_DISASSOCIATE,
				})
				break
		}
	}

	render() {
		const { locale, stateReducer } = this.context
		const [{ tableSelection = [] }, dispatch] = stateReducer
		const { dataMap } = this.state
		const selectedData = dataMap[tableSelection[0]]

		return (
			<>
				<Col>
					<Row className="d-flex justify-content-between">
						<BOTObjectFilterBar
							onFilterUpdated={({ objectFilter, filteredData }) => {
								this.setState({
									objectFilter,
									filteredData,
								})
								dispatch({
									type: SET_TABLE_SELECTION,
									value: [],
								})
							}}
							oldObjectFilter={this.state.objectFilter}
							objectList={this.state.data}
							selectionList={[
								{
									label: locale.texts.SEARCH,
									attribute: [
										'name',
										'area',
										'macAddress',
										'acn',
										'sex',
										'monitor_type',
									],
									source: 'search bar',
								},
								{
									label: locale.texts.AREA,
									options: this.state.filterSelection.areaSelection,
									attribute: ['area'],
									source: 'area select',
								},
							]}
						/>
						<ButtonToolbar>
							<PrimaryButton name={ADD} onClick={this.handleClickButton}>
								{locale.texts.ADD_PATIENT}
							</PrimaryButton>
							<PrimaryButton name={DELETE} onClick={this.handleClickButton}>
								{locale.texts.DELETE_PATIENT}
							</PrimaryButton>
						</ButtonToolbar>
					</Row>
				</Col>
				<hr />
				<BOTSelectTable
					data={this.state.filteredData}
					columns={patientTableColumn}
					style={{ maxHeight: '80vh' }}
					onClickCallback={() => {
						this.setState({
							isPatientShowEdit: true,
							formTitle: 'edit info',
							disableASN: true,
							apiMethod: 'put',
						})
					}}
				/>
				<EditPatientForm
					show={this.state.isPatientShowEdit}
					title={this.state.formTitle}
					selectedRowData={selectedData}
					handleSubmit={this.handleSubmitForm}
					handleClick={this.handleClickButton}
					formPath={this.state.formPath}
					handleClose={this.handleClose}
					data={this.state.data}
					objectTable={this.state.objectTable}
					physicianList={this.state.physicianList}
					roomOptions={this.state.roomOptions}
					disableASN={this.state.disableASN}
					areaTable={this.state.areaTable}
					macOptions={this.state.macOptions}
				/>
				<DeleteConfirmationForm
					show={this.state.showDeleteConfirmation}
					handleClose={this.handleClose}
					message={this.state.message}
					handleSubmit={this.objectMultipleDelete}
				/>
			</>
		)
	}
}
export default PatientTable
