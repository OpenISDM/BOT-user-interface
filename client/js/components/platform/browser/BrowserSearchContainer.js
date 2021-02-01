/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        BrowserSearchContainer.js

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
import { Row, Col } from 'react-bootstrap'
import BOTSearchbar from '../../presentational/BOTSearchbar'
import FrequentSearch from '../../container/FrequentSearch'
import ObjectTypeList from '../../container/ObjectTypeList'
import PropTypes from 'prop-types'

const BrowserSearchContainer = ({
	searchKey,
	personObjectTypes,
	deviceObjectTypes,
	deviceNamedListMap,
	personNamedListMap,
	getSearchKey,
	handleTouchMove,
	clearSearchResult,
	searchObjectArray,
	pinColorArray,
	keywords,
	handleSearchTypeClick,
}) => {
	return (
		<div
			id="searchContainer"
			className="py-2 mt-5"
			onTouchMove={handleTouchMove}
		>
			<Row
				id="searchBar"
				className="d-flex justify-content-center align-items-center pb-2"
			>
				<BOTSearchbar
					placeholder={searchKey}
					getSearchKey={getSearchKey}
					clearSearchResult={clearSearchResult}
					width={400}
					suggestData={keywords}
				/>
			</Row>
			<Row>
				<Col xs={4} sm={4} md={4} lg={4} xl={4} style={{ paddingRight: '0px' }}>
					<FrequentSearch
						getSearchKey={getSearchKey}
						clearSearchResult={clearSearchResult}
						searchObjectArray={searchObjectArray}
						pinColorArray={pinColorArray}
						handleSearchTypeClick={handleSearchTypeClick}
					/>
				</Col>
				<Col xs={8} sm={8} md={8} lg={8} xl={8} style={{ paddingLeft: '0px' }}>
					<ObjectTypeList
						getSearchKey={getSearchKey}
						clearSearchResult={clearSearchResult}
						personObjectTypes={personObjectTypes}
						deviceObjectTypes={deviceObjectTypes}
						personNamedListMap={personNamedListMap}
						deviceNamedListMap={deviceNamedListMap}
						searchObjectArray={searchObjectArray}
						pinColorArray={pinColorArray}
					/>
				</Col>
			</Row>
		</div>
	)
}

BrowserSearchContainer.propTypes = {
	searchKey: PropTypes.object.isRequired,
	personObjectTypes: PropTypes.array.isRequired,
	deviceObjectTypes: PropTypes.array.isRequired,
	personNamedListMap: PropTypes.array.isRequired,
	deviceNamedListMap: PropTypes.array.isRequired,
	getSearchKey: PropTypes.func.isRequired,
	handleTouchMove: PropTypes.func.isRequired,
	clearSearchResult: PropTypes.bool.isRequired,
	searchObjectArray: PropTypes.array.isRequired,
	pinColorArray: PropTypes.array.isRequired,
	keywords: PropTypes.array.isRequired,
	handleSearchTypeClick: PropTypes.func.isRequired,
}

export default BrowserSearchContainer
