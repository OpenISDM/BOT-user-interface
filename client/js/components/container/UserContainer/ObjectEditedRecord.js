/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        ObjectEditedRecord.js

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

import React, { Fragment } from 'react'
import ReactTable from 'react-table'
import { editObjectRecordTableColumn } from '../../../config/tables'
import { AppContext } from '../../../context/AppContext'
import styleConfig from '../../../config/styleConfig'
import apiHelper from '../../../helper/apiHelper'
import config from '../../../config'
import {
	JSONClone,
	formatTime,
	convertStatusToText,
} from '../../../helper/utilities'
import messageGenerator from '../../../helper/messageGenerator'

class ObjectEditedRecord extends React.Component {
	static contextType = AppContext

	state = {
		data: [],
		columns: [],
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
			const columns = JSONClone(editObjectRecordTableColumn)
			columns.forEach((field) => {
				field.Header =
					locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
			})

			const data = res.data.rows.map((item, index) => {
				item._id = index + 1
				item.new_status = convertStatusToText(locale, item.new_status)
				item.edit_time = formatTime(item.edit_time)
				return item
			})

			this.setState({
				data,
				columns,
				locale: locale.abbr,
			})
		}
	}

	render() {
		const { locale } = this.context

		return (
			<Fragment>
				<ReactTable
					keyField="_id"
					data={this.state.data}
					columns={this.state.columns}
					className="-highlight text-none"
					style={{ maxHeight: '75vh' }}
					{...styleConfig.reactTable}
					pageSize={100}
					getTrProps={(state, rowInfo) => {
						return {
							onClick: () => {
								if (rowInfo.original.file_path) {
									apiHelper.fileApiAgent.getFile({
										path: rowInfo.original.file_path,
									})
								} else {
									messageGenerator.setErrorMessage(
										locale.texts.FILE_URL_NOT_FOUND,
										2000
									)
								}
							},
						}
					}}
				/>
			</Fragment>
		)
	}
}

export default ObjectEditedRecord
