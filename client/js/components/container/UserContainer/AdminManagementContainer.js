/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        AdminManagementContainer.js

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
import { ButtonToolbar } from 'react-bootstrap'
import { userInfoTableColumn } from '../../../config/tables'
import EditUserForm from '../../presentational/form/EditUserForm'
import { AppContext } from '../../../context/AppContext'
import DeleteUserForm from './DeleteUserForm'
import DeleteConfirmationForm from '../../presentational/DeleteConfirmationForm'
import { setSuccessMessage } from '../../../helper/messageGenerator'
import { PrimaryButton } from '../../BOTComponent/styleComponent'
import AccessControl from '../../authentication/AccessControl'
import config from '../../../config'
import apiHelper from '../../../helper/apiHelper'
import { formatTime } from '../../../helper/utilities'
import BOTTable from '../../BOTComponent/BOTTable'

const Fragment = React.Fragment

class AdminManagementContainer extends React.Component {
	static contextType = AppContext

	state = {
		showAddUserForm: false,
		showDeleteUserForm: false,
		data: [],
		selectedUser: null,
		roleName: [],
		title: '',
		locale: this.context.locale.abbr,
		showDeleteConfirmation: false,
		deleteUserName: '',
		areaTable: [],
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (this.context.locale.abbr !== prevState.locale) {
			this.getUserList()
		}
	}

	componentDidMount = () => {
		this.getUserList()
		this.getAllRole()
		this.getAreaTable()
	}

	getUserList = async (callback) => {
		const { locale } = this.context
		const res = await apiHelper.userApiAgent.getAllUser({
			locale: locale.abbr,
		})
		if (res) {
			const data = res.data.rows.map((item, index) => {
				item._id = index + 1
				item.roles = item.role_type
					.map((role) => locale.texts[role.toUpperCase()])
					.join('/')
				item.area_ids = item.area_ids
					.filter((area) => parseInt(area.id) !== parseInt(item.main_area.id))
					.map((area) => locale.texts[area.value])
					.join('/')
				item.main_area.label = locale.texts[item.main_area.value]
				item.last_visit_timestamp = formatTime(item.last_visit_timestamp)
				item.registered_timestamp = formatTime(item.registered_timestamp)

				return item
			})

			this.setState(
				{
					data,
					showModifyUserInfo: false,
					showAddUserForm: false,
					showDeleteUserForm: false,
					showDeleteConfirmation: false,
					deleteUserName: '',
					selectedUser: null,
					locale: locale.abbr,
				},
				callback
			)
		}
	}

	getAllRole = async () => {
		const res = await apiHelper.roleApiAgent.getAllRole()
		if (res) {
			const roleName = res.data.filter((item) =>
				config.ROLES_SELECTION.includes(item.name)
			)
			this.setState({
				roleName,
			})
		}
	}

	getAreaTable = async () => {
		const res = await apiHelper.areaApiAgent.getAreaTable()
		if (res) {
			this.setState({
				areaTable: res.data,
			})
		}
	}

	handleSubmit = async (values) => {
		const { api } = this.state
		switch (api) {
			case 'addUser':
				this.handleAddUserSubmit(values)
				break
			case 'setUserInfo':
				this.handleSetUserSubmit(values)
				break
		}
	}

	handleSetUserSubmit = async (values) => {
		const { auth } = this.context
		const { selectedUser } = this.state
		const user = {
			...auth.user,
			...values,
			id: selectedUser.id,
			areas_id: auth.user.areas_id,
			main_area: values.area.id,
		}

		const index = auth.user.areas_id.indexOf(auth.user.main_area)
		user.areas_id.splice(index, 1)

		if (!user.areas_id.includes(user.area.id)) {
			user.areas_id.push(user.area.id)
		}

		await apiHelper.userApiAgent.setUserInfo({ user })

		this.getUserList(() => setSuccessMessage('save success'))
	}

	handleAddUserSubmit = async (values) => {
		const { name, email, password, roles, area } = values
		const user = {
			name: name.toLowerCase(),
			email: email.toLowerCase(),
			password,
			roles,
			area_id: area.id,
		}

		await apiHelper.userApiAgent.addUser({ user })

		this.getUserList(() => setSuccessMessage('save success'))
	}

	handleWarningChecked = (e) => {
		this.setState({
			showDeleteConfirmation: true,
			deleteUserName: e.name.label,
		})
	}

	handleDeleteUserSubmit = async () => {
		const res = await apiHelper.userApiAgent.deleteUser({
			username: this.state.deleteUserName,
		})
		if (res) {
			this.getUserList(() => setSuccessMessage('save success'))
		}
	}

	handleClose = () => {
		this.setState({
			showAddUserForm: false,
			showDeleteUserForm: false,
			selectedUser: null,
			title: '',
			api: '',
			showDeleteConfirmation: false,
			deleteUserName: '',
		})
	}

	onRowClick = (original) => {
		this.setState({
			showAddUserForm: true,
			selectedUser: original,
			title: 'edit user',
			api: 'setUserInfo',
		})
	}

	handleClick = (e) => {
		switch (e.target.name) {
			case 'add user':
				this.setState({
					showAddUserForm: true,
					title: 'add user',
					api: 'addUser',
				})
				break
			case 'delete user':
				this.setState({
					showDeleteUserForm: true,
				})
				break
		}
	}

	render() {
		const { locale } = this.context
		const { title } = this.state

		return (
			<Fragment>
				<div className="d-flex justify-content-start">
					<AccessControl>
						<ButtonToolbar>
							<PrimaryButton
								className="mb-1 mr-1"
								name="add user"
								onClick={this.handleClick}
							>
								{locale.texts.ADD_USER}
							</PrimaryButton>
							<PrimaryButton
								className="mb-1"
								name="delete user"
								onClick={this.handleClick}
							>
								{locale.texts.DELETE_USER}
							</PrimaryButton>
						</ButtonToolbar>
					</AccessControl>
				</div>
				<hr />
				<BOTTable
					data={this.state.data}
					columns={userInfoTableColumn}
					style={{ maxHeight: '75vh' }}
					onClickCallback={this.onRowClick}
				/>

				<EditUserForm
					show={this.state.showAddUserForm}
					handleClose={this.handleClose}
					handleSubmit={this.handleSubmit}
					title={title}
					selectedUser={this.state.selectedUser}
					roleName={this.state.roleName}
					data={this.state.data}
					areaTable={this.state.areaTable}
				/>

				<DeleteUserForm
					show={this.state.showDeleteUserForm}
					title={locale.texts.DELETE_USER}
					handleClose={this.handleClose}
					data={this.state.data}
					handleSubmit={this.handleWarningChecked}
				/>

				<DeleteConfirmationForm
					show={this.state.showDeleteConfirmation}
					handleClose={this.handleClose}
					handleSubmit={this.handleDeleteUserSubmit}
					message={locale.texts.ARE_YOU_SURE_TO_DELETE}
				/>
			</Fragment>
		)
	}
}

export default AdminManagementContainer
