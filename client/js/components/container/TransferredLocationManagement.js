import React from 'react'
import { AppContext } from '../../context/AppContext'
import { TransferredLocationColumn } from '../../config/tables'
import messageGenerator from '../../helper/messageGenerator'
import apiHelper from '../../helper/apiHelper'
import { PrimaryButton } from '../BOTComponent/styleComponent'
import EditTransferLocationForm from '../presentational/form/EditTransferLocationForm'
import DeleteAlertModal from '../presentational/DeleteAlertModal'
import { ADD, DELETE, SAVE_SUCCESS } from '../../config/wordMap'
import BOTSelectTable from '../BOTComponent/BOTSelectTable'
import { SET_TABLE_SELECTION } from '../../reducer/action'

class TranferredLocationManagement extends React.Component {
	static contextType = AppContext

	state = {
		data: [],
		locationOptions: [],
		showAddForm: false,
		showDeleteModal: false,
	}

	componentDidMount = () => {
		this.getTransferredLocation()
	}

	getTransferredLocation = async (callback) => {
		const { stateReducer } = this.context
		const [, dispatch] = stateReducer
		const res = await apiHelper.transferredLocationApiAgent.getAll()
		const locationOptionsMap = {}
		const data = []

		res.data.forEach((obj) => {
			locationOptionsMap[obj.name] = {
				label: obj.name,
				value: obj.name,
			}

			data.push({
				id: obj.id,
				name: obj.name,
				department: obj.department,
			})
		})

		dispatch({
			type: SET_TABLE_SELECTION,
			value: [],
		})

		this.setState(
			{
				data,
				locationOptions: Object.values(locationOptionsMap),
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
		const [{ tableSelection }] = stateReducer
		try {
			await apiHelper.transferredLocationApiAgent.removeByIds({
				transferLocationIds: tableSelection,
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
		const { locationOptions, data } = this.state
		const [{ tableSelection }] = stateReducer

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
				<EditTransferLocationForm
					show={this.state.showAddForm}
					actionName={ADD}
					handleClose={this.handleClose}
					handleSubmit={this.handleAddSubmit}
					title={locale.texts.CREATE_LOCATION}
					locationOptions={locationOptions}
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
