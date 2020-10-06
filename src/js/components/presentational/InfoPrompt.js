/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        InfoPrompt.js

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

import React, { Fragment, useEffect } from 'react'
import { Row } from 'react-bootstrap'
import { AppContext } from '../../context/AppContext'
import {
    BrowserView,
    TabletView,
    MobileOnlyView,
    isTablet,
    CustomView,
    isMobile,
} from 'react-device-detect'
import { SWITCH_SEARCH_LIST } from '../../config/wordMap'
import {
    HoverDiv,
    HoverWithUnderlineDiv,
    JustifyCenterDiv,
    FontBoldDiv,
    ToggleDisplayDiv,
    ReactBootstrapAlert,
} from '../BOTComponent/styleComponent'
import wordMap from '../../config/wordMap'
import { searchResultToMap } from '../../helper/dataTransfer'

export default ({ searchKey, searchResult, handleClick }) => {
    const appContext = React.useContext(AppContext)
    const [showDetail, setShowDetail] = React.useState(false)

    const { locale } = appContext

    let searchResultMap = searchResultToMap(searchResult)

    const handleShowDetail = () => {
        setShowDetail(!showDetail)
    }

    return (
        <Fragment>
            <CustomView condition={isTablet != true && isMobile != true}>
                <div className="d-flex justify-content-center">
                    <ReactBootstrapAlert
                        variant="secondary"
                        className="px-4 position-fixed sm:display-none xs:display-none"
                        style={{
                            width: '32%',
                        }}
                    >
                        <Row>
                            <HoverWithUnderlineDiv onClick={handleClick}>
                                {stringBlock({
                                    name: SWITCH_SEARCH_LIST,
                                    value: true,
                                    data: searchResult.filter(
                                        (item) => item.found
                                    ).length,
                                    label: wordMap.FOUND,
                                    locale,
                                    onClick: handleClick,
                                })}
                            </HoverWithUnderlineDiv>
                            <HoverWithUnderlineDiv onClick={handleClick}>
                                {stringBlock({
                                    name: SWITCH_SEARCH_LIST,
                                    value: false,
                                    data: searchResult.filter(
                                        (item) => !item.found
                                    ).length,
                                    label: wordMap.NOT_FOUND,
                                    locale,
                                    onClick: handleClick,
                                })}
                            </HoverWithUnderlineDiv>
                            <HoverDiv
                                onClick={handleShowDetail}
                                className="text-muted ml-auto d-flex align-items-center position-relative right-0 font-size-80-percent"
                            >
                                {locale.texts.DETAIL}
                                &nbsp;
                                <i
                                    className={`fas ${
                                        showDetail
                                            ? 'fa-angle-up'
                                            : 'fa-angle-down'
                                    }`}
                                />
                            </HoverDiv>
                        </Row>
                        <ToggleDisplayDiv display={showDetail} className="pt-1">
                            {Object.keys(searchResultMap).map((item, index) => {
                                return (
                                    <Row className="text-capitalize">
                                        <JustifyCenterDiv className="mr-1">
                                            {locale.texts.FOUND}
                                            &nbsp;
                                            <FontBoldDiv>
                                                {searchResultMap[item][1]}
                                            </FontBoldDiv>
                                            &nbsp;
                                            {item}
                                        </JustifyCenterDiv>
                                        &nbsp;
                                        <JustifyCenterDiv className="mr-1">
                                            {locale.texts.NOT_FOUND}
                                            &nbsp;
                                            <FontBoldDiv>
                                                {searchResultMap[item][0] -
                                                    searchResultMap[item][1]}
                                            </FontBoldDiv>
                                            &nbsp;
                                            {item}
                                        </JustifyCenterDiv>
                                    </Row>
                                )
                            })}
                        </ToggleDisplayDiv>
                    </ReactBootstrapAlert>
                </div>
            </CustomView>
            <TabletView>
                <FontBoldDiv>
                    {searchKey
                        ? locale.texts.FOUND
                        : locale.texts.PLEASE_SELECT_SEARCH_OBJECT}
                    {searchKey
                        ? searchResult.filter((item) => item.found).length
                        : ''}
                    {searchKey ? locale.texts.OBJECTS : ''}
                </FontBoldDiv>
            </TabletView>
        </Fragment>
    )
}

const stringBlock = ({ name, value, data, label, locale, onClick }) => {
    switch (locale.abbr) {
        case locale.supportedLocale.en.abbr:
        case locale.supportedLocale.ms.abbr:
            return (
                <div
                    className="d-flex justify-content-start mr-2"
                    name={name}
                    value={value}
                    onClick={onClick}
                >
                    <FontBoldDiv name={name} value={value}>
                        {data}
                    </FontBoldDiv>
                    &nbsp;
                    {locale.texts.OBJECTS}
                    &nbsp;
                    {locale.texts[label.toUpperCase().replace(/ /g, '_')]}
                </div>
            )
        case locale.supportedLocale.tw.abbr:
        case locale.supportedLocale.cn.abbr:
            return (
                <div
                    className="d-flex justify-content-start mr-2"
                    name={name}
                    value={value}
                    onClick={onClick}
                >
                    {locale.texts[label.toUpperCase().replace(/ /g, '_')]}
                    &nbsp;
                    <FontBoldDiv name={name} value={value}>
                        {data}
                    </FontBoldDiv>
                    &nbsp;
                    {locale.texts.OBJECTS}
                </div>
            )
    }
}
