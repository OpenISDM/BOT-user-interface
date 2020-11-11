/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        BrowserObjectTableView.js

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
import LocaleContext from '../../../context/LocaleContext'
import styleConfig from '../../../config/styleConfig'
import BOTInput from '../../presentational/BOTInput'
import { ButtonToolbar } from 'react-bootstrap'
import Select from 'react-select'
import { PrimaryButton } from '../../BOTComponent/styleComponent'
import AccessControl from '../../authentication/AccessControl'
import { ADD, BIND, DELETE } from '../../../config/wordMap'
import PropTypes from 'prop-types'

const BrowserObjectTableView = ({
	addObjectFilter,
	removeObjectFilter,
	filterSelection,
	handleClickButton,
	selection,
}) => {
	const locale = React.useContext(LocaleContext)
	return (
		<div className="d-flex justify-content-between my-4">
			<div className="d-flex justify-content-start">
				<BOTInput
					className="mx-2 w-30-view"
					placeholder={locale.texts.SEARCH}
					getSearchKey={(key) => {
						addObjectFilter(
							key,
							['name', 'area', 'macAddress', 'acn', 'sex', 'monitor_type'],
							'search bar'
						)
					}}
					clearSearchResult={null}
				/>
				<AccessControl platform={['browser']}>
					<Select
						className="mx-2 text-capitalize w-30-view min-height-regular"
						styles={styleConfig.reactSelectFilter}
						onChange={(value) => {
							if (value) {
								addObjectFilter(value.label, ['area'], 'area select')
							} else {
								removeObjectFilter('area select')
							}
						}}
						options={filterSelection.areaSelection || []}
						isClearable={true}
						isSearchable={true}
						placeholder={locale.texts.SELECT_AREA}
					/>
				</AccessControl>
			</div>
			<AccessControl platform={['browser', 'tablet']}>
				<ButtonToolbar>
					<PrimaryButton
						className="text-capitalize mr-2 mb-1"
						name={BIND}
						onClick={handleClickButton}
					>
						{locale.texts.BIND}
					</PrimaryButton>
					<PrimaryButton
						className="text-capitalize mr-2 mb-1"
						name={ADD}
						onClick={handleClickButton}
					>
						{locale.texts.ADD_PATIENT}
					</PrimaryButton>
					<PrimaryButton
						className="text-capitalize mr-2 mb-1"
						name={DELETE}
						onClick={handleClickButton}
						disabled={selection.length === 0}
					>
						{locale.texts.DELETE_PATIENT}
					</PrimaryButton>
				</ButtonToolbar>
			</AccessControl>
		</div>
	)
}

BrowserObjectTableView.propTypes = {
	addObjectFilter: PropTypes.func.isRequired,
	removeObjectFilter: PropTypes.func.isRequired,
	filterSelection: PropTypes.array.isRequired,
	handleClickButton: PropTypes.func.isRequired,
	selection: PropTypes.array.isRequired,
}

export default BrowserObjectTableView
