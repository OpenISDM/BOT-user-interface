/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        BOTTable.js

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
import ReactTable from 'react-table'
import { AppContext } from '../../context/AppContext'
import styleConfig from '../../config/styleConfig'
import { JSONClone } from '../../helper/utilities'
import PropTypes from 'prop-types'

const BOTTable = ({ data, columns }) => {
	const { locale } = React.useContext(AppContext)

	const newColumns = JSONClone(columns)
	newColumns.forEach((field) => {
		field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
	})

	return (
		<ReactTable
			{...styleConfig.reactTable}
			columns={newColumns}
			data={data}
			pageSize={data.length}
			resizable={true}
			freezeWhenExpanded={false}
			showPagination={false}
		/>
	)
}

BOTTable.propTypes = {
	data: PropTypes.array.isRequired,
	columns: PropTypes.array.isRequired,
}

export default BOTTable
