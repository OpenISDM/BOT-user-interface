/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        MobileSearchContainer.js

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
import { Row, Image } from 'react-bootstrap'
import BOTSearchbar from '../../presentational/BOTSearchbar'
import config from '../../../config'

const MobileSearchContainer = ({
    searchKey,
    getSearchKey,
    handleTouchMove,
    clearSearchResult,
    suggestData,
    keywords,
}) => {
    return (
        <div
            id="searchContainer"
            className="py-1"
            onTouchMove={handleTouchMove}
        >
            <Row
                id="searchBar"
                className="d-flex justify-content-center align-items-center my-4"
            >
                <BOTSearchbar
                    placeholder={searchKey}
                    getSearchKey={getSearchKey}
                    clearSearchResult={clearSearchResult}
                    width={400}
                    suggestData={keywords}
                />
            </Row>
        </div>
    )
}

export default MobileSearchContainer
