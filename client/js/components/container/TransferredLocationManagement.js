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
import { PrimaryButton } from '../BOTComponent/styleComponent'
import EditBranchForm from '../presentational/form/EditBranchForm'
import DeleteAlertModal from '../presentational/DeleteAlertModal'
import { ADD, DELETE, SAVE_SUCCESS } from '../../config/wordMap'
import BOTSelectTable from '../BOTComponent/BOTSelectTable'

class TranferredLocationManagement extends React.Component {
	static contextType = AppContext

	state = {
		data: [],
		branchOptions: [],
		showAddForm: false,
		showDeleteModal: false,
	}

	componentDidMount = () => {
		this.getTransferredLocation()
	}

	getTransferredLocation = async (callback) => {
		const res = await apiHelper.transferredLocationApiAgent.getAll()
		const branchOptionsMap = {}
		const data = []

		res.data.forEach((obj) => {
			branchOptionsMap[obj.name] = {
				label: obj.name,
				value: obj.name,
			}

			data.push({
				id: obj.id,
				name: obj.name,
				department: obj.department,
			})
		})

		this.setState(
			{
				data,
				branchOptions: Object.values(branchOptionsMap),
				showAddForm: false,
				showDeleteModal: false,
			},
			callback
		)
	}

	handleButtonClick = (e) => {
		const { name } = e.target
		switch (name) {
			case ADD:
				this.setState({
					showAddForm: true,
				})
				break
			case DELETE:
				this.setState({
					showDeleteModal: true,
				})
				break
		}
	}

	handleClose = (e) => {
		const { name } = e.target
		switch (name) {
			case ADD:
				this.setState({
					showAddForm: false,
				})
				break
			case DELETE:
				this.setState({
					showDeleteModal: false,
				})
				break
		}
	}

	handleAddSubmit = async (values) => {
		try {
			await apiHelper.transferredLocationApiAgent.addOne({
				name: values.name.value,
				department: values.department,
			})
			const callback = () => {
				messageGenerator.setSuccessMessage(SAVE_SUCCESS)
			}
			this.getTransferredLocation(callback)
		} catch (e) {
			console.log(`add location failed ${e}`)
		}
	}

	handleRemoveSubmit = async () => {
		const { stateReducer } = this.context
		const [{ tableSelection = [] }] = stateReducer
		try {
			await apiHelper.transferredLocationApiAgent.removeByIds({
				branchIds: tableSelection,
			})
			const callback = () => {
				messageGenerator.setSuccessMessage(SAVE_SUCCESS)
			}
			this.getTransferredLocation(callback)
		} catch (e) {
			console.log(`remove locations failed ${e}`)
		}
	}

	render() {
		const { locale, stateReducer } = this.context
		const { branchOptions, data } = this.state
		const [{ tableSelection = [] }] = stateReducer

		return (
			<div>
				<div className="d-flex justify-content-start">
					<PrimaryButton onClick={this.handleButtonClick} name={ADD}>
						{locale.texts.ADD}
					</PrimaryButton>
					<PrimaryButton
						onClick={this.handleButtonClick}
						name={DELETE}
						disabled={tableSelection.length === 0}
					>
						{locale.texts.REMOVE}
					</PrimaryButton>
				</div>
				<hr />
				<BOTSelectTable data={data} columns={TransferredLocationColumn} />
				<EditBranchForm
					show={this.state.showAddForm}
					actionName={ADD}
					handleClose={this.handleClose}
					handleSubmit={this.handleAddSubmit}
					title={locale.texts.CREATE_LOCATION}
					branchOptions={branchOptions}
				/>
				<DeleteAlertModal
					show={this.state.showDeleteModal}
					actionName={DELETE}
					handleClose={this.handleClose}
					handleSubmit={this.handleRemoveSubmit}
					title={locale.texts.ARE_YOU_SURE_TO_DELETE}
				/>
			</div>
		)
	}
}

export default TranferredLocationManagement
