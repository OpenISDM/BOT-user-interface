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
import DeleteBranchForm from '../presentational/form/DeleteBranchForm'
import { ADD, DELETE, SAVE_SUCCESS } from '../../config/wordMap'
import selecTableHOC from 'react-table/lib/hoc/selectTable'

const SelectTable = selecTableHOC(ReactTable)
class TranferredLocationManagement extends React.Component {
	static contextType = AppContext

	state = {
		transferredLocationOptions: [],
		unFoldBranches: [],
		data: [],
		columns: [],
		branchOptions: [],
		showAddForm: false,
		showDeleteModal: false,
		selectAll: false,
		selection: [],
	}

	componentDidMount = () => {
		this.getTransferredLocation()
	}

	getTransferredLocation = async (callback) => {
		const { locale } = this.context

		try {
			const res = await apiHelper.transferredLocationApiAgent.getAll()
			const columns = JSONClone(TransferredLocationColumn)
			const branchOptionsMap = {}
			const data = []

			columns.forEach((field) => {
				field.Header =
					locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
			})

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
					columns,
					branchOptions: Object.values(branchOptionsMap),
					showAddForm: false,
					showDeleteModal: false,
					selection: [],
				},
				callback
			)
		} catch (e) {
			console.log(e)
		}
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
		const branchIds = this.state.selection
		try {
			await apiHelper.transferredLocationApiAgent.removeByIds({
				branchIds,
			})
			const callback = () => {
				messageGenerator.setSuccessMessage(SAVE_SUCCESS)
			}
			this.getTransferredLocation(callback)
		} catch (e) {
			console.log(`remove locations failed ${e}`)
		}
	}

	toggleSelection = (key) => {
		let selection = [...this.state.selection]
		key = parseInt(key.split('-')[1] ? key.split('-')[1] : key)
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
		return this.state.selection.includes(parseInt(key))
	}

	render() {
		const { locale } = this.context
		const { branchOptions, selectAll, data, columns } = this.state
		const { toggleSelection, toggleAll, isSelected } = this
		const extraProps = {
			selectAll,
			isSelected,
			toggleAll,
			toggleSelection,
		}

		return (
			<div>
				<div className="d-flex justify-content-start">
					<PrimaryButton
						onClick={this.handleButtonClick}
						name={ADD}
						disabled={this.state.selection.length > 0}
					>
						{locale.texts.ADD}
					</PrimaryButton>
					<PrimaryButton
						onClick={this.handleButtonClick}
						name={DELETE}
						disabled={this.state.selection.length === 0}
					>
						{locale.texts.REMOVE}
					</PrimaryButton>
				</div>
				<hr />
				<SelectTable
					keyField="id"
					data={data}
					columns={columns}
					ref={(r) => (this.selectTable = r)}
					className="-highlight text-none"
					style={{ maxHeight: '70vh' }}
					onPageChange={() => {
						this.setState({ selectAll: false, selection: [] })
					}}
					onSortedChange={() => {
						this.setState({ selectAll: false, selection: [] })
					}}
					{...extraProps}
					{...styleConfig.reactTable}
					resizable={true}
					freezeWhenExpanded={false}
					pageSize={10}
					NoDataComponent={() => null}
				/>
				<EditBranchForm
					show={this.state.showAddForm}
					actionName={ADD}
					handleClose={this.handleClose}
					handleSubmit={this.handleAddSubmit}
					title={locale.texts.CREATE_LOCATION}
					branchOptions={branchOptions}
				/>
				<DeleteBranchForm
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
