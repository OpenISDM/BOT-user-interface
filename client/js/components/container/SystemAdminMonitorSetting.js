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

class BOTAdminMonitorSetting extends React.Component {
	static contextType = AppContext

	state = {
		data: [],
		columns: [],
		lbeaconsTable: [],
		selectedData: null,
		show: false,
		showDeleteConfirmation: false,
		locale: this.context.locale.abbr,
		isEdited: false,
		path: '',
		exIndex: 9999,
	}

	componentDidMount = () => {
		this.getMonitorConfig()
		this.getLbeaconTable()
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (this.state.exIndex !== this.props.nowIndex) {
			this.setState({
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
		const { auth, locale } = this.context
		const res = await apiHelper.geofenceApis.getGeofenceConfig(
			auth.user.areas_id
		)

		const data = res.data.rows.map((item, index) => {
			item.parsePerimeters.lbeacons[index]
			item.key = index + 1
			item.area = {
				value: config.mapConfig.areaOptions[item.area_id],
				label: locale.texts[config.mapConfig.areaOptions[item.area_id]],
				id: item.area_id,
			}
			item.p_rssi = item.perimeters.split(',')[
				item.perimeters.split(',').length - 2
			]
			item.f_rssi = item.fences.split(',')[item.fences.split(',').length - 2]

			return item
		})

		this.setState(
			{
				data,
				columns: geofenceConfigColumn,
				show: false,
				showDeleteConfirmation: false,
				selectedData: null,
			},
			callback
		)
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
				break
		}
	}

	handleClose = () => {
		const [, dispatch] = this.context.stateReducer
		this.setState({
			show: false,
			showDeleteConfirmation: false,
			selectedData: null,
		})

		dispatch({
			type: SET_TABLE_SELECTION,
			value: [],
		})
	}

	handleSubmit = async (pack) => {
		const configPackage = pack || {}
		const { path, selectedData } = this.state
		configPackage.type = config.monitorSettingUrlMap[this.props.type]
		configPackage.id = selectedData.id

		await apiHelper.geofenceApis[path](configPackage)
		const callback = () => messageGenerator.setSuccessMessage('save success')
		this.getMonitorConfig(callback)
	}

	render() {
		const { lbeaconsTable, isEdited } = this.state

		const { locale } = this.context

		return (
			<div>
				<div className="d-flex justify-content-start">
					<AccessControl platform={['browser', 'tablet']}>
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
				<BOTSelectTable
					data={this.state.data}
					columns={this.state.columns}
					onClickCallback={(original) => {
						this.setState({
							show: true,
							selectedData: original,
							isEdited: true,
							path: 'setGeofenceConfig',
						})
					}}
				/>

				<EditGeofenceConfig
					handleShowPath={this.props.handleShowPath}
					selectedData={this.state.selectedData}
					show={this.state.show}
					handleClose={this.handleClose}
					title={isEdited ? 'edit geofence config' : 'add geofence config'}
					type={
						config.monitorSettingUrlMap[
							config.monitorSettingType.GEOFENCE_MONITOR
						]
					}
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

BOTAdminMonitorSetting.propTypes = {
	handleShowPath: PropTypes.func.isRequired,
	type: PropTypes.string.isRequired,
	nowIndex: PropTypes.number.isRequired,
}

export default BOTAdminMonitorSetting
