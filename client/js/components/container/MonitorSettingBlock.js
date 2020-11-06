/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        MonitorSettingBlock.js

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
import styleConfig from '../../config/styleConfig'
import EditMonitorConfigForm from '../presentational/form/EditMonitorConfigForm'
import DeleteConfirmationForm from '../presentational/DeleteConfirmationForm'
import { monitorConfigColumn } from '../../config/tables'
import selecTableHOC from 'react-table/lib/hoc/selectTable'
import messageGenerator from '../../helper/messageGenerator'
import { PrimaryButton } from '../BOTComponent/styleComponent'
import AccessControl from '../authentication/AccessControl'
import apiHelper from '../../helper/apiHelper'
import { JSONClone } from '../../helper/utilities'
import PropTypes from 'prop-types'

const SelectTable = selecTableHOC(ReactTable)

class MonitorSettingBlock extends React.Component {
	static contextType = AppContext

	state = {
		type: config.monitorSettingUrlMap[this.props.type],
		data: [],
		columns: [],
		path: '',
		areaOptions: [],
		isEdited: false,
		selection: [],
		selectAll: false,
		exIndex: 9999,
		locale: this.context.locale.abbr,
	}

	componentDidMount = () => {
		this.getMonitorConfig()
	}

	getMonitorConfig = async (callback) => {
		const { auth, locale } = this.context
		const res = await apiHelper.monitor.getMonitorConfig(
			this.props.type,
			auth.user.areas_id
		)
		const columns = JSONClone(monitorConfigColumn)

		columns.forEach((field) => {
			field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
		})
		res.data.forEach((item) => {
			item.area = {
				value: config.mapConfig.areaOptions[item.area_id],
				label: locale.texts[config.mapConfig.areaOptions[item.area_id]],
				id: item.area_id,
			}
		})
		this.setState(
			{
				data: res.data,
				columns,
				show: false,
				showDeleteConfirmation: false,
				selectedData: null,
				selection: '',
				selectAll: false,
			},
			callback
		)
	}

	handleSubmit = async (pack) => {
		const configPackage = pack || {}
		const { path } = this.state
		configPackage.type = config.monitorSettingUrlMap[this.props.type]
		configPackage.id = this.state.selection
		if (configPackage.id === '' && this.state.selectedData !== null) {
			configPackage.id = this.state.selectedData.id
		}

		const res = await apiHelper.monitor[path](configPackage)
		if (res) {
			const callback = () => messageGenerator.setSuccessMessage('save success')
			this.getMonitorConfig(callback)
		}
	}

	handleClose = () => {
		this.setState({
			show: false,
			showDeleteConfirmation: false,
			selectedData: null,
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
					path: 'put',
				})
				break
			case 'delete':
				this.setState({
					showDeleteConfirmation: true,
					path: 'delete',
				})
				break
		}
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

	componentDidUpdate = (prevProps, prevState) => {
		if (this.state.exIndex !== this.props.nowIndex) {
			this.setState({
				selectAll: false,
				selection: '',
				exIndex: this.props.nowIndex,
			})
		}
		if (this.context.locale.abbr !== prevState.locale) {
			this.getMonitorConfig()
			this.setState({
				locale: this.context.locale.abbr,
			})
		}
	}

	render() {
		const { selectAll, selectType, isEdited } = this.state
		const { toggleSelection, toggleAll, isSelected } = this
		const extraProps = {
			selectAll,
			isSelected,
			toggleAll,
			toggleSelection,
			selectType,
		}

		const { locale } = this.context
		const { type } = this.props

		const areaOptions = Object.values(config.mapConfig.AREA_MODULES).map(
			(area) => {
				return {
					value: area.name,
					label: locale.texts[area.name],
					id: area.id,
				}
			}
		)

		const title = `edit ${type}`.toUpperCase().replace(/ /g, '_')
		return (
			<div>
				<div className="d-flex justify-content-start">
					<AccessControl
						renderNoAccess={() => null}
						platform={['browser', 'tablet']}
					>
						<ButtonToolbar>
							<PrimaryButton
								className="mr-2 mb-1"
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
					{...extraProps}
					{...styleConfig.reactTable}
					onSortedChange={() => {
						this.setState({ selectAll: false, selection: '' })
					}}
					getTrProps={(state, rowInfo) => {
						return {
							onClick: () => {
								this.setState({
									selectedData: rowInfo.row._original,
									show: true,
									isEdited: true,
									path: 'put',
								})
							},
						}
					}}
				/>
				<EditMonitorConfigForm
					handleShowPath={this.show}
					selectedData={this.state.selectedData}
					show={this.state.show}
					handleClose={this.handleClose}
					title={title}
					type={config.monitorSettingUrlMap[this.props.type]}
					handleSubmit={this.handleSubmit}
					areaOptions={areaOptions}
					isEdited={isEdited}
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

MonitorSettingBlock.propTypes = {
	type: PropTypes.string.isRequired,
	nowIndex: PropTypes.number.isRequired,
}

export default MonitorSettingBlock
