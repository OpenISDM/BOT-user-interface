/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        BOTAdminMonitorSetting.js

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
import { geofenceConfigColumn } from '../../config/tables'
import EditGeofenceConfig from '../presentational/form/EditGeofenceConfig'
import DeleteConfirmationForm from '../presentational/DeleteConfirmationForm'
import messageGenerator from '../../helper/messageGenerator'
import { PrimaryButton } from '../BOTComponent/styleComponent'
import AccessControl from '../authentication/AccessControl'
import apiHelper from '../../helper/apiHelper'
import BOTSelectTable from '../BOTComponent/BOTSelectTable'
import { SET_TABLE_SELECTION } from '../../reducer/action'
import PropTypes from 'prop-types'

const ACTION_ENUM = {
	ADD: 'ADD',
	DELETE: 'DELETE',
}

class BOTAdminMonitorSetting extends React.Component {
	static contextType = AppContext

	state = {
		data: [],
		columns: [],
		lbeaconsTable: [],
		show: false,
		showDeleteConfirmation: false,
		locale: this.context.locale.abbr,
		isEdited: false,
		path: '',
		selectedItem: {},
	}

	componentDidMount = () => {
		this.getMonitorConfig()
		this.getLbeaconTable()
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (this.context.locale.abbr !== prevState.locale) {
			this.getMonitorConfig()
			this.setState({
				locale: this.context.locale.abbr,
			})
		}
	}

	getLbeaconTable = async () => {
		const { locale } = this.context
		const res = await apiHelper.lbeaconApiAgent.getLbeaconTable({
			locale: locale.abbr,
		})

		this.setState({
			lbeaconsTable: res.data.rows,
		})
	}

	getMonitorConfig = async (callback) => {
		const { locale, stateReducer } = this.context
		const [{ area }] = stateReducer
		const res = await apiHelper.geofenceApis.getGeofenceConfig({
			areaId: area.id,
		})

		const data = res.data.map((item, index) => {
			item.key = index + 1
			item.area = {
				value: config.mapConfig.areaOptions[item.area_id],
				label: locale.texts[config.mapConfig.areaOptions[item.area_id]],
				id: item.area_id,
			}
			item.p_rssi = item.perimeters_rssi
			item.f_rssi = item.fences_rssi
			item.p_lbeacon =
				item.perimeters_uuid &&
				item.perimeters_uuid.split(',').filter((uuid) => uuid)
			item.f_lbeacon =
				item.fences_uuid && item.fences_uuid.split(',').filter((uuid) => uuid)

			return item
		})

		this.setState(
			{
				data,
				columns: geofenceConfigColumn,
				show: false,
				showDeleteConfirmation: false,
			},
			callback
		)
	}

	handleClickButton = (e) => {
		const { name } = e.target
		switch (name) {
			case ACTION_ENUM.ADD:
				this.setState({
					show: true,
					isEdited: false,
					path: 'add',
				})
				break
			case ACTION_ENUM.DELETE:
				this.setState({
					showDeleteConfirmation: true,
				})
				break
		}
	}

	handleClose = () => {
		this.cleanSelection()

		this.setState({
			show: false,
			showDeleteConfirmation: false,
		})
	}

	cleanSelection = () => {
		const [, dispatch] = this.context.stateReducer

		dispatch({
			type: SET_TABLE_SELECTION,
			value: [],
		})
	}

	submitCallback = () => {
		this.cleanSelection()
		messageGenerator.setSuccessMessage('save success')
	}

	handleSetSubmit = async (pack) => {
		const configPackage = pack || {}
		const { path } = this.state

		await apiHelper.geofenceApis[path]({ configPackage })
		this.getMonitorConfig(this.submitCallback)
	}

	handleDeleteSubmit = async () => {
		const [{ tableSelection }] = this.context.stateReducer

		await apiHelper.geofenceApis.delete({ ids: tableSelection })
		this.getMonitorConfig(this.submitCallback)
	}

	render() {
		const { locale } = this.context
		const { lbeaconsTable } = this.state

		return (
			<div>
				<div className="d-flex justify-content-start">
					<AccessControl platform={['browser', 'tablet']}>
						<ButtonToolbar>
							<PrimaryButton
								className="text-capitalize mr-2 mb-1"
								name={ACTION_ENUM.ADD}
								onClick={this.handleClickButton}
							>
								{locale.texts.ADD_RULE}
							</PrimaryButton>
							<PrimaryButton
								className="mr-2 mb-1"
								name={ACTION_ENUM.DELETE}
								onClick={this.handleClickButton}
							>
								{locale.texts.DELETE}
							</PrimaryButton>
						</ButtonToolbar>
					</AccessControl>
				</div>

				<hr />
				<BOTSelectTable
					data={this.state.data}
					columns={this.state.columns}
					onClickCallback={(selectedItem) => {
						this.setState({
							show: true,
							isEdited: true,
							path: 'setGeofenceConfig',
							selectedItem,
						})
					}}
				/>

				<EditGeofenceConfig
					selectedData={this.state.selectedItem}
					show={this.state.show}
					handleClose={this.handleClose}
					type={
						config.monitorSettingUrlMap[
							config.monitorSettingType.GEOFENCE_MONITOR
						]
					}
					handleSubmit={this.handleSetSubmit}
					lbeaconsTable={lbeaconsTable}
					isEdited={this.state.isEdited}
				/>

				<DeleteConfirmationForm
					show={this.state.showDeleteConfirmation}
					handleClose={this.handleClose}
					handleSubmit={this.handleDeleteSubmit}
				/>
			</div>
		)
	}
}

BOTAdminMonitorSetting.propTypes = {
	type: PropTypes.string.isRequired,
	nowIndex: PropTypes.number.isRequired,
}

export default BOTAdminMonitorSetting
