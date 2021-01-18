/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        BOTObjectFilterBar.js

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
