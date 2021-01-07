/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        SearchSettings.js

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

import React from 'react'
import _, { debounce } from 'lodash'
import { Row, Col, Button, Form } from 'react-bootstrap'
import Select from 'react-select'
import { AppContext } from '../../../context/AppContext'
import apiHelper from '../../../helper/apiHelper'
import messageGenerator from '../../../helper/messageGenerator'
import BOTSelectTable from '../../BOTComponent/BOTSelectTable'
import BOTTable from '../../BOTComponent/BOTTable'
import BOTButton from '../../BOTComponent/BOTButton'
import config from '../../../config'
import { SET_TABLE_SELECTION } from '../../../reducer/action'
import DualListBox from '../../container/UserContainer/DualListBox'

const pages = {
	CREATE_DEVICE_LIST: 0,
	CREATE_PATIENT_LIST: 1,
	VIEW_LIST: 2,
	REVISE_LIST: 3,
}

const COLUMNS = {
	DEIVCE: [
		{
			Header: 'name',
			accessor: 'name',
			width: 'auto',
		},
		{
			Header: 'type',
			accessor: 'type',
			width: 'auto',
		},
		{
			Header: 'asset_control_number',
			accessor: 'asset_control_number',
			width: 'auto',
		},
	],
	PATIENT: [
		{
			Header: 'name',
			accessor: 'name',
			width: 'auto',
		},
		{
			Header: 'nickname',
			accessor: 'nickname',
			width: 'auto',
		},
		{
			Header: 'asset_control_number',
			accessor: 'asset_control_number',
			width: 'auto',
		},
	],
	NAMED_LIST: [
		{
			Header: 'name',
			accessor: 'name',
			width: 'auto',
		},
		{
			Header: 'type',
			accessor: 'typeString',
			width: 'auto',
		},
	],
}

class SearchSettings extends React.Component {
	static contextType = AppContext

	state = {
		changedIndex: [],
		buttonSelected: pages.REVISE_LIST,
		objectMap: {},
		namedListMap: {},
		allDeviceObjects: [],
		allPatientObjects: [],
		namedListDeviceObjects: [],
		namedListPatientObjects: [],
		namedListData: [],
		listName: '',
		currentNameListRow: null,
		namedListOptions: [],
		selectedNamedList: null,
	}

	componentDidMount = () => {
		this.getObjectData()
	}

	showMessage = debounce(
		() => {
			messageGenerator.setSuccessMessage('save success')
		},
		1500,
		{
			leading: true,
			trailing: false,
		}
	)

	getObjectData = async () => {
		const [{ area }] = this.context.stateReducer

		const objectDataPromise = apiHelper.objectApiAgent.getObjectTable({
			areas_id: [area.id],
			objectType: [config.OBJECT_TYPE.DEVICE, config.OBJECT_TYPE.PERSON],
		})

		const namedListPromise = apiHelper.namedListApiAgent.getNamedList({
			areaId: area.id,
			types: [config.NAMED_LIST_TYPE.DEVICE, config.NAMED_LIST_TYPE.PATIENT],
			isUserDefined: true,
		})

		const [objectRes, namedListRes] = await Promise.all([
			objectDataPromise,
			namedListPromise,
		])

		if (objectRes && namedListRes) {
			let objectIds = []
			const namedListData = namedListRes.data.map((item) => {
				const itemObjectIds = item.objectIds.map((i) => i.object_id)
				objectIds = [...objectIds, ...itemObjectIds]
				item.objectIds = itemObjectIds
				return item
			})

			const namedListOptions = namedListRes.data.map((value) => {
				return {
					label: value.name,
					value,
				}
			})

			const objectMap = _.keyBy(objectRes.data.rows, 'id')
			const namedListMap = _.keyBy(namedListRes.data, 'id')

			let allDeviceObjects = []
			const namedListDeviceObjects = objectRes.data.rows
				.filter((item) => {
					return parseInt(item.object_type) === config.OBJECT_TYPE.DEVICE
				})
				.filter((item) => {
					allDeviceObjects.push(item)
					return !objectIds.includes(item.id)
				})

			let allPatientObjects = []
			const namedListPatientObjects = objectRes.data.rows
				.filter((item) => {
					return parseInt(item.object_type) === config.OBJECT_TYPE.PERSON
				})
				.filter((item) => {
					allPatientObjects.push(item)
					return !objectIds.includes(item.id)
				})

			this.setState({
				namedListOptions,
				objectMap,
				namedListMap,
				namedListData,
				namedListDeviceObjects,
				namedListPatientObjects,
				allDeviceObjects,
				allPatientObjects,
			})
		}
	}

	handleCreateSubmit = async ({ type }) => {
		const [{ area, tableSelection }, dispatch] = this.context.stateReducer

		const res = await apiHelper.namedListApiAgent.setNamedList({
			areaId: area.id,
			name: this.state.listName,
			type,
			isUserDefined: true,
			objectIds: tableSelection,
		})

		if (res) {
			dispatch({
				type: SET_TABLE_SELECTION,
				value: [],
			})

			this.setState({ listName: '' }, () =>
				messageGenerator.setSuccessMessage('save success')
			)
		}
	}

	addObject = async (object) => {
		const { selectedNamedList } = this.state
		const { value } = selectedNamedList

		try {
			await apiHelper.namedListApiAgent.addObject({
				namedListId: value.id,
				objectId: object.id,
			})
			this.getObjectData()
		} catch (e) {
			console.log(`add object to name list failed ${e}`)
		}
	}

	removeObject = async (object) => {
		const { selectedNamedList } = this.state
		const { value } = selectedNamedList

		try {
			await apiHelper.namedListApiAgent.removeObject({
				namedListId: value.id,
				objectId: object.id,
			})
			this.getObjectData()
		} catch (e) {
			console.log(`remove object to name list failed ${e}`)
		}
	}

	removeNamedList = async () => {
		const { selectedNamedList } = this.state
		const { value } = selectedNamedList

		try {
			await apiHelper.namedListApiAgent.removeNamedList({
				namedListId: value.id,
			})
			this.setState({
				selectedNamedList: null,
			})
			this.getObjectData()
		} catch (e) {
			console.log(`remove object to name list failed ${e}`)
		}
	}

	onSelectNamedList = (selectedNamedList) => {
		this.setState({
			selectedNamedList,
		})
	}

	setCurrentPage = (identity) =>
		this.setState({
			changedIndex: [],
			buttonSelected: identity,
		})

	checkButtonIsPressed = (identity) => this.state.buttonSelected === identity

	checkSubmitButtonDisabled = () => this.state.listName === ''

	setListName = (listName) => this.setState({ listName })

	generateObjectTableByNameList = () => {
		const { currentNameListRow, objectMap } = this.state

		const tableData = []
		let objectColumns
		if (currentNameListRow) {
			objectColumns =
				parseInt(currentNameListRow.type) === config.NAMED_LIST_TYPE.DEVICE
					? COLUMNS.DEIVCE
					: parseInt(currentNameListRow.type) === config.NAMED_LIST_TYPE.PATIENT
					? COLUMNS.PATIENT
					: null

			currentNameListRow.objectIds.map((id) => {
				tableData.push(objectMap[id])
			})
		}

		if (objectColumns) {
			return (
				<div style={{ marginTop: '10px' }}>
					<BOTTable data={tableData} columns={objectColumns} />
				</div>
			)
		}
	}

	getNamedListWithLocale = (locale) =>
		this.state.namedListData.map((item) => {
			item.typeString =
				parseInt(item.type) === config.NAMED_LIST_TYPE.DEVICE
					? locale.texts.DEVICE
					: parseInt(item.type) === config.NAMED_LIST_TYPE.PATIENT
					? locale.texts.PATIENT
					: locale.texts.UNKNOWN
			return item
		})

	checkToRenderSubPage = ({ locale }) => {
		const [{ area }] = this.context.stateReducer
		let subPage

		switch (this.state.buttonSelected) {
			case pages.CREATE_DEVICE_LIST:
				subPage = (
					<>
						<div className="color-black mb-2 font-size-120-percent">
							{locale.texts.CREATE_DEVICE_LIST}
						</div>
						<div className="d-flex">
							<Button
								style={{ marginRight: '5px' }}
								disabled={this.checkSubmitButtonDisabled()}
								onClick={() => {
									this.handleCreateSubmit({
										type: config.NAMED_LIST_TYPE.DEVICE,
									})
								}}
							>
								{locale.texts.CREATE}
							</Button>
							<Form.Control
								type="text"
								value={this.state.listName}
								onChange={(e) => {
									this.setListName(e.target.value)
								}}
								placeholder={locale.texts.LIST_NAME}
							/>
						</div>
						<div style={{ marginTop: '10px' }}>
							<BOTSelectTable
								data={this.state.namedListDeviceObjects}
								columns={COLUMNS.DEIVCE}
							/>
						</div>
					</>
				)
				break
			case pages.CREATE_PATIENT_LIST:
				subPage = (
					<>
						<div className="color-black mb-2 font-size-120-percent">
							{locale.texts.CREATE_PATIENT_LIST}
						</div>
						<div className="d-flex">
							<Button
								style={{ marginRight: '5px' }}
								disabled={this.checkSubmitButtonDisabled()}
								onClick={() => {
									this.handleCreateSubmit({
										type: config.NAMED_LIST_TYPE.PATIENT,
									})
								}}
							>
								{locale.texts.CREATE}
							</Button>
							<Form.Control
								type="text"
								value={this.state.listName}
								onChange={(e) => {
									this.setListName(e.target.value)
								}}
								placeholder={locale.texts.LIST_NAME}
							/>
						</div>
						<div style={{ marginTop: '10px' }}>
							<BOTSelectTable
								data={this.state.namedListPatientObjects}
								columns={COLUMNS.PATIENT}
							/>
						</div>
					</>
				)
				break
			case pages.VIEW_LIST:
				subPage = (
					<>
						<div className="color-black mb-2 font-size-120-percent">
							{locale.texts.VIEW_LIST}
						</div>
						<div className="d-flex"></div>
						<div style={{ marginTop: '10px' }}>
							<BOTTable
								data={this.getNamedListWithLocale(locale)}
								columns={COLUMNS.NAMED_LIST}
								onClickCallback={(currentNameListRow) => {
									this.setState({ currentNameListRow })
								}}
								pageSize={6}
							/>
						</div>
						{this.generateObjectTableByNameList()}
					</>
				)
				break
			case pages.REVISE_LIST:
				const {
					namedListMap,
					selectedNamedList,
					allDeviceObjects,
					allPatientObjects,
					namedListOptions,
				} = this.state
				let items = []
				let allItems = []
				let selectedTitle = ''
				let unselectedTitle = ''

				if (selectedNamedList) {
					const namedList = namedListMap[selectedNamedList.value.id]
					if (namedList) {
						items = namedList.objectIds
					}
					if (
						parseInt(selectedNamedList.value.type) ===
						config.NAMED_LIST_TYPE.DEVICE
					) {
						allItems = allDeviceObjects
						selectedTitle = locale.texts.SELECTED_DEVICES
						unselectedTitle = locale.texts.UNSELECTED_DEVICES
					}

					if (
						parseInt(selectedNamedList.value.type) ===
						config.NAMED_LIST_TYPE.PATIENT
					) {
						allItems = allPatientObjects
						selectedTitle = locale.texts.SELECTED_PATIENTS
						unselectedTitle = locale.texts.UNSELECTED_PATIENTS
					}
				}

				subPage = (
					<>
						<div className="color-black mb-2 font-size-120-percent">
							{locale.texts.REVISE_LIST}
						</div>
						<div className="d-flex">
							<Button
								style={{ marginRight: '5px' }}
								disabled={!selectedNamedList}
								onClick={this.removeNamedList}
							>
								{locale.texts.DELETE}
							</Button>
							<Select
								className="flex-grow-1"
								isClearable
								value={selectedNamedList}
								onChange={this.onSelectNamedList}
								options={namedListOptions}
							/>
						</div>
						<DualListBox
							allItems={allItems}
							selectedItemList={items}
							selectedGroupAreaId={area.id}
							selectedTitle={selectedTitle}
							unselectedTitle={unselectedTitle}
							onSelect={this.addObject}
							onUnselect={this.removeObject}
						/>
					</>
				)
				break
			default:
				break
		}

		return subPage
	}

	render() {
		const { locale } = this.context

		const style = {
			rowContainer: {
				marginLeft: '1px',
				marginRight: '1px',
				marginBottom: '5px',
			},
		}

		return (
			<>
				<Row>
					<Col xs={4} lg={3}>
						<Row style={style.rowContainer}>
							<BOTButton
								pressed={this.checkButtonIsPressed(pages.CREATE_DEVICE_LIST)}
								onClick={() => {
									this.setCurrentPage(pages.CREATE_DEVICE_LIST)
								}}
								text={locale.texts.CREATE_DEVICE_LIST}
								block
							/>
						</Row>
						<Row style={style.rowContainer}>
							<BOTButton
								pressed={this.checkButtonIsPressed(pages.CREATE_PATIENT_LIST)}
								onClick={() => {
									this.setCurrentPage(pages.CREATE_PATIENT_LIST)
								}}
								text={locale.texts.CREATE_PATIENT_LIST}
								block
							/>
						</Row>
						<Row style={style.rowContainer}>
							<BOTButton
								pressed={this.checkButtonIsPressed(pages.VIEW_LIST)}
								onClick={() => {
									this.setCurrentPage(pages.VIEW_LIST)
								}}
								text={locale.texts.VIEW_LIST}
								block
							/>
						</Row>
						<Row style={style.rowContainer}>
							<BOTButton
								pressed={this.checkButtonIsPressed(pages.REVISE_LIST)}
								onClick={() => {
									this.setCurrentPage(pages.REVISE_LIST)
								}}
								text={locale.texts.REVISE_LIST}
								block
							/>
						</Row>
					</Col>
					<Col xs={8} lg={9}>
						{this.checkToRenderSubPage({
							locale,
						})}
					</Col>
				</Row>
			</>
		)
	}
}

export default SearchSettings
