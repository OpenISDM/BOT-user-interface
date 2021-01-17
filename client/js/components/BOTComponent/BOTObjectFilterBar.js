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

import React, { useContext } from 'react'
import Select from 'react-select'
import { AppContext } from '../../context/AppContext'
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
	typeOptions = [],
	areaOptions = [],
	statusOptions = [],
}) => {
	const { locale } = useContext(AppContext)

	return (
		<div className="d-flex justify-content-start">
			<BOTInput
				className="mx-2 w-30-view min-height-regular"
				placeholder={locale.texts.SEARCH}
				getSearchKey={(key) => {
					filterObjectList({
						key,
						attribute: [
							'name',
							'type',
							'area',
							'status',
							'macAddress',
							'acn',
							'transferred_location',
						],
						source: 'search bar',
						oldObjectFilter,
						objectList,
						onFilterUpdated,
					})
				}}
				clearSearchResult={null}
			/>
			<Select
				name="Select Type"
				className="mx-2 w-30-view min-height-regular"
				styles={styleConfig.reactSelectFilter}
				onChange={(value) => {
					if (value) {
						filterObjectList({
							key: value.label,
							attribute: ['type'],
							source: 'type select',
							oldObjectFilter,
							objectList,
							onFilterUpdated,
						})
					} else {
						filterObjectList({
							source: 'type select',
							oldObjectFilter,
							objectList,
							onFilterUpdated,
						})
					}
				}}
				options={typeOptions}
				isClearable={true}
				isSearchable={true}
				placeholder={locale.texts.TYPE}
			/>
			<Select
				name="Select Area"
				className="mx-2 w-30-view min-height-regular"
				styles={styleConfig.reactSelectFilter}
				onChange={(value) => {
					if (value) {
						filterObjectList({
							key: value.label,
							attribute: ['area'],
							source: 'area select',
							oldObjectFilter,
							objectList,
							onFilterUpdated,
						})
					} else {
						filterObjectList({
							source: 'area select',
							oldObjectFilter,
							objectList,
							onFilterUpdated,
						})
					}
				}}
				options={areaOptions}
				isClearable={true}
				isSearchable={true}
				placeholder={locale.texts.AREA}
			/>
			<Select
				name="Select Status"
				className="mx-2 w-30-view min-height-regular"
				styles={styleConfig.reactSelectFilter}
				onChange={(value) => {
					if (value) {
						filterObjectList({
							key: value.label,
							attribute: ['status'],
							source: 'status select',
							oldObjectFilter,
							objectList,
							onFilterUpdated,
						})
					} else {
						filterObjectList({
							source: 'status select',
							oldObjectFilter,
							objectList,
							onFilterUpdated,
						})
					}
				}}
				options={statusOptions}
				isClearable={true}
				isSearchable={true}
				placeholder={locale.texts.STATUS}
			/>
		</div>
	)
}

BOTObjectFilterBar.propTypes = {
	onFilterUpdated: PropTypes.func.isRequired,
	oldObjectFilter: PropTypes.array.isRequired,
	objectList: PropTypes.array.isRequired,
	typeOptions: PropTypes.array.isRequired,
	areaOptions: PropTypes.array.isRequired,
	statusOptions: PropTypes.array.isRequired,
}

export default BOTObjectFilterBar
