import React from 'react'
import { shiftChangeRecordTableColumn } from '../../config/tables'
import { AppContext } from '../../context/AppContext'
import API from '../../api'
import config from '../../config'
import { formatTime } from '../../helper/utilities'
import messageGenerator from '../../helper/messageGenerator'
import BOTTable from '../BOTComponent/BOTTable'
class ShiftChangeHistoricalRecord extends React.Component {
	static contextType = AppContext

	state = {
		data: [],
		columns: [],
		locale: this.context.locale.abbr,
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (this.context.locale.abbr !== prevState.locale) {
			this.getData()
		}
	}

	componentDidMount = () => {
		this.getData()
	}

	getData = async () => {
		const { locale } = this.context

		const res = await API.Record.getRecord(
			config.RECORD_TYPE.SHIFT_CHANGE,
			locale.abbr
		)

		if (res) {
			const data = res.data.rows.map((item) => {
				item.shift =
					item.shift &&
					locale.texts[item.shift.toUpperCase().replace(/ /g, '_')]
				item.submit_timestamp = formatTime(item.submit_timestamp)
				return item
			})

			this.setState({
				data,
				locale: locale.abbr,
			})
		}
	}

	handleOnClick = async (original) => {
		const { locale } = this.context
		if (original.file_path) {
			await API.File.getFile({
				path: original.file_path,
			})
		} else {
			messageGenerator.setErrorMessage(locale.texts.FILE_URL_NOT_FOUND, 2000)
		}
	}

	render() {
		return (
			<BOTTable
				data={this.state.data}
				columns={shiftChangeRecordTableColumn}
				style={{ maxHeight: '75vh' }}
				onClickCallback={this.handleOnClick}
			/>
		)
	}
}

export default ShiftChangeHistoricalRecord
