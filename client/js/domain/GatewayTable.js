import React, { Fragment } from 'react'
import { ButtonToolbar } from 'react-bootstrap'
import { keyBy } from 'lodash'
import { gatewayTableColumn } from '../config/tables'
import { AppContext } from '../context/AppContext'
import DeleteConfirmationForm from './DeleteConfirmationForm'
import { setSuccessMessage } from '../helper/messageGenerator'
import Button from '../components/Button'
import AccessControl from './AccessControl'
import API from '../api'
import { formatTime } from '../helper/utilities'
import SelectTable from '../components/SelectTable'
import Table from '../components/Table'
import { SET_TABLE_SELECTION } from '../reducer/action'
import { DELETE } from '../config/wordMap'
import EditSettingForm from '../components/editSettingForm'
class GatewayTable extends React.Component {
	static contextType = AppContext

	state = {
		locale: this.context.locale.abbr,
		data: [],
		dataMap: {},
		showDeleteConfirmation: false,
		showEdit: false,
		isMultiSelection: false,
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
		const res = await API.Gateway.getGatewayTable({
			locale: locale.code,
		})

		if (res) {
			const data = res.data.rows.map((row) => {
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

	handleSubmitForm = async (formOption) => {
		const res = await API.Gateway.putGateway({
			formOption,
		})
		if (res) {
			this.getData(() => setSuccessMessage('save success'))
		}
	}

	deleteRecordGateway = async () => {
		const [{ tableSelection }] = this.context.stateReducer

		const ids = tableSelection.map((id) => id)
		await API.Gateway.deleteGateway({
			ids,
		})
		this.switchSelectionMode()
		this.getData(() => setSuccessMessage('save success'))
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
						</ButtonToolbar>
					</AccessControl>
				</div>
				<hr />
				{this.state.isMultiSelection ? (
					<SelectTable data={this.state.data} columns={gatewayTableColumn} />
				) : (
					<Table
						data={this.state.data}
						columns={gatewayTableColumn}
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

				<EditSettingForm
					show={this.state.showEdit}
					title="add comment"
					selectedObjectData={selectedRowData}
					handleSubmit={this.handleSubmitForm}
					handleClose={this.handleClose}
					isShowDescription={false}
					isShowUUID={false}
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

export default GatewayTable
