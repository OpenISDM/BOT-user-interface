import React from 'react'
import Select from 'react-select'
import styleConfig from '../../config/styleConfig'
import BOTInput from '../presentational/BOTInput'
import { compareString, includes, filterByField } from '../../helper/utilities'
import { SEARCH_BAR } from '../../config/wordMap'
import PropTypes from 'prop-types'

const filterObjectList = ({
	key,
	attribute,
	source,
	oldObjectFilter,
	objectList,
	onFilterUpdated,
}) => {
	const objectFilter = oldObjectFilter.filter(
		(filter) => source !== filter.source
	)

	if (key && attribute) {
		objectFilter.push({
			key,
			attribute,
			source,
		})
	}

	const filteredData = objectFilter.reduce((acc, curr) => {
		let callback
		if (curr.source === SEARCH_BAR) {
			callback = includes
		} else {
			callback = compareString
		}
		return filterByField(callback, acc, curr.key, curr.attribute)
	}, objectList)

	onFilterUpdated({
		objectFilter,
		filteredData,
	})
}

const BOTObjectFilterBar = ({
	onFilterUpdated = () => {
		// do nothing
	},
	oldObjectFilter = [],
	objectList = [],
	selectionList = [],
}) => {
	const elements = selectionList.map(
		({ label, attribute, source, options }, index) => {
			if (options) {
				return (
					<Select
						key={index}
						name={label}
						className="mx-2 w-30-view min-height-regular"
						styles={styleConfig.reactSelectFilter}
						onChange={(value) => {
							if (value) {
								filterObjectList({
									key: value.label,
									attribute,
									source,
									oldObjectFilter,
									objectList,
									onFilterUpdated,
								})
							} else {
								filterObjectList({
									source,
									oldObjectFilter,
									objectList,
									onFilterUpdated,
								})
							}
						}}
						options={options}
						isClearable={true}
						isSearchable={true}
						placeholder={label}
					/>
				)
			}
			return (
				<BOTInput
					key={index}
					className="mx-2 w-30-view min-height-regular"
					placeholder={label}
					getSearchKey={(key) => {
						filterObjectList({
							key,
							attribute,
							source,
							oldObjectFilter,
							objectList,
							onFilterUpdated,
						})
					}}
					clearSearchResult={null}
				/>
			)
		}
	)

	return <div className="d-flex justify-content-start">{elements}</div>
}

BOTObjectFilterBar.propTypes = {
	onFilterUpdated: PropTypes.func.isRequired,
	oldObjectFilter: PropTypes.array.isRequired,
	objectList: PropTypes.array.isRequired,
	selectionList: PropTypes.array.isRequired,
}

export default BOTObjectFilterBar
