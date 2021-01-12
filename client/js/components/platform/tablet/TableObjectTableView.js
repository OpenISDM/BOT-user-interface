/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        TableObjectTableView.js

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
import { AppContext } from '../../../context/AppContext'
import styleConfig from '../../../config/styleConfig'
import BOTInput from '../../presentational/BOTInput'
import { ButtonToolbar } from 'react-bootstrap'
import Select from 'react-select'
import { PrimaryButton } from '../../BOTComponent/styleComponent'
import AccessControl from '../../authentication/AccessControl'

const MobileObjectTableView = ({
	addObjectFilter,
	removeObjectFilter,
	filterSelection,
	handleClickButton,
	selection,
	handleClick,
}) => {
	const { locale } = React.useContext(AppContext)

	return (
		<Fragment>
			<div className="d-flex justify-content-start">
				<BOTInput
					className="mx-2"
					placeholder={locale.texts.SEARCH}
					getSearchKey={(key) => {
						addObjectFilter(
							key,
							['name', 'area', 'macAddress', 'acn'],
							'search bar'
						)
					}}
					clearSearchResult={null}
				/>
				<AccessControl platform={['tablet']}>
					<Select
						name="Select Area Patient"
						className="mx-2"
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

			<AccessControl platform={['tablet']}>
				<ButtonToolbar>
					<PrimaryButton
						className="text-capitalize mr-2 mb-1"
						name="associate"
						onClick={handleClickButton}
					>
						{locale.texts.ASSOCIATE}
					</PrimaryButton>
					<PrimaryButton
						className="text-capitalize mr-2 mb-1"
						onClick={handleClick}
					>
						{locale.texts.ADD}
					</PrimaryButton>
					<PrimaryButton
						className="text-capitalize mr-2 mb-1"
						name="delete"
						onClick={handleClickButton}
						disabled={selection.length == 0}
					>
						{locale.texts.DELETE}
					</PrimaryButton>
				</ButtonToolbar>
			</AccessControl>
		</Fragment>
	)
}

export default MobileObjectTableView
