import React from 'react'
import { keyBy } from 'lodash'
import { AppContext } from '../../context/AppContext'
import {
	Row,
	Col,
	ButtonToolbar,
	Button,
	OverlayTrigger,
	Popover,
} from 'react-bootstrap'
import DeleteConfirmationForm from '../presentational/DeleteConfirmationForm'
import { setSuccessMessage } from '../../helper/messageGenerator'
import apiHelper from '../../helper/apiHelper'
import { ADD, DELETE, SAVE_SUCCESS, DISASSOCIATE } from '../../config/wordMap'
import { formatTime } from '../../helper/utilities'
import config from '../../config'
import BOTSelectTable from '../BOTComponent/BOTSelectTable'
import BOTTable from '../BOTComponent/BOTTable'
import BOTButton from '../BOTComponent/BOTButton'
import BOTObjectFilterBar from '../BOTComponent/BOTObjectFilterBar'
import { SET_TABLE_SELECTION } from '../../reducer/action'
import PropTypes from 'prop-types'

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
		const { objectType = [] } = this.props

		const objectTablePromise = apiHelper.objectApiAgent.getObjectTable({
			areas_id: auth.user.areas_id,
			objectType,
		})
		const areaTablePromise = apiHelper.areaApiAgent.getAreaTable()
		const idleMacPromise = apiHelper.objectApiAgent.getIdleMacaddr()
		const acnPromise = apiHelper.objectApiAgent.getAcnSet()

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
			const typeList = {}
			const areaDataMap = keyBy(areaTableRes.data, 'name')

			const data = objectTableRes.data.rows.map((item) => {
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

				item.area_name = {
					value: item.area_name,
					label:
						areaDataMap[item.area_name] &&
						areaDataMap[item.area_name].readable_name,
					id: item.area_id,
				}

				item.registered_timestamp = formatTime(item.registered_timestamp)

				return item
			})

			const dataMap = keyBy(data, 'id')

			const associatedMacSet = [
				...new Set(
					objectTableRes.data.rows.map((item) => {
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
				res = await apiHelper.objectApiAgent.disassociate({
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

				res = await apiHelper.objectApiAgent.deleteObject({
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
		const res = await apiHelper.objectApiAgent[apiMethod]({
			formOption,
			mode: objectApiMode,
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

	handleDeleteAction = () => {
		const { locale, stateReducer } = this.context
		const [{ tableSelection }] = stateReducer

		let state = {}
		if (tableSelection.length > 0) {
			state = {
				action: DELETE,
				showDeleteConfirmation: true,
				message: locale.texts.ARE_YOU_SURE_TO_DELETE,
			}
		}

		this.setState(state)
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
			EditedForm,
			addText,
			deleteText,
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
						<BOTObjectFilterBar
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
								<BOTButton
									theme={'danger'}
									pressed={tableSelection.length > 0}
									name={DELETE}
									onClick={this.handleDeleteAction}
									text={locale.texts[deleteText]}
								/>
							) : (
								<>
									<OverlayTrigger
										trigger="click"
										key={'left'}
										placement="left"
										overlay={
											<Popover id="popover-basic">
												<Popover.Title as="h3">
													{locale.texts.TIPS}
												</Popover.Title>
												<Popover.Content>
													{locale.texts.TIPS_REPLACE_TAG}
												</Popover.Content>
											</Popover>
										}
									>
										<Button variant="info">{locale.texts.REPLACE_TAG}</Button>
									</OverlayTrigger>
									<BOTButton
										pressed={this.state.isAddButtonPressed}
										name={ADD}
										onClick={this.handleClickButton}
										text={locale.texts[addText]}
									/>
								</>
							)}
							<BOTButton
								enableDebounce={false}
								pressed={this.state.isMultiSelection}
								name={DELETE}
								onClick={this.switchSelectionMode}
								text={
									this.state.isMultiSelection
										? locale.texts.CANCEL
										: locale.texts[deleteText]
								}
							/>
						</ButtonToolbar>
					</Row>
				</Col>
				<hr />
				{this.state.isMultiSelection ? (
					<BOTSelectTable
						data={this.state.filteredData}
						columns={columns}
						style={{ maxHeight: '80vh' }}
					/>
				) : (
					<BOTTable
						data={this.state.filteredData}
						columns={columns}
						style={{ maxHeight: '80vh' }}
						onClickCallback={(selectedRowData) => {
							if (selectedRowData) {
								this.setState({
									isShowEdit: true,
									formTitle: 'edit object',
									isReadOnly: true,
									apiMethod: 'put',
									selectedRowData,
								})
							}
						}}
					/>
				)}

				<EditedForm
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
				/>

				<DeleteConfirmationForm
					show={this.state.showDeleteConfirmation}
					handleClose={this.handleClose}
					message={this.state.message}
					handleSubmit={this.handleSubmitAction}
				/>
			</>
		)
	}
}

ObjectTable.propTypes = {
	objectType: PropTypes.array.isRequired,
	filteredAttribute: PropTypes.array.isRequired,
	enabledSelection: PropTypes.array.isRequired,
	columns: PropTypes.array.isRequired,
	EditedForm: PropTypes.node.isRequired,
	objectApiMode: PropTypes.string.isRequired,
	addText: PropTypes.string.isRequired,
	deleteText: PropTypes.string.isRequired,
}

export default ObjectTable
