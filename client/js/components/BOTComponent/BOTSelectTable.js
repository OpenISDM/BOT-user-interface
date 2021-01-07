/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        BOTSelectTable.js

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
import selecTableHOC from 'react-table/lib/hoc/selectTable'
import { AppContext } from '../../context/AppContext'
import styleConfig from '../../config/styleConfig'
import { SET_TABLE_SELECTION } from '../../reducer/action'
import { JSONClone } from '../../helper/utilities'
import PropTypes from 'prop-types'

const SelectTable = selecTableHOC(ReactTable)

class BOTSelectTable extends React.Component {
	static contextType = AppContext

	state = {
		locale: this.context.locale.abbr,
		data: [],
		columns: [],
		currentSelectedRow: {},
		selectAll: false,
	}

	componentDidMount = () => {
		const { stateReducer } = this.context
		const [, dispatch] = stateReducer

		dispatch({
			type: SET_TABLE_SELECTION,
			value: [],
		})
	}

	isSelected = (key) => {
		const { stateReducer } = this.context
		const [{ tableSelection }] = stateReducer
		return tableSelection.includes(key)
	}

	toggleSelection = (key) => {
		const { stateReducer } = this.context
		const [{ tableSelection }, dispatch] = stateReducer
		let selection = [...tableSelection]

		key = key.split('-')[1] ? key.split('-')[1] : key

		const keyIndex = selection.indexOf(key)
		if (keyIndex >= 0) {
			selection = [
				...selection.slice(0, keyIndex),
				...selection.slice(keyIndex + 1),
			]
		} else {
			selection.push(key)
		}

		dispatch({
			type: SET_TABLE_SELECTION,
			value: selection,
		})
	}

	toggleAll = () => {
		const { stateReducer } = this.context
		const [, dispatch] = stateReducer

		let selection = []
		let rowsCount = 0

		const selectAll = !this.state.selectAll
		if (selectAll) {
			const wrappedInstance = this.selectTable.getWrappedInstance()
			const currentRecords = wrappedInstance.getResolvedState().sortedData
			currentRecords.forEach((item) => {
				rowsCount++
				if (
					rowsCount >
						wrappedInstance.state.pageSize * wrappedInstance.state.page &&
					rowsCount <=
						wrappedInstance.state.pageSize +
							wrappedInstance.state.pageSize * wrappedInstance.state.page
				) {
					selection.push(item._original.id)
				}
			})
		} else {
			selection = []
		}

		this.setState({ selectAll })

		dispatch({
			type: SET_TABLE_SELECTION,
			value: selection,
		})
	}

	render() {
		const { stateReducer } = this.context
		const [{ tableSelection }] = stateReducer
		const { locale } = this.context
		const { data, onClickCallback = () => {} } = this.props

		const { toggleSelection, toggleAll, isSelected } = this
		const extraProps = {
			selectAll:
				data && data.length > 0 && tableSelection.length === data.length,
			isSelected,
			toggleAll,
			toggleSelection,
		}

		const columns = JSONClone(this.props.columns)
		columns.forEach((field) => {
			field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
		})

		return (
			<SelectTable
				{...extraProps}
				{...styleConfig.reactTable}
				keyField="id"
				data={data}
				columns={columns}
				ref={(r) => (this.selectTable = r)}
				className="-highlight text-none"
				style={{ maxHeight: '80vh' }}
				onPageChange={() => null}
				onSortedChange={() => null}
				NoDataComponent={() => null}
				showPagination={false}
				pageSize={data.length}
				getTrProps={(state, rowInfo) => {
					return {
						onClick: (e) => {
							if (!e.target.type) {
								this.setState({
									currentSelectedRow: rowInfo.original,
								})
								this.toggleSelection(rowInfo.original.id)
								onClickCallback(rowInfo.original)
							}
						},
					}
				}}
			/>
		)
	}
}

BOTSelectTable.propTypes = {
	data: PropTypes.array.isRequired,
	columns: PropTypes.array.isRequired,
	onClickCallback: PropTypes.func.isRequired,
}

export default BOTSelectTable
