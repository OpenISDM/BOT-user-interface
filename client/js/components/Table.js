import React, { useContext, useState } from 'react'
import ReactTable from 'react-table'
import { AppContext } from '../context/AppContext'
import styleConfig from '../config/styleConfig'
import { JSONClone } from '../helper/utilities'
import PropTypes from 'prop-types'

import 'react-table/react-table.css'
import 'react-tabs/style/react-tabs.css'

const Table = ({ data, columns, onClickCallback, style }) => {
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

Table.propTypes = {
	data: PropTypes.array.isRequired,
	columns: PropTypes.array.isRequired,
	onClickCallback: PropTypes.func,
	pageSize: PropTypes.number.isRequired,
	style: PropTypes.object.isRequired,
}

export default Table
