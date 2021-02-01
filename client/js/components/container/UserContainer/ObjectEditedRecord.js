import React from 'react'
import { editObjectRecordTableColumn } from '../../../config/tables'
import { AppContext } from '../../../context/AppContext'
import apiHelper from '../../../helper/apiHelper'
import config from '../../../config'
import { formatTime, convertStatusToText } from '../../../helper/utilities'
import messageGenerator from '../../../helper/messageGenerator'
import BOTTable from '../../BOTComponent/BOTTable'

class ObjectEditedRecord extends React.Component {
	static contextType = AppContext

	state = {
		data: [],
		locale: this.context.locale.abbr,
	}

	componentDidMount = () => {
		this.getData()
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (this.context.locale.abbr !== prevState.locale) {
			this.getData()
		}
	}

	getData = async () => {
		const { locale } = this.context
		const res = await apiHelper.record.getRecord(
			config.RECORD_TYPE.EDITED_OBJECT,
			locale.abbr
		)
		if (res) {
			const data = res.data.rows.map((item, index) => {
				item._id = index + 1
				item.new_status = convertStatusToText(locale, item.new_status)
				item.edit_time = formatTime(item.edit_time)
				return item
			})

			this.setState({
				data,
				locale: locale.abbr,
			})
		}
	}

	handleOnClickCallback = async (original) => {
		const { locale } = this.context
		if (original.file_path) {
			await apiHelper.fileApiAgent.getFile({
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
				columns={editObjectRecordTableColumn}
				style={{ maxHeight: '75vh' }}
				pageSize={100}
				onClickCallback={this.handleOnClickCallback}
			/>
		)
	}
}

export default ObjectEditedRecord
