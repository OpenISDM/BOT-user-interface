import React from 'react'
import {
	Tabs,
	Tab,
	Button,
	Form as BootstrapForm,
	Row,
	Col,
} from 'react-bootstrap'
import { AppContext } from '../context/AppContext'
import Select from '../components/Select'
import { Formik, Field, Form } from 'formik'
import Container from 'react-bootstrap/Container'

class RolePermissionManagement extends React.Component {
	static contextType = AppContext

	state = {
		permissionList: [],
		rolesPermission: [],
		permissionType: ['form', 'route', 'user'],
		roleList: [],
	}

	columns = [
		{
			label: '',
			field: 'fold',
			sort: 'asc',
			width: 200,
		},
		{
			label: 'level',
			field: 'level',
			width: 200,
		},
		{
			label: 'chinese',
			field: 'chinese',
			width: 200,
		},
		{
			label: 'english',
			field: 'english',
			width: 200,
		},
		{
			label: 'remove',
			field: 'remove',
			width: 200,
		},
		{
			label: 'add',
			field: 'add',
			width: 200,
		},
	]

	componentDidMount = () => {
		// this.getRolesPermission()
	}

	getRolesPermission = () => {
		// axios
		// 	.get(endpoints.getRolesPermission)
		// 	.then((res) => {
		// 		const rolesList = res.data.roles_list.map((role) => {
		// 			return {
		// 				label: role.name,
		// 				value: role.name,
		// 				id: role.id,
		// 			}
		// 		})
		// 		this.setState({
		// 			permissionList: res.data.permission_list,
		// 			rolesPermission: res.data.roles_permission,
		// 			roleList: rolesList,
		// 		})
		// 	})
		// 	.catch((err) => {
		// 		console.log(err)
		// 	})
	}

	addPermission = () => {
		// axios
		// 	.post(endpoints.modifyPermission, {
		// 		type: 'add permission',
		// 		permissionType: type,
		// 		name: 'new permission',
		// 	})
		// 	.then((res) => {
		// 		this.getRolesPermission()
		// 	})
		// 	.catch((err) => {
		// 		console.log(err)
		// 	})
	}

	renamePermissionToState = (type, id, e) => {
		this.state.permissionList.forEach((permission) => {
			if (permission.id === id) {
				permission.name = `${type}:${e.target.value}`
			}
		})
	}
	renamePermissionToBackend = (type, id, e) => {
		if (e.target.value) {
			// axios
			// 	.post(endpoints.modifyPermission, {
			// 		type: 'rename permission',
			// 		permissionType: type,
			// 		id,
			// 		name: e.target.value,
			// 	})
			// 	.then((res) => {
			// 		this.getRolesPermission()
			// 	})
			// 	.catch((err) => {
			// 		console.log(err)
			// 	})
		}
	}
	removePermission = (type, id, e) => {
		console.log(type, id, e)
		// axios
		// 	.post(endpoints.modifyPermission, {
		// 		type: 'remove permission',
		// 		permissionType: type,
		// 		id,
		// 	})
		// 	.then((res) => {
		// 		this.getRolesPermission()
		// 	})
		// 	.catch((err) => {
		// 		console.log(err)
		// 	})
	}

	onChangeRolesPermission = (sendPackage) => {
		console.log(sendPackage)
		// axios
		// 	.post(endpoints.modifyRolesPermission, sendPackage)
		// 	.then((res) => {
		// 		this.getRolesPermission()
		// 	})
		// 	.catch((err) => {
		// 		console.log(err)
		// 	})
	}

	render() {
		const { locale } = this.context
		return (
			<Tabs>
				<Tab eventKey="roleList" title={locale.texts.ROLE_LIST}>
					<Formik
						initialValues={{
							...this.state.permissionList.reduce(function (map, permission) {
								map[
									permission.name.split(':').join('_')
								] = permission.name.split(':')[1]
								return map
							}, {}),
							selectedRole: null,
							rolePermission: [],
							selectedPermission: [],
						}}
						validationSchema={<div></div>}
						render={({ values, setFieldValue }) => (
							<Form className="text-capitalize">
								<Select
									name="selectedRole"
									placeholder={locale.texts.SELECT_ROLE + '...'}
									options={this.state.roleList || []}
									value={values.selectedRole}
									onChange={(value) => {
										let selectedPermission = this.state.rolesPermission.filter(
											(role) => role.role.id === value.id
										)[0]
										selectedPermission = selectedPermission
											? selectedPermission.permissions.map(
													(permission) => permission.name
											  )
											: []

										setFieldValue('selectedRole', value)
										setFieldValue('selectedPermission', selectedPermission)
									}}
								/>
								<Container>
									<Row>
										{this.state.permissionType.map((type) => {
											return (
												<div key={type}>
													<Col md={4}></Col>
													<Col md={4} className="m-4 ">
														<h4 className="d-flex justify-content-center m-4">
															{locale.texts[type.toUpperCase()]}
														</h4>
														{this.state.permissionList
															.filter(
																(permission) =>
																	permission.name.split(':')[0] === type
															)
															.map((permission) => {
																return (
																	<Row key={permission.name}>
																		<BootstrapForm.Check
																			disabled={!values.selectedRole}
																			custom
																			type={'switch'}
																			id={`custom-${permission.name}`}
																			label={permission.name.split(':')[1]}
																			checked={values.selectedPermission.includes(
																				permission.name
																			)}
																			onChange={() => {
																				let commandType = null
																				if (
																					values.selectedPermission.includes(
																						permission.name
																					)
																				) {
																					values.selectedPermission.splice(
																						values.selectedPermission.indexOf(
																							permission.name
																						),
																						1
																					)
																					commandType = 'remove permission'
																				} else {
																					values.selectedPermission.push(
																						permission.name
																					)
																					commandType = 'add permission'
																				}
																				setFieldValue(
																					'selectedPermission',
																					values.selectedPermission
																				)
																				const roleId = values.selectedRole.id,
																					permissionId = permission.id
																				this.onChangeRolesPermission({
																					type: commandType,
																					permissionId,
																					roleId,
																				})
																			}}
																		/>
																	</Row>
																)
															})}
													</Col>
												</div>
											)
										})}
									</Row>
								</Container>
							</Form>
						)}
					/>
				</Tab>
				<Tab eventKey="permissionList" title={locale.texts.PERMISSION_LIST}>
					<Formik
						initialValues={this.state.permissionList.reduce(function (
							map,
							permission
						) {
							map[permission.name.split(':').join('_')] = permission.name.split(
								':'
							)[1]
							return map
						},
						{})}
						validationSchema={<div></div>}
						render={() => (
							<Form className="text-capitalize">
								<Row>
									{this.state.permissionType.map((type) => {
										return (
											<Col lg={12} className="m-4" key={type}>
												<h5 className="d-flex justify-content-center">
													{locale.texts[type.toUpperCase()]}
												</h5>
												{this.state.permissionList
													.filter(
														(permission) =>
															permission.name.split(':')[0] === type
													)
													.map((permission) => {
														return (
															<Row key={permission.name}>
																<Col lg={11}>
																	<Field
																		name={permission.name.split(':').join('_')}
																		type={'text'}
																		className={'form-control my-1'}
																		placeholder={permission.name.split(':')[1]}
																		disabled={false}
																		onBlur={this.renamePermissionToBackend.bind(
																			this,
																			type,
																			permission.id
																		)}
																	/>
																</Col>
																<Col lg={1}>
																	<i
																		className="fas fa-minus d-flex justify-content-center"
																		onClick={this.removePermission.bind(
																			this,
																			type,
																			permission.id
																		)}
																	/>
																</Col>
															</Row>
														)
													})}
												<Row>
													<Button
														type={'button'}
														className={'form-control my-1'}
														variant="light"
														onClick={this.addPermission.bind(this, type)}
													>
														{locale.texts.ADD_PERMISSION}
													</Button>
												</Row>
											</Col>
										)
									})}
								</Row>
							</Form>
						)}
					/>
				</Tab>
			</Tabs>
		)
	}
}

export default RolePermissionManagement
