/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        MobileMainContainer.js

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
import SearchContainer from '../../container/SearchContainer'
import { AppContext } from '../../../context/AppContext'
import MapContainer from '../../container/MapContainer'

const MobileMainContainer = ({
	getSearchKey,
	lbeaconPosition,
	geofenceConfig,
	showMobileMap,
	clearSearchResult,
	searchKey,
	searchResult,
	trackingData,
	proccessedTrackingData,
	hasSearchKey,
	pathMacAddress,
	locationMonitorConfig,
	searchObjectArray = [],
	pinColorArray,
	handleClick,
	keywords,
	display,
}) => {
	const { auth } = React.useContext(AppContext)

	const style = {
		searchPanelForMobile: {
			// zIndex: isHighlightSearchPanel ? 1060 : 1,
			display: display ? null : 'none',
			fontSize: '2rem',
			background: 'white',
			borderRadius: 10,
			//border: 'solid',
			height: '90vh',
			// width:'90vw'
		},
		mapForMobile: {
			display: showMobileMap ? null : 'none',
		},
	}

	return (
		<div
			id="page-wrap"
			className="d-flex flex-column"
			style={{ height: '90vh' }}
		>
			<div className="h-100" style={{ overflow: 'hidden hidden' }}>
				<div
					id="searchPanel"
					className="h-100"
					style={style.searchPanelForMobile}
				>
					<SearchContainer
						hasSearchKey={hasSearchKey}
						clearSearchResult={clearSearchResult}
						auth={auth}
						getSearchKey={getSearchKey}
						searchObjectArray={searchObjectArray}
						pinColorArray={pinColorArray}
						keywords={keywords}
					/>
				</div>
				<div style={style.mapForMobile} className="m-1">
					<MapContainer
						pathMacAddress={pathMacAddress}
						proccessedTrackingData={
							proccessedTrackingData.length == 0
								? trackingData
								: proccessedTrackingData
						}
						hasSearchKey={hasSearchKey}
						searchKey={searchKey}
						searchResult={searchResult}
						handleClearButton={handleClick}
						handleClick={handleClick}
						getSearchKey={getSearchKey}
						lbeaconPosition={lbeaconPosition}
						geofenceConfig={geofenceConfig}
						locationMonitorConfig={locationMonitorConfig}
						searchObjectArray={searchObjectArray}
						pinColorArray={pinColorArray}
					/>
				</div>
			</div>
		</div>
	)
}

export default MobileMainContainer
