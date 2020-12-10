/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        BrowserMainContainer.js

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
import SearchResultList from '../../presentational/SearchResultList'
import SearchContainer from '../../container/SearchContainer'
import { Row, Col } from 'react-bootstrap'
import InfoPrompt from '../../presentational/InfoPrompt'
import AuthenticationContext from '../../../context/AuthenticationContext'
import MapContainer from '../../container/MapContainer'
import PropTypes from 'prop-types'

const BrowserMainContainer = ({
	getSearchKey,
	setMonitor,
	clearAlerts,
	lbeaconPosition,
	geofenceConfig,
	searchedObjectType,
	showedObjects,
	highlightSearchPanel,
	showMobileMap,
	clearSearchResult,
	searchKey,
	searchResult,
	trackingData,
	proccessedTrackingData,
	hasSearchKey,
	setShowedObjects,
	pathMacAddress,
	isHighlightSearchPanel,
	locationMonitorConfig,
	currentAreaId,
	searchObjectArray,
	pinColorArray,
	handleClick,
	showFoundResult,
	keywords,
	activeActionButtons,
	handleSearchTypeClick,
}) => {
	const auth = React.useContext(AuthenticationContext)

	const searchResultListRef = React.useRef(null)

	const style = {
		margin: '0px',
		padding: '0px',
		border: '0px',
		maxWidth: '100%',
		zIndex: isHighlightSearchPanel ? 1060 : 1,
	}

	return (
		<div className="mx-1 my-1 overflow-hidden">
			<Row>
				<Col xs={12} sm={12} md={8} lg={8} xl={8} style={style}>
					<MapContainer
						pathMacAddress={pathMacAddress}
						proccessedTrackingData={
							proccessedTrackingData.length === 0
								? trackingData
								: proccessedTrackingData
						}
						hasSearchKey={hasSearchKey}
						searchKey={searchKey}
						searchResult={searchResult}
						handleClearButton={handleClick}
						handleClick={handleClick}
						getSearchKey={getSearchKey}
						setMonitor={setMonitor}
						lbeaconPosition={lbeaconPosition}
						geofenceConfig={geofenceConfig}
						locationMonitorConfig={locationMonitorConfig}
						clearAlerts={clearAlerts}
						searchedObjectType={searchedObjectType}
						showedObjects={showedObjects}
						setShowedObjects={setShowedObjects}
						currentAreaId={currentAreaId}
						searchObjectArray={searchObjectArray}
						pinColorArray={pinColorArray}
						searchResultListRef={searchResultListRef}
						activeActionButtons={activeActionButtons}
					/>
				</Col>
				<Col xs={12} sm={12} md={4} lg={4} xl={4} style={style}>
					<InfoPrompt
						searchKey={searchKey}
						searchResult={searchResult}
						handleClick={handleClick}
					/>
					<SearchContainer
						hasSearchKey={hasSearchKey}
						clearSearchResult={clearSearchResult}
						auth={auth}
						getSearchKey={getSearchKey}
						searchObjectArray={searchObjectArray}
						pinColorArray={pinColorArray}
						keywords={keywords}
						handleSearchTypeClick={handleSearchTypeClick}
					/>
					<SearchResultList
						searchResult={searchResult}
						searchKey={searchKey}
						highlightSearchPanel={highlightSearchPanel}
						showMobileMap={showMobileMap}
						searchObjectArray={searchObjectArray}
						pinColorArray={pinColorArray}
						showFoundResult={showFoundResult}
						ref={searchResultListRef}
					/>
				</Col>
			</Row>
		</div>
	)
}

BrowserMainContainer.propTypes = {
	handleClearButton: PropTypes.func.isRequired,
	getSearchKey: PropTypes.func.isRequired,
	setMonitor: PropTypes.func.isRequired,
	clearAlerts: PropTypes.func.isRequired,
	lbeaconPosition: PropTypes.array.isRequired,
	geofenceConfig: PropTypes.object.isRequired,
	searchedObjectType: PropTypes.array.isRequired,
	showedObjects: PropTypes.array.isRequired,
	highlightSearchPanel: PropTypes.func.isRequired,
	showMobileMap: PropTypes.bool.isRequired,
	clearSearchResult: PropTypes.bool.isRequired,
	searchKey: PropTypes.object.isRequired,
	searchResult: PropTypes.array.isRequired,
	trackingData: PropTypes.array.isRequired,
	proccessedTrackingData: PropTypes.array.isRequired,
	hasSearchKey: PropTypes.bool.isRequired,
	setShowedObjects: PropTypes.func.isRequired,
	pathMacAddress: PropTypes.string.isRequired,
	isHighlightSearchPanel: PropTypes.bool.isRequired,
	locationMonitorConfig: PropTypes.object.isRequired,
	currentAreaId: PropTypes.number.isRequired,
	searchObjectArray: PropTypes.array.isRequired,
	pinColorArray: PropTypes.array.isRequired,
	handleClick: PropTypes.func.isRequired,
	showFoundResult: PropTypes.bool.isRequired,
	keywords: PropTypes.array.isRequired,
	activeActionButtons: PropTypes.array.isRequired,
	handleSearchTypeClick: PropTypes.func.isRequired,
}

export default BrowserMainContainer
