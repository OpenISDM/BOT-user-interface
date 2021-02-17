import React from 'react'
import { AppContext } from '../context/AppContext'
import { ButtonToolbar } from 'react-bootstrap'
import config from '../config'
import { geofenceConfigColumn } from '../config/tables'
import EditGeofenceConfig from './EditGeofenceConfig'
import DeleteConfirmationForm from './DeleteConfirmationForm'
import { setSuccessMessage } from '../helper/messageGenerator'
import { PrimaryButton } from '../components/styleComponent'
import AccessControl from './AccessControl'
import API from '../api'
import BOTSelectTable from '../components/BOTSelectTable'
import { SET_TABLE_SELECTION } from '../reducer/action'
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
		const res = await API.Lbeacon.getLbeaconTable({
			locale: locale.abbr,
		})

		this.setState({
			lbeaconsTable: res.data.rows,
		})
	}

	getMonitorConfig = async (callback) => {
		const { stateReducer } = this.context
		const [{ area }] = stateReducer
		const res = await API.GeofenceApis.getGeofenceConfig({
			areaId: area.id,
		})

		if (res) {
			const data = res.data.map((item, index) => {
				item.key = index + 1
				item.area = {
					value: area.value,
					label: area.label,
					id: area.id,
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
		setSuccessMessage('save success')
	}

	handleSetSubmit = async (pack) => {
		const configPackage = pack || {}
		const { path } = this.state

		await API.GeofenceApis[path]({ configPackage })
		this.getMonitorConfig(this.submitCallback)
	}

	handleDeleteSubmit = async () => {
		const [{ tableSelection }] = this.context.stateReducer

		await API.GeofenceApis.delete({ ids: tableSelection })
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
