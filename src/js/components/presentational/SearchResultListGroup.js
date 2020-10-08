/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        SearchResultListGroup.js

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
import { ListGroup } from 'react-bootstrap'
import config from '../../config'
import { AppContext } from '../../context/AppContext'
import {
    getDescription,
    getMacaddress,
    getRSSI,
    getUpdatedByNLbeacons,
} from '../../helper/descriptionGenerator'
import { countNumber } from '../../helper/dataTransfer'
import {
    ALL_DEVICES,
    ALL_PATIENTS,
    OBJECT_TYPE,
    SEARCH_HISTORY,
} from '../../config/wordMap'
import { ASSIGN_OBJECT } from '../../reducer/action'

const SearchResultListGroup = ({
    data,
    onSelect,
    selection,
    disabled,
    action,
    searchObjectArray,
    pinColorArray,
    searchKey,
    onClick,
}) => {
    const { locale, auth, stateReducer } = React.useContext(AppContext)

    const numberSheet = {}

    const onMouseOver = (e, value) => {
        const [{}, dispatch] = stateReducer
        dispatch({
            type: ASSIGN_OBJECT,
            value,
        })
    }

    const onMouseOut = () => {
        const [{}, dispatch] = stateReducer
        dispatch({
            type: ASSIGN_OBJECT,
            value: null,
        })
    }

    const createItem = (searchKey, item, index) => {
        if (selection.includes(item.mac_address)) {
            return (
                <div className="d-inline-block">
                    <i className="fas fa-check color-blue"></i>
                </div>
            )
        }

        switch (searchKey.type) {
            case ALL_DEVICES:
            case ALL_PATIENTS:
                return <p className="d-inline-block">&bull;</p>
            case OBJECT_TYPE:
            case SEARCH_HISTORY:
                return (
                    <div className="d-inline-block">
                        <div
                            className="d-flex justify-content-center color-white"
                            style={{
                                height: '25px',
                                width: '25px',
                                borderRadius: '50%',
                                background: searchObjectArray.includes(
                                    item.keyword
                                )
                                    ? pinColorArray[
                                        searchObjectArray.indexOf(
                                            item.keyword
                                        )
                                    ]
                                    : null,
                            }}
                        >
                            {countNumber(searchKey, item, numberSheet)}
                        </div>
                    </div>
                )
            default:
                return <p className="d-inline-block">{index + 1}.</p>
        }
    }

    const keywordType = config.KEYWORD_TYPE[auth.user.keyword_type]

    return (
        <ListGroup onSelect={onSelect}>
            {data.map((item, index) => {
                const element = (
                    <ListGroup.Item
                        href={'#' + index}
                        eventKey={item.found + ':' + index}
                        onMouseOver={(e) => onMouseOver(e, item.mac_address)}
                        onMouseOut={onMouseOut}
                        key={index}
                        action={action}
                        active
                        className="d-flex text-left justify-content-start"
                    >
                        <div className="d-flex justify-content-center">
                            {createItem(searchKey, item, index)}
                        </div>
                        {getDescription(item, locale, keywordType)}
                        {getMacaddress(item, locale)}
                        {getRSSI(item, locale)}
                        {getUpdatedByNLbeacons(item, locale)}
                    </ListGroup.Item>
                )
                return element
            })}
        </ListGroup>
    )
}

export default SearchResultListGroup
