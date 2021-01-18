/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        BrowserSearchResultList.js

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
import { Col, Row } from 'react-bootstrap'
import AccessControl from '../../authentication/AccessControl'
import SearchResultListGroup from '../../presentational/SearchResultListGroup'
import { AppContext } from '../../../context/AppContext'
import { Title } from '../../BOTComponent/styleComponent'
import PropTypes from 'prop-types'

const BrowserSearchResultList = ({
	searchResult,
	title,
	selection,
	onSelect,
	searchObjectArray,
	pinColorArray,
	searchKey,
}) => {
	const { locale } = React.useContext(AppContext)

	const listMaxHeight = '45vh'

	return (
		<Fragment>
			<Row className="d-flex justify-content-center">
				<Title>{title}</Title>
			</Row>

			{searchResult.length === 0 ? (
				<Col className="d-flex justify-content-center color-grey">
					{locale.texts.NO_RESULT}
				</Col>
			) : (
				<div
					className="d-flex justify-content-center overflow-hidden-scroll custom-scrollbar"
					style={{
						maxHeight: listMaxHeight,
					}}
				>
					<AccessControl
						permission={'form:edit'}
						renderNoAccess={() => (
							// TODO: To be refined
							<SearchResultListGroup
								data={searchResult}
								selection={selection}
							/>
						)}
					>
						<SearchResultListGroup
							data={searchResult}
							onSelect={onSelect}
							selection={selection}
							action
							searchObjectArray={searchObjectArray}
							pinColorArray={pinColorArray}
							searchKey={searchKey}
						/>
					</AccessControl>
				</div>
			)}
		</Fragment>
	)
}

BrowserSearchResultList.propTypes = {
	searchResult: PropTypes.array.isRequired,
	title: PropTypes.string.isRequired,
	selection: PropTypes.array.isRequired,
	onSelect: PropTypes.func.isRequired,
	searchObjectArray: PropTypes.array.isRequired,
	pinColorArray: PropTypes.array.isRequired,
	searchKey: PropTypes.string.isRequired,
}

export default BrowserSearchResultList
