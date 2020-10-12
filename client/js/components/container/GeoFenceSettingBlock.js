/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        GeoFenceSettingBlock.js

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
import { AppContext } from '../../context/AppContext'
import { ButtonToolbar } from 'react-bootstrap'
import config from '../../config'
import ReactTable from 'react-table'
import { geofenceConfigColumn } from '../../config/tables'
import EditGeofenceConfig from '../presentational/form/EditGeofenceConfig'
import styleConfig from '../../config/styleConfig'
import DeleteConfirmationForm from '../presentational/DeleteConfirmationForm'
import selecTableHOC from 'react-table/lib/hoc/selectTable'
import messageGenerator from '../../helper/messageGenerator'
import { PrimaryButton } from '../BOTComponent/styleComponent'
import AccessControl from '../authentication/AccessControl'
import apiHelper from '../../helper/apiHelper'
import { JSONClone } from '../../helper/utilities'

const SelectTable = selecTableHOC(ReactTable)

let lock = false

class GeoFenceSettingBlock extends React.Component {
	static contextType = AppContext

	state = {
		type: config.monitorSettingUrlMap[this.props.type],
		data: [],
		columns: [],
		lbeaconsTable: [],
		selectedData: null,
		show: false,
		showDeleteConfirmation: false,
		locale: this.context.locale.abbr,
		isEdited: false,
		path: '',
		selection: [],
		selectAll: false,
		exIndex: 9999,
	}

	componentDidMount = () => {
		this.getMonitorConfig()
		this.getLbeaconTable()
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (this.state.exIndex != this.props.nowIndex) {
			this.setState({
				selectAll: false,
				selection: '',
				exIndex: this.props.nowIndex,
			})
		}
		if (this.context.locale.abbr != prevState.locale) {
			this.getMonitorConfig()
			this.setState({
				locale: this.context.locale.abbr,
			})
		}
	}

	getLbeaconTable = () => {
		const { locale } = this.context

		apiHelper.lbeaconApiAgent
			.getLbeaconTable({
				locale: locale.abbr,
			})
			.then((res) => {
				this.setState({
					lbeaconsTable: res.data.rows,
				})
			})
	}

	getMonitorConfig = (callback) => {
		const { auth, locale } = this.context
		apiHelper.geofenceApis
			.getGeofenceConfig(auth.user.areas_id)
			.then((res) => {
				const columns = JSONClone(geofenceConfigColumn)

				columns.map((field) => {
					field.Header =
						locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
				})

				res.data.rows.map((item, index) => {
					item.parsePerimeters.lbeacons[index] += ','
					item.key = index + 1
					item.area = {
						value: config.mapConfig.areaOptions[item.area_id],
						label: locale.texts[config.mapConfig.areaOptions[item.area_id]],
						id: item.area_id,
					}
					item.p_rssi = item.perimeters.split(',')[
						item.perimeters.split(',').length - 2
					]
					item.f_rssi = item.fences.split(',')[
						item.fences.split(',').length - 2
					]
				})
				this.setState(
					{
						data: res.data.rows,
						columns,
						show: false,
						showDeleteConfirmation: false,
						selectedData: null,
						selection: '',
						selectAll: false,
					},
					callback
				)
			})
			.catch((err) => {
				console.log(err)
			})
	}

	handleClickButton = (e, value) => {
		const { name } = e.target
		switch (name) {
			case 'add rule':
				this.setState({
					show: true,
					isEdited: false,
					path: 'add',
				})
				break
			case 'edit':
				this.setState({
					show: true,
					selectedData: value.original,
					isEdited: true,
					path: 'setGeofenceConfig',
				})
				break
			case 'delete':
				this.setState({
					showDeleteConfirmation: true,
					path: 'delete',
				})
				lock = true
				break
		}
	}

	handleClose = () => {
		this.setState({
			show: false,
			showDeleteConfirmation: false,
			selectedData: null,
		})
		lock = false
	}

	handleSubmit = (pack) => {
		lock = true
		const configPackage = pack || {}
		const { path, selectedData } = this.state
		configPackage.type = config.monitorSettingUrlMap[this.props.type]
		// configPackage["id"] = selectedData ? selectedData.id : null
		// configPackage["id"] = this.state.selection
		path == 'setGeofenceConfig'
			? (configPackage.id = selectedData.id)
			: (configPackage.id = this.state.selection)

		apiHelper.geofenceApis[path](configPackage)
			.then((res) => {
				const callback = () =>
					messageGenerator.setSuccessMessage('save success')
				this.getMonitorConfig(callback)
			})
			.catch((err) => {
				console.log(err)
			})
	}

	toggleSelection = (key, shift, row) => {
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
			// const currentRecords = wrappedInstance.props.data
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

	render() {
		const { selectedRowData, selectAll, selectType } = this.state

		const { toggleSelection, toggleAll, isSelected } = this

		const extraProps = {
			selectAll,
			isSelected,
			toggleAll,
			toggleSelection,
			selectType,
		}

		const { type } = this.props

		const { lbeaconsTable, isEdited } = this.state

		const { locale } = this.context

		return (
			<div>
				<div className="d-flex justify-content-start">
					<AccessControl
						renderNoAccess={() => null}
						platform={['browser', 'tablet']}
					>
						<ButtonToolbar>
							<PrimaryButton
								className="text-capitalize mr-2 mb-1"
								name="add rule"
								onClick={this.handleClickButton}
							>
								{locale.texts.ADD_RULE}
							</PrimaryButton>
							<PrimaryButton
								className="mr-2 mb-1"
								name="delete"
								onClick={this.handleClickButton}
							>
								{locale.texts.DELETE}
							</PrimaryButton>
						</ButtonToolbar>
					</AccessControl>
				</div>
				<hr />
				<SelectTable
					keyField="id"
					data={this.state.data}
					columns={this.state.columns}
					ref={(r) => (this.selectTable = r)}
					className="-highlight"
					minRows={0}
					onSortedChange={(e) => {
						this.setState({ selectAll: false, selection: '' })
					}}
					{...extraProps}
					{...styleConfig.reactTable}
					getTrProps={(state, rowInfo, column, instance) => {
						return {
							onClick: (e, handleOriginal) => {
								this.setState({
									show: true,
									selectedData: rowInfo.row._original,
									isEdited: true,
									path: 'setGeofenceConfig',
								})
							},
						}
					}}
				/>

				<EditGeofenceConfig
					handleShowPath={this.props.handleShowPath}
					selectedData={this.state.selectedData}
					show={this.state.show}
					handleClose={this.handleClose}
					title={isEdited ? 'edit geofence config' : 'add geofence config'}
					type={config.monitorSettingUrlMap[this.props.type]}
					handleSubmit={this.handleSubmit}
					lbeaconsTable={lbeaconsTable}
					areaOptions={config.mapConfig.areaOptions}
					isEdited={this.state.isEdited}
				/>
				<DeleteConfirmationForm
					show={this.state.showDeleteConfirmation}
					handleClose={this.handleClose}
					handleSubmit={this.handleSubmit}
				/>
			</div>
		)
	}
}

export default GeoFenceSettingBlock
