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

const BrowserMainContainer = ({
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
    searchObjectArray,
    pinColorArray,
    handleClick,
    showFoundResult,
    keywords,
}) => {
    let auth = React.useContext(AuthenticationContext)

    let searchResultListRef = React.useRef(null)

    const style = {
        searchResultDiv: {
            display: hasSearchKey ? null : 'none',
        },

        searchPanel: {
            zIndex: isHighlightSearchPanel ? 1060 : 1,
            borderRadius: 10,
            height: '90vh',
        },

        searchResultList: {
            dispaly: hasSearchKey ? null : 'none',
            maxHeight: '28vh',
        },
    }
    return (
        <div className="mx-1 my-2 overflow-hidden h-100">
            <Row
                id="mainContainer"
                className="d-flex w-100 justify-content-around mx-0 h-100"
            >
                <Col
                    md={8}
                    lg={8}
                    xl={8}
                    className="pl-2 pr-1 xs:display-none sm:display-none"
                >
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
                    />
                </Col>

                <Col
                    id="searchPanel"
                    xs={12}
                    sm={5}
                    md={4}
                    lg={4}
                    xl={4}
                    className="w-100 px-2 bg-white d-flex flex-column h-100"
                    style={style.searchPanel}
                >
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
                    />
                    <div id="searchResult" style={style.searchResultDiv}>
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
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default BrowserMainContainer
