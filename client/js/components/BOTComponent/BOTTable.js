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

import React, { useContext, useState } from 'react'
import ReactTable from 'react-table'
import { AppContext } from '../../context/AppContext'
import styleConfig from '../../config/styleConfig'
import { JSONClone } from '../../helper/utilities'
import PropTypes from 'prop-types'

import 'react-table/react-table.css'
import 'react-tabs/style/react-tabs.css'

const BOTTable = ({ data, columns, onClickCallback, style }) => {
	const { locale } = useContext(AppContext)
	const [selected, setSelected] = useState(null)
	const [hovered, setHovered] = useState(null)

	const newColumns = JSONClone(columns)
	newColumns.forEach((field) => {
		field.headerStyle = {
			textAlign: 'left',
			textTransform: 'capitalize',
		}
		if (field.accessor === '_id') {
			field.headerStyle = {
				textAlign: 'center',
			}
		}
		field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
	})

	return (
		<ReactTable
			{...styleConfig.reactTable}
			style={style}
			columns={newColumns}
			data={data}
			pageSize={15}
			showPagination={true}
			showPaginationTop={true}
			resizable={true}
			freezeWhenExpanded={false}
			getTrProps={(state, rowInfo) => {
				let canClick = {}
				if (onClickCallback) {
					canClick = {
						onClick: () => {
							if (rowInfo.index === selected) {
								setSelected(null)
							} else {
								setSelected(rowInfo.index)
							}
							onClickCallback(rowInfo.original)
						},
					}
				}

				if (rowInfo && rowInfo.row) {
					return {
						...canClick,
						onMouseEnter: () => {
							setHovered(rowInfo.index)
						},
						onMouseLeave: () => {
							setHovered(null)
						},
						style: {
							background:
								rowInfo && rowInfo.index === selected
									? '#b3daff'
									: rowInfo.index === hovered
									? '#b3daff'
									: 'white',
							color: rowInfo && rowInfo.index === selected ? 'white' : 'black',
						},
					}
				}
				return {} // WORKAROUND: must have a empty object to return
			}}
		/>
	)
}

BOTTable.propTypes = {
	data: PropTypes.array.isRequired,
	columns: PropTypes.array.isRequired,
	onClickCallback: PropTypes.func,
	pageSize: PropTypes.number.isRequired,
	style: PropTypes.object.isRequired,
}

export default BOTTable
