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
import config from '../../../config'
import FrequentSearch from '../../container/FrequentSearch'
import ObjectTypeList from '../../container/ObjectTypeList'

const BrowserSearchContainer = ({
    searchKey,
    objectTypeList,
    getSearchKey,
    handleTouchMove,
    clearSearchResult,
    hasGridButton,
    searchObjectArray,
    pinColorArray,
    keywords,
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
            <Row
                id="searchOption"
                className="pt-2 d-flex justify-content-center"
            >
                <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                    <FrequentSearch
                        getSearchKey={getSearchKey}
                        clearSearchResult={clearSearchResult}
                        hasGridButton={hasGridButton}
                        maxHeigh={config.searchResultProportion}
                        searchObjectArray={searchObjectArray}
                        pinColorArray={pinColorArray}
                    />
                </Col>
                <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                    <ObjectTypeList
                        getSearchKey={getSearchKey}
                        clearSearchResult={clearSearchResult}
                        hasGridButton={hasGridButton}
                        objectTypeList={objectTypeList || []}
                        maxHeigh={config.searchResultProportion}
                        searchObjectArray={searchObjectArray}
                        pinColorArray={pinColorArray}
                    />
                </Col>
            </Row>
        </div>
    )
}

export default BrowserSearchContainer
