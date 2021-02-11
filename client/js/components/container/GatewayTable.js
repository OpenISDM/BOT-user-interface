import React, { Fragment } from 'react'
import { ButtonToolbar } from 'react-bootstrap'
import { keyBy } from 'lodash'
import { gatewayTableColumn } from '../../config/tables'
import { AppContext } from '../../context/AppContext'
import DeleteConfirmationForm from '../presentational/DeleteConfirmationForm'
import { setSuccessMessage } from '../../helper/messageGenerator'
import { PrimaryButton } from '../BOTComponent/styleComponent'
import AccessControl from '../authentication/AccessControl'
import EditGatewayForm from '../presentational/form/EditGatewayForm'
import API from '../../api'
import { formatTime } from '../../helper/utilities'
import BOTSelectTable from '../BOTComponent/BOTSelectTable'
import { SET_TABLE_SELECTION } from '../../reducer/action'

class GatewayTable extends React.Component {
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

		this.getData(() => setSuccessMessage('save success'))
	}

	render() {
		const { locale, stateReducer } = this.context
		const [{ tableSelection = [] }] = stateReducer
		const { dataMap } = this.state
		const selectedData = dataMap[tableSelection[0]]

		return (
			<Fragment>
				<div className="d-flex justify-content-start">
					<AccessControl platform={['browser', 'tablet']}>
						<ButtonToolbar>
							<PrimaryButton
								className="mb-1 text-capitalize mr-2"
								onClick={() => {
									this.setState({
										showDeleteConfirmation: true,
									})
								}}
								disabled={tableSelection.length === 0}
							>
								{locale.texts.DELETE}
							</PrimaryButton>
						</ButtonToolbar>
					</AccessControl>
				</div>
				<hr />
				<BOTSelectTable
					data={this.state.data}
					columns={gatewayTableColumn}
					onClickCallback={() => {
						this.setState({
							showEdit: true,
						})
					}}
				/>
				<EditGatewayForm
					show={this.state.showEdit}
					title="add comment"
					selectedObjectData={selectedData}
					handleSubmit={this.handleSubmitForm}
					handleClose={this.handleClose}
				/>
				<DeleteConfirmationForm
					show={this.state.showDeleteConfirmation}
					handleClose={this.handleClose}
					handleSubmit={this.deleteRecordGateway}
				/>
			</Fragment>
		)
	}
}

export default GatewayTable
