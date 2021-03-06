import React from 'react'
import { debounce, keyBy } from 'lodash'
import { Row, Col, Form } from 'react-bootstrap'
import Select from '../components/Select'
import { AppContext } from '../context/AppContext'
import API from '../api'
import { setSuccessMessage } from '../helper/messageGenerator'
import SelectTable from '../components/SelectTable'
import Table from '../components/Table'
import Button from '../components/Button'
import config from '../config'
import { SET_TABLE_SELECTION } from '../reducer/action'
import DualListBox from './DualListBox'

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
		buttonSelected: null,
		objectMap: {},
		namedListMap: {},
		allDeviceObjects: [],
		allPatientObjects: [],
		namedListDeviceObjects: [],
		namedListPatientObjects: [],
		namedListData: [],
		listName: '',
		currentNamedListRow: null,
		namedListOptions: [],
		selectedNamedList: null,
	}

	componentDidMount = () => {
		this.getObjectData()
	}

	showMessage = debounce(
		() => {
			setSuccessMessage('save success')
		},
		1500,
		{
			leading: true,
			trailing: false,
		}
	)

	getObjectData = async (callback) => {
		const [{ area }, dispatch] = this.context.stateReducer

		const objectDataPromise = API.Object.getObjectList({
			areaIds: [area.id],
			objectTypes: [config.OBJECT_TYPE.DEVICE, config.OBJECT_TYPE.PERSON],
		})

		const namedListPromise = API.NamedList.getNamedList({
			areaIds: [area.id],
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

			const objectMap = keyBy(objectRes.data, 'id')
			const namedListMap = keyBy(namedListRes.data, 'id')

			const allDeviceObjects = []
			const namedListDeviceObjects = objectRes.data
				.filter((item) => {
					return parseInt(item.object_type) === config.OBJECT_TYPE.DEVICE
				})
				.filter((item) => {
					allDeviceObjects.push(item)
					return !objectIds.includes(item.id)
				})

			const allPatientObjects = []
			const namedListPatientObjects = objectRes.data
				.filter((item) => {
					return parseInt(item.object_type) === config.OBJECT_TYPE.PERSON
				})
				.filter((item) => {
					allPatientObjects.push(item)
					return !objectIds.includes(item.id)
				})

			dispatch({
				type: SET_TABLE_SELECTION,
				value: [],
			})

			const state = {
				namedListOptions,
				objectMap,
				namedListMap,
				namedListData,
				namedListDeviceObjects,
				namedListPatientObjects,
				allDeviceObjects,
				allPatientObjects,
				listName: '',
			}

			if (callback) {
				this.setState(state, callback)
			} else {
				this.setState(state)
			}
		}
	}

	handleCreateSubmit = async ({ type }) => {
		const [{ area, tableSelection }] = this.context.stateReducer

		const res = await API.NamedList.setNamedList({
			areaId: area.id,
			name: this.state.listName,
			type,
			isUserDefined: true,
			objectIds: tableSelection,
		})

		if (res) {
			this.getObjectData(() => setSuccessMessage('save success'))
		}
	}

	addObject = async (object) => {
		const { selectedNamedList } = this.state
		const { value } = selectedNamedList

		const res = await API.NamedList.addObject({
			namedListId: value.id,
			objectId: object.id,
		})

		if (res) {
			this.getObjectData(() => setSuccessMessage('save success'))
		}
	}

	removeObject = async (object) => {
		const { selectedNamedList } = this.state
		const { value } = selectedNamedList

		const res = await API.NamedList.removeObject({
			namedListId: value.id,
			objectId: object.id,
		})

		if (res) {
			this.getObjectData(() => setSuccessMessage('save success'))
		}
	}

	removeNamedList = async () => {
		const { selectedNamedList } = this.state
		const { value } = selectedNamedList

		const res = await API.NamedList.removeNamedList({
			namedListId: value.id,
		})

		if (res) {
			this.getObjectData(() => setSuccessMessage('save success'))
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
			currentNamedListRow: null,
			selectedNamedList: null,
			buttonSelected: identity,
		})

	checkButtonIsPressed = (identity) => this.state.buttonSelected === identity

	checkSubmitButtonDisabled = () => this.state.listName === ''

	setListName = (listName) => this.setState({ listName })

	generateObjectTableByNamedList = () => {
		const { currentNamedListRow, objectMap } = this.state

		const tableData = []
		let objectColumns
		if (currentNamedListRow) {
			objectColumns =
				parseInt(currentNamedListRow.type) === config.NAMED_LIST_TYPE.DEVICE
					? COLUMNS.DEIVCE
					: parseInt(currentNamedListRow.type) ===
					  config.NAMED_LIST_TYPE.PATIENT
					? COLUMNS.PATIENT
					: null

			currentNamedListRow.objectIds.forEach((id) => {
				tableData.push(objectMap[id])
			})
		}

		if (objectColumns) {
			return (
				<div style={{ marginTop: '10px' }}>
					<Table data={tableData} columns={objectColumns} />
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
		const {
			buttonSelected,
			listName,
			namedListDeviceObjects,
			namedListPatientObjects,
		} = this.state
		let subPage

		switch (buttonSelected) {
			case pages.CREATE_DEVICE_LIST:
				subPage = (
					<>
						<div className="color-black mb-2 font-size-120-percent">
							{locale.texts.CREATE_DEVICE_LIST}
						</div>
						<div className="d-flex">
							<Button
								key={pages.CREATE_DEVICE_LIST}
								style={{ marginRight: '5px' }}
								disabled={this.checkSubmitButtonDisabled()}
								onClick={() => {
									this.handleCreateSubmit({
										type: config.NAMED_LIST_TYPE.DEVICE,
									})
								}}
								text={locale.texts.CREATE}
							/>
							<Form.Control
								type="text"
								value={listName}
								onChange={(e) => {
									this.setListName(e.target.value)
								}}
								placeholder={locale.texts.LIST_NAME}
							/>
						</div>
						<div style={{ marginTop: '10px' }}>
							<SelectTable
								data={namedListDeviceObjects}
								columns={COLUMNS.DEIVCE}
								pageSize={25}
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
								key={pages.CREATE_PATIENT_LIST}
								style={{ marginRight: '5px' }}
								disabled={this.checkSubmitButtonDisabled()}
								onClick={() => {
									this.handleCreateSubmit({
										type: config.NAMED_LIST_TYPE.PATIENT,
									})
								}}
								text={locale.texts.CREATE}
							/>
							<Form.Control
								type="text"
								value={listName}
								onChange={(e) => {
									this.setListName(e.target.value)
								}}
								placeholder={locale.texts.LIST_NAME}
							/>
						</div>
						<div style={{ marginTop: '10px' }}>
							<SelectTable
								data={namedListPatientObjects}
								columns={COLUMNS.PATIENT}
								pageSize={25}
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
							<Table
								data={this.getNamedListWithLocale(locale)}
								columns={COLUMNS.NAMED_LIST}
								onClickCallback={(currentNamedListRow) => {
									this.setState({ currentNamedListRow })
								}}
								pageSize={6}
							/>
						</div>
						{this.generateObjectTableByNamedList()}
					</>
				)
				break
			case pages.REVISE_LIST:
				subPage = this.generateReviseList({ locale })
				break
			default:
				break
		}

		return subPage
	}

	generateReviseList = ({ locale }) => {
		const [{ area }] = this.context.stateReducer
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
				parseInt(selectedNamedList.value.type) === config.NAMED_LIST_TYPE.DEVICE
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

		return (
			<>
				<div className="color-black mb-2 font-size-120-percent">
					{locale.texts.REVISE_LIST}
				</div>
				<div className="d-flex">
					<Button
						style={{ marginRight: '5px' }}
						disabled={!selectedNamedList}
						onClick={this.removeNamedList}
						text={locale.texts.DELETE}
					/>
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
							<Button
								pressed={this.checkButtonIsPressed(pages.CREATE_DEVICE_LIST)}
								onClick={() => {
									this.setCurrentPage(pages.CREATE_DEVICE_LIST)
								}}
								text={locale.texts.CREATE_DEVICE_LIST}
								block
							/>
						</Row>
						<Row style={style.rowContainer}>
							<Button
								pressed={this.checkButtonIsPressed(pages.CREATE_PATIENT_LIST)}
								onClick={() => {
									this.setCurrentPage(pages.CREATE_PATIENT_LIST)
								}}
								text={locale.texts.CREATE_PATIENT_LIST}
								block
							/>
						</Row>
						<Row style={style.rowContainer}>
							<Button
								pressed={this.checkButtonIsPressed(pages.VIEW_LIST)}
								onClick={() => {
									this.setCurrentPage(pages.VIEW_LIST)
								}}
								text={locale.texts.VIEW_LIST}
								block
							/>
						</Row>
						<Row style={style.rowContainer}>
							<Button
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
