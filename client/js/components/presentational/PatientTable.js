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
import { AppContext } from '../../context/AppContext'
import ReactTable from 'react-table'
import styleConfig from '../../config/styleConfig'
import selecTableHOC from 'react-table/lib/hoc/selectTable'
import BindForm from '../presentational/form/BindForm'
import DeleteConfirmationForm from '../presentational/DeleteConfirmationForm'
import moment from 'moment'
import EditPatientForm from '../presentational/form/EditPatientForm'
import messageGenerator from '../../helper/messageGenerator'
import { patientTableColumn } from '../../config/tables'
import config from '../../config'
import apiHelper from '../../helper/apiHelper'
import {
	JSONClone,
	formatTime,
	compareString,
	includes,
	filterByField,
} from '../../helper/utilities'
import {
	MobileOnlyView,
	TabletView,
	CustomView,
	isMobile,
	isTablet,
} from 'react-device-detect'
import BrowserObjectTableView from '../platform/browser/BrowserObjectTableView'
import TabletObjectTableView from '../platform/tablet/TableObjectTableView'
import MobileObjectTableView from '../platform/mobile/MobileObjectTableView'
import { transferMonitorTypeToString } from '../../helper/dataTransfer'
import {
	ADD,
	BIND,
	UNBIND,
	DELETE,
	PERSON,
	SAVE_SUCCESS,
	DISASSOCIATE,
	SEARCH_BAR,
} from '../../config/wordMap'

const SelectTable = selecTableHOC(ReactTable)

class PatientTable extends React.Component {
	static contextType = AppContext

	state = {
		isShowBind: false,
		isPatientShowEdit: false,
		showDeleteConfirmation: false,
		selectedRowData: '',
		selectAll: false,
		selection: [],
		formPath: '',
		formTitle: '',
		disableASN: false,
		done: false,
		data: [],
		columns: [],
		areaTable: [],
		physicianList: [],
		roomOptions: [],
		objectFilter: [],
		objectTable: [],
		importData: [],
		filteredData: [],
		filterSelection: {},
		locale: this.context.locale.abbr,
	}

	componentDidMount = () => {
		this.getData()
		this.getAreaTable()
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (this.context.locale.abbr !== prevState.locale) {
			this.getRefresh()
			this.setState({
				locale: this.context.locale.abbr,
			})
		}
	}

	getRefresh = () => {
		this.getAreaTable()
		const columns = JSONClone(patientTableColumn)
		const { locale } = this.context

		columns.forEach((field) => {
			field.Header = this.context.locale.texts[
				field.Header.toUpperCase().replace(/ /g, '_')
			]
		})

		this.state.data.forEach((item) => {
			item.area_name.label = locale.texts[item.area_name.value]
			// item.object_type.label =
			// 	locale.texts[item.object_type.value.toUpperCase()]
			item.registered_timestamp = moment(item.registered_timestamp._i)
				.locale(this.context.locale.abbr)
				.format('lll')
			if (!item.area_name.label) {
				item.area_name.label = '*site module error*'
			}
		})

		this.state.filteredData.forEach((item) => {
			item.area_name.label = locale.texts[item.area_name.value]
			// item.object_type.label =
			// 	locale.texts[item.object_type.value.toUpperCase()]
			item.registered_timestamp = moment(item.registered_timestamp._i)
				.locale(this.context.locale.abbr)
				.format('lll')
			if (!item.area_name.label) {
				item.area_name.label = '*site module error*'
			}
		})

		this.setState({
			columns,
			locale: this.context.locale.abbr,
		})
	}

	getData = async (callback) => {
		const { locale, auth } = this.context

		const res = await apiHelper.objectApiAgent.getObjectTable({
			areas_id: auth.user.areas_id,
			objectType: [config.OBJECT_TYPE.PERSON],
		})

		if (res) {
			const columns = JSONClone(patientTableColumn)

			columns.forEach((field) => {
				field.Header =
					locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
			})

			const data = res.data.rows.map((item) => {
				item.area_name = {
					value: item.area_name,
					label: locale.texts[item.area_name] || '*site module error*',
					id: item.area_id,
				}
				item.monitor_type = transferMonitorTypeToString(item)
				item.isBind = item.mac_address ? 1 : 0
				item.mac_address = item.mac_address
					? item.mac_address
					: locale.texts.NON_BINDING

				item.registered_timestamp = formatTime(item.registered_timestamp)

				return item
			})

			this.getIdleMacaddrSet()
			this.setState(
				{
					data,
					isShowEdit: false,
					isShowBind: false,
					showDeleteConfirmation: false,
					isPatientShowEdit: false,
					disableASN: false,
					columns,
					objectTable: res.data.rows,
					locale: locale.abbr,
					filteredData: data,
				},
				callback
			)
		}
	}

	getIdleMacaddrSet = async () => {
		const res = await apiHelper.objectApiAgent.getIdleMacaddr()
		if (res) {
			const idleMacaddrSet = res.data.rows[0].mac_set
			const macOptions = idleMacaddrSet.map((mac) => {
				return {
					label: mac,
					value: mac.replace(/:/g, ''),
				}
			})
			this.setState({
				idleMacaddrSet,
				macOptions,
			})
		}
	}

	getAreaTable = async () => {
		const { locale } = this.context
		const res = await apiHelper.areaApiAgent.getAreaTable()
		if (res) {
			const areaSelection = res.data.rows.map((area) => {
				return {
					value: area.name,
					label: locale.texts[area.name],
				}
			})
			this.setState({
				areaTable: res.data.rows,
				areaSelection,
				filterSelection: {
					...this.state.filterSelection,
					areaSelection,
				},
			})
		}
	}

	handleClose = () => {
		this.setState({
			isShowBind: false,
			isPatientShowEdit: false,
			showDeleteConfirmation: false,
			selectedRowData: '',
			disableASN: false,
		})
	}

	handleSubmitForm = async (formOption) => {
		const { apiMethod } = this.state

		await apiHelper.objectApiAgent[apiMethod]({
			formOption,
			mode: PERSON,
		})
		const callback = () => {
			messageGenerator.setSuccessMessage(SAVE_SUCCESS)
		}
		this.getData(callback)
	}

	toggleSelection = (key) => {
		let selection = [...this.state.selection]
		key = key.split('-')[1] ? key.split('-')[1] : key
		const keyIndex = selection.indexOf(key)
		if (keyIndex >= 0) {
			selection = [
				...selection.slice(0, keyIndex),
				...selection.slice(keyIndex + 1),
			]
		} else {
			selection.push(key)
		}
		this.setState({
			selection,
		})
	}

	toggleAll = () => {
		const selectAll = !this.state.selectAll
		let selection = []
		let rowsCount = 0
		if (selectAll) {
			const wrappedInstance = this.selectTable.getWrappedInstance()
			const currentRecords = wrappedInstance.getResolvedState().sortedData
			currentRecords.forEach((item) => {
				rowsCount++
				if (
					rowsCount >
						wrappedInstance.state.pageSize * wrappedInstance.state.page &&
					rowsCount <=
						wrappedInstance.state.pageSize +
							wrappedInstance.state.pageSize * wrappedInstance.state.page
				) {
					selection.push(item._original.id)
				}
			})
		} else {
			selection = []
		}
		this.setState({ selectAll, selection })
	}

	isSelected = (key) => {
		return this.state.selection.includes(key)
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
					bindCase: 1,
					apiMethod: 'post',
				})
				break
			case DELETE:
				this.setState({
					showDeleteConfirmation: true,
					warningSelect: 1,
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

				this.setState({ selectAll: false })

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

				this.setState({ selectAll: false, selection: [] })

				break
		}

		if (res) {
			const callback = () => {
				messageGenerator.setSuccessMessage(SAVE_SUCCESS)
			}
			this.getData(callback)
		}
	}

	addObjectFilter = (key, attribute, source) => {
		const objectFilter = this.state.objectFilter.filter(
			(filter) => source !== filter.source
		)

		objectFilter.push({
			key,
			attribute,
			source,
		})

		this.filterObjects(objectFilter)
	}

	removeObjectFilter = (source) => {
		const objectFilter = this.state.objectFilter.filter(
			(filter) => source !== filter.source
		)

		this.filterObjects(objectFilter)
	}

	filterObjects = (objectFilter) => {
		const filteredData = objectFilter.reduce((acc, curr) => {
			let callback
			if (curr.source === SEARCH_BAR) {
				callback = includes
			} else {
				callback = compareString
			}
			return filterByField(callback, acc, curr.key, curr.attribute)
		}, this.state.data)

		this.setState({
			objectFilter,
			filteredData,
		})
	}

	render() {
		const {
			selectedRowData,
			selectAll,
			selectType,
			filterSelection,
			selection,
		} = this.state

		const {
			toggleSelection,
			toggleAll,
			isSelected,
			addObjectFilter,
			removeObjectFilter,
			handleClickButton,
			handleClick,
		} = this

		const extraProps = {
			selectAll,
			isSelected,
			toggleAll,
			toggleSelection,
			selectType,
		}

		const propsGroup = {
			addObjectFilter,
			removeObjectFilter,
			filterSelection,
			handleClickButton,
			handleClick,
			selection,
		}

		return (
			<Fragment>
				<CustomView condition={!isTablet && !isMobile}>
					<BrowserObjectTableView {...propsGroup} />
				</CustomView>
				<TabletView>
					<TabletObjectTableView {...propsGroup} />
				</TabletView>
				<MobileOnlyView>
					<MobileObjectTableView {...propsGroup} />
				</MobileOnlyView>
				<hr />
				<SelectTable
					keyField="id"
					data={this.state.filteredData}
					columns={this.state.columns}
					ref={(r) => (this.selectTable = r)}
					className="-highlight text-none"
					style={{ maxHeight: '70vh' }}
					onPageChange={() => {
						this.setState({ selectAll: false, selection: '' })
					}}
					onSortedChange={() => {
						this.setState({ selectAll: false, selection: '' })
					}}
					{...extraProps}
					{...styleConfig.reactTable}
					NoDataComponent={() => null}
					getTrProps={(state, rowInfo) => {
						return {
							onClick: (e) => {
								if (!e.target.type) {
									this.setState({
										isPatientShowEdit: true,
										selectedRowData: rowInfo.original,
										formTitle: 'edit info',
										disableASN: true,
										apiMethod: 'put',
									})
								}
							},
						}
					}}
				/>
				<EditPatientForm
					show={this.state.isPatientShowEdit}
					title={this.state.formTitle}
					selectedRowData={selectedRowData || ''}
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
				<BindForm
					show={this.state.isShowBind}
					bindCase={this.state.bindCase}
					title={this.state.formTitle}
					handleSubmit={this.handleSubmitForm}
					formPath={this.state.formPath}
					handleClose={this.handleClose}
					objectTable={this.state.objectTable}
					areaTable={this.state.areaTable}
					macOptions={this.state.macOptions}
					data={this.state.importData.reduce((dataMap, item) => {
						dataMap[item.asset_control_number] = item
						return dataMap
					}, {})}
				/>
				<DeleteConfirmationForm
					show={this.state.showDeleteConfirmation}
					handleClose={this.handleClose}
					message={this.state.message}
					handleSubmit={this.objectMultipleDelete}
				/>
			</Fragment>
		)
	}
}
export default PatientTable
