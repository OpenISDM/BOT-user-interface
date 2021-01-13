/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        TabletMainContainer.js

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
import AuthenticationContext from '../../../context/AuthenticationContext'

const TabletMainContainer = ({
	handleClearButton,
	getSearchKey,
	handleClosePath,
	handleShowPath,
	lbeaconPosition,
	geofenceConfig,
	authenticated,
	highlightSearchPanel,
	showMobileMap,
	clearSearchResult,
	searchKey,
	searchResult,
	proccessedTrackingData,
	pathMacAddress,
}) => {
	const auth = React.useContext(AuthenticationContext)

	const style = {
		noResultDiv: {
			color: 'grey',
			fontSize: '1rem',
		},
		titleText: {
			color: 'rgb(80, 80, 80, 0.9)',
		},
	}

	return (
		<div
			id="page-wrap"
			className="d-flex flex-column w-100"
			style={{ height: '90vh' }}
		>
			<div id="mainContainer" className="d-flex flex-row h-100 w-100">
				<div className="d-flex flex-column" style={style.MapAndResult}>
					<div className="d-flex" style={style.MapAndQrcode}>
						<MapContainer
							pathMacAddress={pathMacAddress}
							proccessedTrackingData={proccessedTrackingData}
							searchResult={searchResult}
							handleClearButton={handleClearButton}
							getSearchKey={getSearchKey}
							lbeaconPosition={lbeaconPosition}
							geofenceConfig={geofenceConfig}
							searchKey={searchKey}
							authenticated={authenticated}
							handleClosePath={handleClosePath}
							handleShowPath={handleShowPath}
						/>
					</div>

					<div
						id="searchResult"
						className="d-flex"
						style={{ justifyContent: 'center' }}
					>
						<SearchResultList
							searchResult={searchResult}
							searchKey={searchKey}
							highlightSearchPanel={highlightSearchPanel}
							handleShowPath={handleShowPath}
							showMobileMap={showMobileMap}
						/>
					</div>
				</div>
				<div
					id="searchPanel"
					className="h-100"
					style={style.searchPanelForTablet}
				>
					<SearchContainer
						clearSearchResult={clearSearchResult}
						auth={auth}
						getSearchKey={getSearchKey}
					/>
				</div>
			</div>
		</div>
	)
}

export default TabletMainContainer
