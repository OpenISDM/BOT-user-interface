import React, { Fragment } from 'react'
import { ButtonToolbar } from 'react-bootstrap'
import { AppContext } from '../context/AppContext'
import DeleteConfirmationForm from '../domain/DeleteConfirmationForm'
import AccessControl from '../domain/AccessControl'
import { setSuccessMessage } from '../helper/messageGenerator'
import { formatTime } from '../helper/utilities'
import SelectTable from './SelectTable'
import { SET_TABLE_SELECTION } from '../reducer/action'
import Button from './Button'
import { DELETE } from '../config/wordMap'
import Table from './Table'
import EditSettingForm from './EditSettingForm'
import PropTypes from 'prop-types'
import API from '../api'
class SettingTable extends React.Component {
	static contextType = AppContext

	state = {
		locale: this.context.locale.abbr,
		data: [],
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
		const { objectApiMode } = this.props
		const res = await API.Setting.getTable({
			locale: locale.code,
			mode: objectApiMode,
		})
		if (res) {
			const data = res.data.map((row) => {
				row.last_report_timestamp = formatTime(row.last_report_timestamp)
				row.registered_timestamp = formatTime(row.registered_timestamp)
				return row
			})
			this.setState(
				{
					data,
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

	handleSubmitForm = async (formOption) => {
		const { objectApiMode } = this.props
		const res = await API.Setting.put({ formOption, mode: objectApiMode })
		if (res) {
			this.getData(() => setSuccessMessage('save success'))
		}
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

	deleteRecord = async () => {
		const [{ tableSelection }] = this.context.stateReducer
		const { objectApiMode } = this.props
		const ids = tableSelection.map((id) => id)

		await API.Setting.delete({ ids, mode: objectApiMode })
		this.switchSelectionMode()
		this.getData(() => setSuccessMessage('save success'))
	}

	render() {
		const { locale, stateReducer } = this.context
		const [{ tableSelection = [] }] = stateReducer
		const { selectedRowData, isMultiSelection, data } = this.state
		const {
			columns,
			isShowDescription = true,
			isShowUUID = true,
			formTitle = '',
		} = this.props

		return (
			<>
				<div className="d-flex justify-content-end">
					<AccessControl platform={['browser', 'tablet']}>
						<ButtonToolbar>
							{isMultiSelection ? (
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
				{isMultiSelection ? (
					<SelectTable data={data} columns={columns} />
				) : (
					<Table
						data={data}
						columns={columns}
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
					title={formTitle}
					selectedObjectData={selectedRowData}
					handleSubmit={this.handleSubmitForm}
					handleClose={this.handleClose}
					isShowDescription={isShowDescription}
					isShowUUID={isShowUUID}
				/>
				<DeleteConfirmationForm
					show={this.state.showDeleteConfirmation}
					handleClose={this.handleClose}
					handleSubmit={this.deleteRecord}
					message={this.state.message}
				/>
			</>
		)
	}
}

SettingTable.propTypes = {
	columns: PropTypes.array.isRequired,
	objectApiMode: PropTypes.string.isRequired,
	isShowUUID: PropTypes.bool,
	isShowDescription: PropTypes.bool,
	formTitle: PropTypes.string.isRequired,
}

export default SettingTable
