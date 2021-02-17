import React from 'react'
import { ButtonToolbar } from 'react-bootstrap'
import { keyBy } from 'lodash'
import { userInfoTableColumn } from '../config/tables'
import EditUserForm from './EditUserForm'
import { AppContext } from '../context/AppContext'
import DeleteUserForm from './DeleteUserForm'
import DeleteConfirmationForm from './DeleteConfirmationForm'
import { setSuccessMessage } from '../helper/messageGenerator'
import { PrimaryButton } from '../components/StyleComponents'
import AccessControl from './AccessControl'
import config from '../config'
import API from '../api'
import { formatTime } from '../helper/utilities'
import Table from '../components/Table'

const Fragment = React.Fragment

class AdminManagementContainer extends React.Component {
	static contextType = AppContext

	state = {
		showAddUserForm: false,
		showDeleteUserForm: false,
		data: [],
		selectedUser: null,
		filteredRoleList: [],
		title: '',
		locale: this.context.locale.abbr,
		showDeleteConfirmation: false,
		deleteUserName: '',
		areaTable: [],
		roleMap: null,
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (this.context.locale.abbr !== prevState.locale) {
			this.getUserList()
		}
	}

	componentDidMount = () => {
		this.getUserList()
		this.getAreaTable()
	}

	getUserList = async (callback) => {
		const { locale } = this.context
		const allUserPromise = API.User.getAllUser()
		const allRolePrmise = API.Role.getAllRole()

		const [allUserRes, allRoleRes] = await Promise.all([
			allUserPromise,
			allRolePrmise,
		])

		if (allUserRes && allRoleRes) {
			const allRoleList = allRoleRes.data
			const filteredRoleList = allRoleRes.data.filter((item) =>
				config.ROLES_SELECTION.includes(item.name)
			)
			const roleMap = keyBy(allRoleList, 'id')

			const data = allUserRes.data.rows.map((item, index) => {
				item._id = index + 1
				item.roleName = item.role_ids
					.map((roleId) => locale.texts[roleMap[roleId].name.toUpperCase()])
					.join('/')
				item.areas = item.area_ids
				item.areaIds = item.area_ids.map((area) => `${area.id}`)
				item.areasName = item.area_ids.map((area) => area.value).join('/')
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
					filteredRoleList,
					roleMap,
				},
				callback
			)
		}
	}

	getAreaTable = async () => {
		const res = await API.Area.getAreaTable()
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
		const { name, email, roleIds, areaIds } = values
		const { selectedUser } = this.state
		const user = {
			id: selectedUser.id,
			name,
			email,
			roleIds,
			areaIds,
		}

		await API.User.setUserInfo({ user })

		this.getUserList(() => setSuccessMessage('save success'))
	}

	handleAddUserSubmit = async (values) => {
		const { name, email, password, roleIds, areaIds } = values
		const user = {
			name: name.toLowerCase(),
			email: email.toLowerCase(),
			password,
			roleIds,
			areaIds,
		}

		await API.User.addUser({ user })

		this.getUserList(() => setSuccessMessage('save success'))
	}

	handleWarningChecked = (e) => {
		this.setState({
			showDeleteConfirmation: true,
			deleteUserName: e.name.label,
		})
	}

	handleDeleteUserSubmit = async () => {
		const res = await API.User.deleteUser({
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
				<Table
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
					filteredRoleList={this.state.filteredRoleList}
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
