/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        ShiftChangeHistoricalRecord.js

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
import { shiftChangeRecordTableColumn } from '../../config/tables'
import { AppContext } from '../../context/AppContext'
import apiHelper from '../../helper/apiHelper'
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

		const res = await apiHelper.record.getRecord(
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
				columns={shiftChangeRecordTableColumn}
				style={{ maxHeight: '75vh' }}
				onClickCallback={this.handleOnClick}
			/>
		)
	}
}

export default ShiftChangeHistoricalRecord
