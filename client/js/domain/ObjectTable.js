import React from 'react'
import { keyBy } from 'lodash'
import { AppContext } from '../context/AppContext'
import { Row, Col, ButtonToolbar, Modal } from 'react-bootstrap'
import DeleteConfirmationForm from './DeleteConfirmationForm'
import { setSuccessMessage } from '../helper/messageGenerator'
import API from '../api'
import { ADD, DELETE, SAVE_SUCCESS, DISASSOCIATE } from '../config/wordMap'
import { formatTime, isSameValue } from '../helper/utilities'
import config from '../config'
import SelectTable from '../components/SelectTable'
import Table from '../components/Table'
import Button from '../components/Button'
import ObjectFilterBar from '../components/ObjectFilterBar'
import { SET_TABLE_SELECTION } from '../reducer/action'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'
import EditForm from './EditForm'
export const SELECTION = {
	TYPE: 'type',
	AREA: 'area',
	STATUS: 'status',
}
class ObjectTable extends React.Component {
	static contextType = AppContext

	state = {
		locale: this.context.locale.abbr,
		isShowEdit: false,
		showDeleteConfirmation: false,
		selectedRowData: {},
		formTitle: '',
		isReadOnly: false,
		data: [],
		dataMap: {},
		areaTable: [],
		objectFilter: [],
		filteredData: [],
		filterSelection: {},
		apiMethod: '',
		idleMacaddrSet: [],
		associatedMacSet: [],
		associatedAsnSet: [],
		isAddButtonPressed: false,
		isMultiSelection: false,
		isReplaceTagMode: false,
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

		const {
			objectTypes = [],
			objectSubTypes = [],
		} = this.props

		let{
			typeOptions = undefined
		} = this.props
		const objectTablePromise = API.Object.getObjectList({
			areaIds: auth.user.area_ids,
			objectTypes,
		})
		const areaTablePromise = API.Area.getAreaTable()
		const idleMacPromise = API.Object.getIdleMacaddr()
		const acnPromise = API.Object.getAcnSet()

		const [
			objectTableRes,
			areaTableRes,
			idleMacRes,
			acnRes,
		] = await Promise.all([
			objectTablePromise,
			areaTablePromise,
			idleMacPromise,
			acnPromise,
		])

		if (objectTableRes && areaTableRes && idleMacRes && acnRes) {
			const typeList = []
			const areaDataMap = keyBy(areaTableRes.data, 'name')
			const data = objectTableRes.data
				.filter((item) => {
					const isPersonObject = isSameValue(
						item.object_type,
						config.OBJECT_TYPE.PERSON
					)
					if (isPersonObject) {
						return objectSubTypes.includes(item.type)
					}
					return true
				})
				.map((item) => {
					item.status = {
						value: item.status,
						label: item.status ? locale.texts[item.status.toUpperCase()] : null,
					}

					item.transferred_location = item.transferred_location &&
						item.transferred_location.id && {
							value: `${item.transferred_location.name}-${item.transferred_location.department}`,
							label: `${item.transferred_location.name}-${item.transferred_location.department}`,
						}

					item.isBind = item.mac_address ? 1 : 0

					item.mac_address = item.mac_address
						? item.mac_address
						: locale.texts.NON_BINDING

					if (!typeList.some((type) => type.value === item.type)) {
						typeList.push({ value: item.type, label: item.type })
					}

					const isInTheTimePeriod =
						moment().diff(item.last_reported_timestamp, 'seconds') <
						process.env.OBJECT_FOUND_TIME_INTERVAL_IN_SEC

					/** Set the boolean if its rssi is below the specific rssi threshold  */
					const isMatchRssi = item.rssi > process.env.RSSI_THRESHOLD ? 1 : 0

					/** Flag the object that satisfied the time period and rssi threshold */
					item.found = isInTheTimePeriod && isMatchRssi

					item.area_name = {
						value: item.area_name,
						label:
							areaDataMap[item.area_name] &&
							areaDataMap[item.area_name].readable_name,
						id: item.area_id,
					}

					if (
						item.battery_voltage >
						parseInt(process.env.BATTERY_VOLTAGE_INDICATOR)
					) {
						item.battery_indicator = 3
					} else if (
						item.battery_voltage <=
							parseInt(process.env.BATTERY_VOLTAGE_INDICATOR) &&
						item.battery_voltage > 16
					) {
						item.battery_indicator = 2
					} else if (item.battery_voltage <= 16) {
						item.battery_indicator = 1
					}

					item.registered_timestamp = formatTime(item.registered_timestamp)

					const isPersonObject = isSameValue(
						item.object_type,
						config.OBJECT_TYPE.PERSON
					)
					if (isPersonObject) {
						item.subTypeName = locale.texts[item.type.toUpperCase()]
					}

					return item
				})

			const dataMap = keyBy(data, 'id')

			typeOptions = typeOptions || typeList

			const associatedMacSet = [
				...new Set(
					objectTableRes.data.map((item) => {
						return `${item.mac_address}`.toUpperCase()
					})
				),
			]

			const associatedAsnSet = [
				...new Set(
					acnRes.data.map((item) => {
						return `${item.asset_control_number}`.toUpperCase()
					})
				),
			]

			const areaSelection = areaTableRes.data.map((area) => {
				return {
					value: area.name,
					label: area.readable_name,
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
					filterSelection: {
						...this.state.filterSelection,
						typeList,
						areaSelection,
					},
					typeOptions,
					associatedMacSet,
					areaTable: areaTableRes.data,
					areaSelection,
					idleMacaddrSet,
					associatedAsnSet,
					macOptions,
					locale: locale.abbr,
					isShowEdit: false,
					showDeleteConfirmation: false,
					isReadOnly: false,
					isAddButtonPressed: false,
				},
				callback
			)

			this.clearSelection()
		}
	}

	handleClose = () => {
		this.setState({
			isShowEdit: false,
			showDeleteConfirmation: false,
			isReadOnly: false,
			isAddButtonPressed: false,
			selectedRowData: {},
		})

		this.clearSelection()
	}

	handleSubmitAction = async () => {
		const [{ tableSelection }] = this.context.stateReducer
		const { dataMap, selectedRowData } = this.state
		const formOption = []
		let res = null

		switch (this.state.action) {
			case DISASSOCIATE:
				res = await API.Object.disassociate({
					formOption: {
						id: selectedRowData.id,
					},
				})
				break

			case DELETE:
				tableSelection.forEach((id) => {
					formOption.push({
						id,
						mac_address: dataMap[id].isBind ? dataMap[id].mac_address : null,
					})
				})

				res = await API.Object.deleteObject({
					formOption,
				})
				break
		}

		if (res) {
			this.loadData(() => setSuccessMessage(SAVE_SUCCESS))
		}
	}

	handleSubmitForm = async (formOption) => {
		const { apiMethod } = this.state
		const { objectApiMode } = this.props
		const res = await API.Object[apiMethod]({
			formOption,
			mode: objectApiMode || formOption.object_type,
		})
		if (res) {
			this.loadData(() => setSuccessMessage(SAVE_SUCCESS))
		}
	}

	handleClickButton = (e) => {
		const { name } = e.target
		const { locale } = this.context

		switch (name) {
			case ADD:
				this.setState({
					isReplaceTagMode: false,
					isShowEdit: true,
					formTitle: name,
					isReadOnly: false,
					apiMethod: 'post',
					isAddButtonPressed: true,
				})
				break

			case DISASSOCIATE:
				this.setState({
					showDeleteConfirmation: true,
					action: DISASSOCIATE,
					message: locale.texts.ARE_YOU_SURE_TO_DISASSOCIATE,
					isAddButtonPressed: true,
				})
				break
		}
	}

	switchSelectionMode = () => {
		const [, dispatch] = this.context.stateReducer
		const { isMultiSelection } = this.state
		this.setState({
			isMultiSelection: !isMultiSelection,
		})
		dispatch({
			type: SET_TABLE_SELECTION,
			value: [],
		})
	}

	switchReplaceTagMode = () => {
		this.setState({ isReplaceTagMode: !this.state.isReplaceTagMode })
	}

	handleDeleteAction = () => {
		const { locale, stateReducer } = this.context
		const [{ tableSelection }] = stateReducer

		if (tableSelection.length > 0) {
			this.setState({
				action: DELETE,
				showDeleteConfirmation: true,
				message: locale.texts.ARE_YOU_SURE_TO_DELETE,
			})
		}
	}

	clearSelection = () => {
		const [, dispatch] = this.context.stateReducer
		dispatch({
			type: SET_TABLE_SELECTION,
			value: [],
		})
	}

	render() {
		const {
			filteredAttribute = [],
			enabledSelection = [],
			columns = [],
			addText,
			deleteText,
			addButtonVisible = true,
			deleteButtonVisible = true,
		} = this.props
		const { locale, stateReducer } = this.context
		const [{ tableSelection }] = stateReducer

		const typeOptions = this.state.filterSelection.typeList
			? Object.values(this.state.filterSelection.typeList)
			: null

		const statusOptions = config.statusOptions.map((status) => {
			return {
				value: status,
				label: locale.texts[status.toUpperCase().replace(/ /g, '_')],
			}
		})

		const selectionMap = {}
		selectionMap[SELECTION.TYPE] = {
			label: locale.texts.TYPE,
			options: typeOptions,
			attribute: ['type'],
			source: 'type select',
		}
		selectionMap[SELECTION.AREA] = {
			label: locale.texts.AREA,
			options: this.state.filterSelection.areaSelection,
			attribute: ['area'],
			source: 'area select',
		}
		selectionMap[SELECTION.STATUS] = {
			label: locale.texts.STATUS,
			options: statusOptions,
			attribute: ['status'],
			source: 'status select',
		}

		const enabledSelectionList = enabledSelection.map(
			(selection) => selectionMap[selection]
		)

		return (
			<>
				<Col>
					<Row className="d-flex justify-content-between">
						<ObjectFilterBar
							onFilterUpdated={({ objectFilter, filteredData }) => {
								this.setState({
									objectFilter,
									filteredData,
								})
								this.clearSelection()
							}}
							oldObjectFilter={this.state.objectFilter}
							objectList={this.state.data}
							selectionList={[
								{
									label: locale.texts.SEARCH,
									attribute: filteredAttribute,
									source: 'search bar',
								},
								...enabledSelectionList,
							]}
						/>
						<ButtonToolbar>
							{this.state.isMultiSelection ? (
								<>
									<Button
										theme={'danger'}
										disableDebounce={true}
										pressed={tableSelection.length > 0}
										name={DELETE}
										onClick={this.handleDeleteAction}
										text={locale.texts[deleteText]}
									/>
									<Button
										disableDebounce={true}
										pressed={true}
										name={DELETE}
										onClick={this.switchSelectionMode}
										text={locale.texts.CANCEL}
									/>
								</>
							) : (
								<>
									<Button
										pressed={true}
										onClick={this.switchReplaceTagMode}
										text={locale.texts.REPLACE_TAG}
									/>
									{addButtonVisible ? (
										<Button
											pressed={this.state.isAddButtonPressed}
											name={ADD}
											onClick={this.handleClickButton}
											text={locale.texts[addText]}
										/>
									) : null}
									{deleteButtonVisible ? (
										<Button
											disableDebounce={true}
											pressed={this.state.isMultiSelection}
											name={DELETE}
											onClick={this.switchSelectionMode}
											text={locale.texts[deleteText]}
										/>
									) : null}
								</>
							)}
						</ButtonToolbar>
					</Row>
				</Col>
				<hr />

				{this.state.isMultiSelection ? (
					<SelectTable
						data={this.state.filteredData}
						columns={columns}
						style={{ maxHeight: '80vh' }}
					/>
				) : (
					<Col
						style={{
							margin: '0px',
							padding: '0px',
							border: '0px',
							backgroundColor: 'white',
							zIndex: this.state.isReplaceTagMode ? 1060 : 0,
						}}
					>
						<Table
							data={this.state.filteredData}
							columns={columns}
							style={{
								maxHeight: '80vh',
							}}
							onClickCallback={(selectedRowData) => {
								if (selectedRowData) {
									this.setState({
										isReplaceTagMode: false,
										isShowEdit: true,
										formTitle: 'edit object',
										isReadOnly: true,
										apiMethod: 'put',
										selectedRowData,
									})
								}
							}}
						/>
					</Col>
				)}

				<EditForm
					show={this.state.isShowEdit}
					title={this.state.formTitle}
					selectedRowData={this.state.selectedRowData}
					handleClick={this.handleClickButton}
					handleSubmit={this.handleSubmitForm}
					handleClose={this.handleClose}
					isReadOnly={this.state.isReadOnly}
					areaTable={this.state.areaTable}
					associatedMacSet={this.state.associatedMacSet}
					associatedAsnSet={this.state.associatedAsnSet}
					macOptions={this.state.macOptions}
					typeOptions={this.state.typeOptions}
					typeOption={this.props.typeOption}
				/>

				<DeleteConfirmationForm
					show={this.state.showDeleteConfirmation}
					handleClose={this.handleClose}
					message={this.state.message}
					handleSubmit={this.handleSubmitAction}
				/>

				<Modal
					show={this.state.isReplaceTagMode}
					onHide={this.switchReplaceTagMode}
				/>
			</>
		)
	}
}

ObjectTable.propTypes = {
	objectTypes: PropTypes.array.isRequired,
	objectSubTypes: PropTypes.number,
	filteredAttribute: PropTypes.array.isRequired,
	buttonAttribute: PropTypes.array.isRequired,
	enabledSelection: PropTypes.array.isRequired,
	columns: PropTypes.array.isRequired,
	EditedForm: PropTypes.node.isRequired,
	objectApiMode: PropTypes.string,
	addText: PropTypes.string,
	deleteText: PropTypes.string,
	typeOption: PropTypes.string,
	addButtonVisible: PropTypes.bool,
	deleteButtonVisible: PropTypes.bool,
	typeOptions: PropTypes.array
}

export default ObjectTable
