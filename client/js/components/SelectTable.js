import React from 'react'
import ReactTable from 'react-table'
import selecTableHOC from 'react-table/lib/hoc/selectTable'
import { AppContext } from '../context/AppContext'
import styleConfig from '../config/styleConfig'
import { SET_TABLE_SELECTION } from '../reducer/action'
import { JSONClone } from '../helper/utilities'
import PropTypes from 'prop-types'

const RTBSSelectTable = selecTableHOC(ReactTable)

import 'react-table/react-table.css'

class SelectTable extends React.Component {
	static contextType = AppContext

	state = {
		locale: this.context.locale.abbr,
		data: [],
		columns: [],
		currentSelectedRow: {},
		currentHoveredRowIndex: null,
		selectAll: false,
	}

	componentDidMount = () => {
		this.clearSelection()
	}

	componentWillUnmount = () => {
		this.clearSelection()
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
		const selectAll = !this.state.selectAll
		if (selectAll) {
			const wrappedInstance = this.selectTable.getWrappedInstance()
			const currentRecords = wrappedInstance.getResolvedState().sortedData
			currentRecords.forEach((item) => {
				selection.push(item._original.id)
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

	clearSelection = () => {
		this.setState({ selectAll: false, currentSelectedRow: {} })

		const [, dispatch] = this.context.stateReducer
		dispatch({
			type: SET_TABLE_SELECTION,
			value: [],
		})
	}

	setHoveredRow = (currentHoveredRowIndex) => {
		this.setState({ currentHoveredRowIndex })
	}

	render() {
		const { locale } = this.context
		const {
			data,
			onClickCallback = () => {
				// do nothing.
			},
			onSortedChangeCallback = () => {
				// do nothing.
			},
			onPageChangeCallback = () => {
				// do nothing.
			},
			onMouseEnterCallback = () => {
				// do nothing.
			},
			onMouseLeaveCallback = () => {
				// do nothing.
			},
		} = this.props

		const { toggleSelection, toggleAll, isSelected } = this
		const extraProps = {
			selectAll: this.state.selectAll,
			isSelected,
			toggleAll,
			toggleSelection,
		}
		const columns = JSONClone(this.props.columns)
		columns.forEach((field) => {
			field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
		})

		return (
			<RTBSSelectTable
				{...extraProps}
				{...styleConfig.reactTable}
				ref={(r) => (this.selectTable = r)}
				keyField="id"
				style={this.props.style}
				columns={columns}
				data={data}
				showPagination={true}
				pageSize={15}
				showPaginationTop={true}
				resizable={true}
				freezeWhenExpanded={false}
				onPageChange={() => {
					onPageChangeCallback()
				}}
				onSortedChange={() => {
					onSortedChangeCallback()
				}}
				NoDataComponent={() => null}
				getTrProps={(state, rowInfo) => {
					return {
						onClick: () => {
							this.setState({
								currentSelectedRow: rowInfo.original,
							})
							this.toggleSelection(rowInfo.original.id)
							onClickCallback(rowInfo.original)
						},
						onMouseEnter: () => {
							this.setHoveredRow(rowInfo.index)
							onMouseEnterCallback(rowInfo.original)
						},
						onMouseLeave: () => {
							this.setHoveredRow(null)
							onMouseLeaveCallback(rowInfo.original)
						},
						style: {
							background:
								rowInfo && rowInfo.index === this.state.currentHoveredRowIndex
									? '#b3daff'
									: 'white',
						},
					}
				}}
			/>
		)
	}
}

SelectTable.propTypes = {
	style: PropTypes.object,
	data: PropTypes.array.isRequired,
	columns: PropTypes.array.isRequired,
	onClickCallback: PropTypes.func,
	onSortedChangeCallback: PropTypes.func.isRequired,
	onPageChangeCallback: PropTypes.func.isRequired,
	onMouseEnterCallback: PropTypes.func.isRequired,
	onMouseLeaveCallback: PropTypes.func.isRequired,
}

export default SelectTable
