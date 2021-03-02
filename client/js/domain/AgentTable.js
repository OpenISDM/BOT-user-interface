import React, { Fragment } from 'react'
import { ButtonToolbar } from 'react-bootstrap'
import { keyBy } from 'lodash'
import { agentTableColumn } from '../config/tables'
import { AppContext } from '../context/AppContext'
import DeleteConfirmationForm from './DeleteConfirmationForm'
import { setSuccessMessage } from '../helper/messageGenerator'
import AccessControl from './AccessControl'
import EditGatewayForm from './EditGatewayForm'
import API from '../api'
import { formatTime } from '../helper/utilities'
import SelectTable from '../components/SelectTable'
import Table from '../components/Table'
import Button from '../components/Button'
import { SET_TABLE_SELECTION } from '../reducer/action'
import { DELETE } from '../config/wordMap'
class AgentTable extends React.Component {
	static contextType = AppContext

	state = {
		locale: this.context.locale.abbr,
		data: [],
		dataMap: {},
		showDeleteConfirmation: false,
		showEdit: false,
	}

	componentDidUpdate = (prevProps, prevState) => {
		const { locale } = this.context
		if (locale.abbr !== prevState.locale) {
			this.getData()
		}
	}

	componentDidMount = () => {
		this.getData()
	}

	getData = async (callback) => {
		const { locale, stateReducer } = this.context
		const [, dispatch] = stateReducer
		const res = await API.Agent.getAllAgents()

		if (res) {
			const data = res.data.map((row) => {
				row.last_report_timestamp = formatTime(row.last_report_timestamp)
				row.registered_timestamp = formatTime(row.registered_timestamp)
				return row
			})

			const dataMap = keyBy(data, 'id')

			this.setState(
				{
					data,
					dataMap,
					locale: locale.abbr,
					showDeleteConfirmation: false,
					showEdit: false,
				},
				callback
			)
		}

		dispatch({
			type: SET_TABLE_SELECTION,
			value: [],
		})
	}

	handleClose = () => {
		this.setState({
			showDeleteConfirmation: false,
			showEdit: false,
		})
	}
	switchSelectionMode = () => {
		const [, dispatch] = this.context.stateReducer
		const { isMultiSelection } = this.state

		this.setState({
			isMultiSelection: !isMultiSelection,
		})
		dispatch({
			type: SET_TABLE_SELECTION,
			value: [],
		})
	}
	handleSubmitForm = async ({ id, comment }) => {
		const res = await API.Agent.editAgent({
			id,
			comment,
		})
		if (res) {
			this.getData(() => setSuccessMessage('save success'))
		}
	}
	handleDeleteAction = () => {
		const { locale, stateReducer } = this.context
		const [{ tableSelection }] = stateReducer

		if (tableSelection.length > 0) {
			this.setState({
				action: DELETE,
				showDeleteConfirmation: true,
				message: locale.texts.ARE_YOU_SURE_TO_DELETE,
			})
		}
	}

	deleteRecordGateway = async () => {
		const [{ tableSelection }] = this.context.stateReducer

		const ids = tableSelection.map((id) => id)
		await API.Agent.deleteAgent({
			ids,
		})
		this.switchSelectionMode()
		this.getData(() => setSuccessMessage('save success'))
	}

	render() {
		const { locale, stateReducer } = this.context
		const [{ tableSelection = [] }] = stateReducer
		const { selectedRowData } = this.state

		return (
			<Fragment>
				<div className="d-flex justify-content-end">
					<AccessControl platform={['browser', 'tablet']}>
						<ButtonToolbar>
							{this.state.isMultiSelection ? (
								<>
									<Button
										theme={'danger'}
										disableDebounce={true}
										pressed={tableSelection.length > 0}
										name={DELETE}
										onClick={this.handleDeleteAction}
										text={locale.texts.DELETE}
									/>
									<Button
										disableDebounce={true}
										pressed={true}
										name={DELETE}
										onClick={this.switchSelectionMode}
										text={locale.texts.CANCEL}
									/>
								</>
							) : (
								<Button
									disableDebounce={true}
									pressed={true}
									name={DELETE}
									text={locale.texts.DELETE}
									onClick={this.switchSelectionMode}
								/>
							)}
							{/* <PrimaryButton
								className="mb-1 text-capitalize mr-2"
								onClick={() => {
									this.setState({
										showDeleteConfirmation: true,
									})
								}}
								disabled={tableSelection.length === 0}
							>
								{locale.texts.DELETE}
							</PrimaryButton> */}
						</ButtonToolbar>
					</AccessControl>
				</div>
				<hr />
				{this.state.isMultiSelection ? (
					<SelectTable data={this.state.data} columns={agentTableColumn} />
				) : (
					<Table
						data={this.state.data}
						columns={agentTableColumn}
						onClickCallback={(selectedRowData) => {
							if (selectedRowData) {
								this.setState({
									selectedRowData,
									showEdit: true,
								})
							}
						}}
					/>
				)}

				<EditGatewayForm
					show={this.state.showEdit}
					title="add comment"
					selectedObjectData={selectedRowData}
					handleSubmit={this.handleSubmitForm}
					handleClose={this.handleClose}
				/>
				<DeleteConfirmationForm
					show={this.state.showDeleteConfirmation}
					handleClose={this.handleClose}
					handleSubmit={this.deleteRecordGateway}
					message={this.state.message}
				/>
			</Fragment>
		)
	}
}

export default AgentTable
