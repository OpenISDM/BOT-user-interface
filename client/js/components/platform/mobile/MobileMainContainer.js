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
import SearchResultList from '../../presentational/SearchResultList'
import SearchContainer from '../../container/SearchContainer'
import { Row, Col } from 'react-bootstrap'
import AuthenticationContext from '../../../context/AuthenticationContext'
import LocaleContext from '../../../context/LocaleContext'
import MapContainer from '../../container/MapContainer'

const MobileMainContainer = ({
	handleClearButton,
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
	searchObjectArray = [],
	pinColorArray,
	handleClick,
	showFoundResult,
	keywords,
	display,
	handleShowResultListForMobile,
}) => {
	const auth = React.useContext(AuthenticationContext)
	const locale = React.useContext(LocaleContext)

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
						handleShowResultListForMobile={handleShowResultListForMobile}
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
						searchedObjectType={searchedObjectType}
						showedObjects={showedObjects}
						setShowedObjects={setShowedObjects}
						currentAreaId={currentAreaId}
						searchObjectArray={searchObjectArray}
						pinColorArray={pinColorArray}
					/>
				</div>
				{/* <ButtonGroup style={{marginTop:'5px',marginBottom:'5px'}}>
                    <Button
                        variant='outline-primary'
                        onClick={mapButtonHandler}
                    >
                        {showMobileMap ? locale.texts.HIDE_MAP : locale.texts.SHOW_MAP}
                    </Button>
                    <Button
                        variant='outline-primary'
                        onClick={handleClearButton}
                    >
                        {locale.texts.NEW_SEARCH}
                    </Button>
                </ButtonGroup>
                <div className='d-flex justify-content-center'>
                    <SearchResultList
                        searchResult={searchResult}
                        searchKey={searchKey}
                        highlightSearchPanel={highlightSearchPanel}
                        handleShowPath={handleShowPath}
                        showMobileMap={showMobileMap}
                    />
                </div> */}
			</div>
		</div>
	)
}

export default MobileMainContainer
