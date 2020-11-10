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

import React, { Fragment } from 'react'
import ReactTable from 'react-table'
import { shiftChangeRecordTableColumn } from '../../config/tables'
import { AppContext } from '../../context/AppContext'
import styleConfig from '../../config/styleConfig'
import apiHelper from '../../helper/apiHelper'
import config from '../../config'
import { JSONClone, formatTime } from '../../helper/utilities'

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
			const columns = JSONClone(shiftChangeRecordTableColumn)
			columns.forEach((field) => {
				field.Header =
					locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
			})

			const data = res.data.rows
			data.forEach((item) => {
				item.shift =
					item.shift &&
					locale.texts[item.shift.toUpperCase().replace(/ /g, '_')]
				item.submit_timestamp = formatTime(item.submit_timestamp)
			})

			this.setState({
				data: res.data.rows,
				columns,
				locale: locale.abbr,
			})
		}
	}

	render() {
		return (
			<Fragment>
				<div className="mb-2">
					<ReactTable
						keyField="id"
						data={this.state.data}
						columns={this.state.columns}
						className="-highlight text-none"
						style={{ maxHeight: '75vh' }}
						{...styleConfig.reactTable}
						getTrProps={(state, rowInfo) => {
							return {
								onClick: () => {
									apiHelper.fileApiAgent.getFile({
										path: rowInfo.original.file_path,
									})
								},
							}
						}}
					/>
				</div>
			</Fragment>
		)
	}
}

export default ShiftChangeHistoricalRecord
