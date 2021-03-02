import React, { Fragment } from 'react'
import { ButtonToolbar } from 'react-bootstrap'
import { keyBy } from 'lodash'
import { lbeaconTableColumn } from '../config/tables'
import { AppContext } from '../context/AppContext'
import DeleteConfirmationForm from './DeleteConfirmationForm'
import AccessControl from './AccessControl'
import { setSuccessMessage } from '../helper/messageGenerator'
import API from '../api'
import { formatTime } from '../helper/utilities'
import SelectTable from '../components/SelectTable'
import { SET_TABLE_SELECTION } from '../reducer/action'
import Button from '../components/Button'
import { DELETE } from '../config/wordMap'
import Table from '../components/Table'
import EditSettingForm from './editSettingForm'
class LbeaconTable extends React.Component {
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
		const res = await API.Lbeacon.getLbeaconTable({
			locale: locale.code,
		})

		if (res) {
			const data = res.data.rows.map((row) => {
				row.last_report_timestamp = formatTime(row.last_report_timestamp)
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

	handleSubmitForm = async (formOption) => {
		console.log(formOption)
		const res = await API.Lbeacon.putLbeacon({ formOption })
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

		const ids = tableSelection.map((id) => id)
		await API.Lbeacon.deleteLbeacon({ ids })
		this.switchSelectionMode()
		this.getData(() => setSuccessMessage('save success'))
	}

	render() {
		const { locale, stateReducer } = this.context
		const [{ tableSelection = [] }] = stateReducer
		const { selectedRowData, isMultiSelection, data } = this.state

		return (
			<Fragment>
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
					<SelectTable data={data} columns={lbeaconTableColumn} />
				) : (
					<Table
						data={data}
						columns={lbeaconTableColumn}
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
					title={'edit lbeacon'}
					selectedObjectData={selectedRowData}
					handleSubmit={this.handleSubmitForm}
					handleClose={this.handleClose}
				/>
				<DeleteConfirmationForm
					show={this.state.showDeleteConfirmation}
					handleClose={this.handleClose}
					handleSubmit={this.deleteRecord}
					message={this.state.message}
				/>
			</Fragment>
		)
	}
}

export default LbeaconTable
