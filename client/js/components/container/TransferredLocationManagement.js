/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        TransferredLocationManagement.js

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
import { TransferredLocationColumn } from '../../config/tables'
import messageGenerator from '../../helper/messageGenerator'
import apiHelper from '../../helper/apiHelper'
import { JSONClone } from '../../helper/utilities'
import ReactTable from 'react-table'
import styleConfig from '../../config/styleConfig'
import { PrimaryButton } from '../BOTComponent/styleComponent'
import EditBranchForm from '../presentational/form/EditBranchForm'
import { ADD, SAVE_SUCCESS } from '../../config/wordMap'

class TranferredLocationManagement extends React.Component {
	static contextType = AppContext

	state = {
		transferredLocationOptions: [],
		unFoldBranches: [],
		data: [],
		columns: [],
		branchOptions: [],
		showForm: false,
	}

	componentDidMount = () => {
		this.getTransferredLocation()
	}

	getTransferredLocation = (callback) => {
		const { locale } = this.context

		apiHelper.transferredLocationApiAgent
			.getAllTransferredLocation()
			.then((res) => {
				const columns = JSONClone(TransferredLocationColumn)

				columns.map((field) => {
					field.Header =
						locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
				})

				const branchOptions = []

				const data = res.data.reduce((locationsArr, obj) => {
					branchOptions.push({
						label: obj.name,
						value: obj.name,
					})

					obj.departments.map((item) => {
						locationsArr.push({
							id: item.id,
							name: obj.name,
							department: item.value,
						})
					})
					return locationsArr
				}, [])

				this.setState(
					{
						data,
						columns,
						branchOptions,
						showForm: false,
					},
					callback
				)
			})
			.catch((err) => {
				console.log(err)
			})
	}

	generateDataRows = () => {
		const { locale } = this.context
		const rows = []
		this.state.transferredLocationOptions.map((branch) => {
			rows.push({
				fold: (
					<i
						className={
							this.state.unFoldBranches.includes(branch.id)
								? 'fas fa-caret-down d-flex justify-content-center'
								: 'fas fa-caret-right d-flex justify-content-center'
						}
						style={{ lineHeight: '100%', fontSize: '30px' }}
						onClick={this.changeFold.bind(this, branch.id)}
					></i>
				),
				level: (
					<h6>
						{locale.texts.BRANCH}
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					</h6>
				),
				name: (
					<input
						type="text"
						value={branch.branch_name}
						onBlur={this.renameBranchToBackend.bind(this, branch.id)}
						onChange={this.renameBranchToState.bind(this, branch.id)}
					/>
				),
				remove: (
					<i
						className="fas fa-minus d-flex justify-content-center"
						onClick={() => {
							this.removeBranch(branch.id)
						}}
					/>
				),
				add: (
					<i
						className="fas fa-plus d-flex justify-content-center"
						onClick={() => {
							this.addDepartment(branch.id)
							this.unfold(branch.id)
						}}
					></i>
				),
			})
			if (this.state.unFoldBranches.includes(branch.id)) {
				const { department } = branch
				department.map((department, index) => {
					rows.push({
						fold: null,
						level: <h6>{locale.texts.DEPARTMENT}</h6>,
						name: (
							<input
								type="text"
								value={department}
								onBlur={this.renameDepartmentToBackend.bind(
									this,
									branch.id,
									index
								)}
								onChange={this.renameDepartmentToState.bind(
									this,
									branch.id,
									index
								)}
							/>
						),
						remove: (
							<i
								className="fas fa-minus d-flex justify-content-center"
								onClick={() => {
									if (branch.department.length > 1) {
										this.removeDepartment(branch.id, index)
									} else {
										const callback = () =>
											messageGenerator.setErrorMessage('ALEAST_ONE_DEPARTMENT')
										callback()
									}
								}}
							/>
						),
						add: null,
					})
				})
			}
		})
		return rows
	}
	unfold = (id) => {
		if (!this.state.unFoldBranches.includes(id)) {
			this.state.unFoldBranches.push(id)
			this.setState({})
		}
	}
	fold = (id) => {
		this.setState({
			unFoldBranches: this.state.unFoldBranches.filter(
				(branch_id) => branch_id != id
			),
		})
	}
	changeFold = (id) => {
		if (this.state.unFoldBranches.includes(id)) {
			this.fold(id)
		} else {
			this.unfold(id)
		}
	}
	addBranch = (e) => {
		const { locale } = this.context
		apiHelper.transferredLocationApiAgent
			.editTransferredLocation({
				type: 'add branch',
				data: {
					name: locale.texts.NEW_BRANCH,
					departmentName: locale.texts.NEW_DEPARTMENT,
				},
			})
			.then((res) => {
				this.getTransferredLocation()
			})
	}
	renameBranchToState = (branch_id, e) => {
		const newName = e.target.value
		this.state.transferredLocationOptions.map((branch) => {
			if (branch.id == branch_id) {
				branch.branch_name = newName
			}
		})
		this.setState({})
	}
	renameBranchToBackend = (branch_id, e) => {
		const newName = e.target.value

		apiHelper.transferredLocationApiAgent
			.editTransferredLocation({
				type: 'rename branch',
				data: {
					branch_id,
					name: newName,
				},
			})
			.then((res) => {
				this.getTransferredLocation()
			})
	}
	removeBranch = (branch_id) => {
		apiHelper.transferredLocationApiAgent
			.editTransferredLocation({
				type: 'remove branch',
				data: {
					branch_id,
				},
			})
			.then((res) => {
				this.getTransferredLocation()
			})
	}
	addDepartment = (branch_id) => {
		const { locale } = this.context

		apiHelper.transferredLocationApiAgent
			.editTransferredLocation({
				type: 'add department',
				data: {
					branch_id,
					name: locale.texts.NEW_DEPARTMENT,
				},
			})
			.then((res) => {
				this.getTransferredLocation()
			})
	}
	renameDepartmentToState = (branch_id, index, e) => {
		const newName = e.target.value
		this.state.transferredLocationOptions.map((branch) => {
			if (branch.id == branch_id) {
				branch.department[index] = newName
			}
		})
		this.setState({})
	}
	renameDepartmentToBackend = (branch_id, index, e) => {
		const newName = e.target.value

		apiHelper.transferredLocationApiAgent
			.editTransferredLocation({
				type: 'rename department',
				data: {
					branch_id,
					departmentIndex: index,
					name: newName,
				},
			})
			.then((res) => {
				this.getTransferredLocation()
			})
	}
	removeDepartment = (branch_id, departmentIndex) => {
		apiHelper.transferredLocationApiAgent
			.editTransferredLocation({
				type: 'remove department',
				data: {
					branch_id,
					departmentIndex,
				},
			})
			.then((res) => {
				this.getTransferredLocation()
			})
	}

	handleClick = (e) => {
		const { name } = e.target

		switch (name) {
			case ADD:
				this.setState({
					showForm: true,
				})
		}
	}

	handleClose = () => {
		this.setState({
			showForm: false,
		})
	}

	handleSubmit = (values) => {
		apiHelper.transferredLocationApiAgent
			.editLocation({
				name: values.name.value,
				departmentName: values.department,
			})
			.then((res) => {
				const callback = () => {
					messageGenerator.setSuccessMessage(SAVE_SUCCESS)
				}
				this.getTransferredLocation(callback)
			})
			.catch((err) => {
				console.log(`add location failed ${err}`)
			})
	}

	render() {
		const { locale } = this.context

		const { branchOptions, data, columns } = this.state

		return (
			<div>
				<div className="d-flex justify-content-end">
					<PrimaryButton onClick={this.handleClick} name={ADD}>
						{locale.texts.ADD}
					</PrimaryButton>
				</div>
				<hr />

				<ReactTable
					data={data}
					columns={columns}
					resizable={true}
					freezeWhenExpanded={false}
					{...styleConfig.reactTable}
				/>
				<EditBranchForm
					show={this.state.showForm}
					handleClose={this.handleClose}
					handleSubmit={this.handleSubmit}
					title={locale.texts.CREATE_LOCATION}
					branchOptions={branchOptions}
				/>
			</div>
		)
	}
}

export default TranferredLocationManagement
