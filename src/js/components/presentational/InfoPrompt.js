/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

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


import React, { Fragment } from 'react';
import { Alert, Button } from 'react-bootstrap'
import { AppContext } from '../../context/AppContext';
import {
    BrowserView,
    TabletView,
    MobileOnlyView,
    isTablet,
    CustomView,
    isMobile 
} from 'react-device-detect'
import { SWITCH_SEARCH_LIST } from '../../config/words';
import {
    HoverDiv
} from '../BOTComponent/styleComponent';
import styled from 'styled-components';

const style = {
    alertText: {
        fontSize: '1.2rem',
        fontWeight: 700
    },
    alertTextTitle: {
        fontSize: '1.2rem',
        color: 'rgba(101, 111, 121, 0.78)',
    },
    alerTextTitleForTablet: {
        fontSize: '1.2rem',
        fontWeight: 500,
        color: 'black'
    }
}

const InfoPrompt = ({
    searchKey,
    searchResult,
    handleClick
}) => {
    const appContext = React.useContext(AppContext);
    const { locale } = appContext
    return (
        <Fragment>
            <CustomView condition={isTablet != true && isMobile != true}>
               <Alert variant='secondary' className='d-flex justify-content-start'>
                    <HoverDiv
                        onClick={handleClick}
                    >
                        <div 
                            className='d-flex justify-content-start mr-1'
                            name={SWITCH_SEARCH_LIST}
                            value={true}
                        >
                            {searchKey ? locale.texts.FOUND : locale.texts.PLEASE_SELECT_SEARCH_OBJECT}
                            &nbsp;
                            <div
                                style={style.alertText}
                            >
                                {searchKey ? searchResult.filter(item => item.found).length : ""}
                            </div>
                            &nbsp;
                            {searchKey && locale.texts.OBJECTS}
                        </div>
                    </HoverDiv>
                    {searchKey && <div>&nbsp;</div> }
                    <HoverDiv
                        onClick={handleClick}
                    >
                        <div 
                            className='d-flex justify-content-start mr-1'
                            name={SWITCH_SEARCH_LIST}
                            value={false}
                        >
                            {searchKey && `${locale.texts.NOT_FOUND}`}
                            &nbsp;
                            <div
                                style={style.alertText}
                            >
                                {searchKey ? searchResult.filter(item => !item.found).length : ""}
                            </div>
                            &nbsp;
                            {searchKey && locale.texts.OBJECTS}
                        </div>
                    </HoverDiv>
                </Alert>
            </CustomView> 


            <TabletView>
                <div>
                    <div className='text-capitalize' style={style.alerTextTitleForTablet}>{searchKey ? locale.texts.FOUND : locale.texts.PLEASE_SELECT_SEARCH_OBJECT}</div>
                    <div className='text-capitalize' style={style.alerTextTitleForTablet}>{searchKey ? searchResult.filter(item => item.found).length : ""}</div>
                    <div className='text-capitalize' style={style.alerTextTitleForTablet}>{searchKey 
                            ?   
                                locale.texts.OBJECTS
                            :   ""
                        }</div>
                </div>
            </TabletView>
        </Fragment>
    )

}

export default InfoPrompt