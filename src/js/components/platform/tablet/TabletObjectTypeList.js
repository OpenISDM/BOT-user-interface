/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        TabletObjectTypeList.js

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
import { Col, Button } from 'react-bootstrap'
import AccessControl from '../../authentication/AccessControl'
import { AppContext } from '../../../context/AppContext'
import { MobileOnlyView, TabletView, isMobileOnly } from 'react-device-detect'
import ScrollArea from 'react-scrollbar'

class TabletObjectTypeList extends React.Component {
    static contextType = AppContext

    state = {
        searchKey: '',
    }

    componentDidUpdate = (prepProps) => {
        if (
            prepProps.clearSearchResult !== this.props.clearSearchResult &&
            !prepProps.clearSearchResult
        ) {
            this.setState({
                searchKey: '',
            })
        }
        if (
            prepProps.hasGridButton !== this.props.hasGridButton &&
            this.props.hasGridButton
        ) {
            this.setState({
                searchKey: '',
            })
        }
    }

    handleClick = (e) => {
        const itemName = e.target.name.toLowerCase()
        this.getSearchKey(itemName)
        if (isMobileOnly) this.props.handleShowResultListForMobile()
    }

    getSearchKey = (itemName) => {
        this.props.getSearchKey(itemName)
        this.setState({
            searchKey: itemName,
        })
    }

    render() {
        const { locale, auth } = this.context

        const style = {
            list: {
                // maxHeight: "50vh",
                // overflow: "hidden scroll",
            },
            listForMobile: {
                maxHeight: '50vh',
                overflow: 'hidden scroll',
                fontSize: '1.5rem',
                fontWeight: 300,
                color: 'green',
            },
            button: {
                //border: 'solid',
                padding: '0.1rem',
            },
            text: {
                fontSize: '2rem',
                fontWeight: 400,
            },
            textSmall: {
                fontSize: '1.5rem',
                fontWeight: 400,
            },
            textSmallButton: {
                padding: '0.1rem',
                fontSize: '1.5rem',
                fontWeight: 400,
            },
        }

        const optionsOfMobile = {
            maxScrollbarLength: 500,
        }

        return (
            <div>
                <TabletView>
                    <div
                        id="objectTypeList"
                        className="d-inline-flex flex-column"
                    >
                        <div className="text-capitalize title">
                            {locale.texts.OBJECT_TYPE}
                        </div>
                        <ScrollArea
                            style={{ maxHeight: '40vh' }}
                            smoothScrolling={true}
                        >
                            <div className="d-inline-flex flex-column searchOption">
                                {this.props.objectTypeList.map(
                                    (item, index) => {
                                        return (
                                            <Button
                                                variant="outline-custom"
                                                onClick={this.handleClick}
                                                // active={this.state.searchKey === item.toLowerCase()}
                                                key={index}
                                                name={item}
                                                className="text-capitalize"
                                                style={style.button}
                                            >
                                                {item}
                                            </Button>
                                        )
                                    }
                                )}
                                &nbsp;
                            </div>
                        </ScrollArea>

                        <div className="d-inline-flex flex-column">
                            &nbsp;
                            <AccessControl
                                permission={'user:mydevice'}
                                renderNoAccess={() => null}
                            >
                                <Button
                                    variant="outline-custom"
                                    onClick={this.handleClick}
                                    name="my patients"
                                    className="text-capitalize"
                                >
                                    {locale.texts.MY_PATIENTS}
                                </Button>

                                <Button
                                    variant="outline-custom"
                                    onClick={this.handleClick}
                                    // active={this.state.searchKey === 'my devices'}
                                    name="my devices"
                                    className="text-capitalize"
                                >
                                    {locale.texts.MY_DEVICES}
                                </Button>
                            </AccessControl>
                            <Button
                                variant="outline-custom"
                                onClick={this.handleClick}
                                // active={this.state.searchKey === 'all devices'}
                                name="all patients"
                                className="text-capitalize"
                            >
                                {locale.texts.ALL_PATIENTS}
                            </Button>
                            <Button
                                variant="outline-custom"
                                onClick={this.handleClick}
                                // active={this.state.searchKey === 'all devices'}
                                name="all devices"
                                className="text-capitalize"
                            >
                                {locale.texts.ALL_DEVICES}
                            </Button>
                        </div>
                    </div>
                </TabletView>
                <MobileOnlyView>
                    <div
                        className="d-inline-flex flex-column"
                        style={style.textSmall}
                    >
                        <AccessControl
                            permission={'user:mydevice'}
                            renderNoAccess={() => null}
                        >
                            <Col>
                                <Button
                                    variant="outline-custom"
                                    onClick={this.handleClick}
                                    name="my patients"
                                    className="text-capitalize"
                                    style={style.textSmall}
                                >
                                    {locale.texts.MY_PATIENTS}
                                </Button>

                                <Button
                                    variant="outline-custom"
                                    onClick={this.handleClick}
                                    // active={this.state.searchKey === 'my devices'}
                                    name="my devices"
                                    className="text-capitalize"
                                    style={style.textSmall}
                                >
                                    {locale.texts.MY_DEVICES}
                                </Button>
                            </Col>
                        </AccessControl>
                        <Col>
                            <Button
                                variant="outline-custom"
                                onClick={this.handleClick}
                                // active={this.state.searchKey === 'all devices'}
                                name="all patients"
                                className="text-capitalize"
                                style={style.textSmall}
                            >
                                {locale.texts.ALL_PATIENTS}
                            </Button>
                            <Button
                                variant="outline-custom"
                                onClick={this.handleClick}
                                // active={this.state.searchKey === 'all devices'}
                                name="all devices"
                                className="text-capitalize"
                                style={style.textSmall}
                            >
                                {locale.texts.ALL_DEVICES}
                            </Button>
                        </Col>
                    </div>
                    <div
                        id="objectTypeList"
                        className="d-inline-flex flex-column"
                    >
                        <div
                            className="text-capitalize title"
                            style={style.text}
                        >
                            {locale.texts.OBJECT_TYPE}
                        </div>

                        <ScrollArea style={{ maxHeight: '50vh' }}>
                            <div className="d-inline-flex flex-column searchOption">
                                {this.props.objectTypeList.map(
                                    (item, index) => {
                                        return (
                                            <Button
                                                variant="outline-custom"
                                                onClick={this.handleClick}
                                                // active={this.state.searchKey === item.toLowerCase()}
                                                key={index}
                                                name={item}
                                                className="text-capitalize"
                                                style={style.textSmallButton}
                                            >
                                                {item}
                                            </Button>
                                        )
                                    }
                                )}
                                &nbsp;
                            </div>
                        </ScrollArea>
                    </div>
                </MobileOnlyView>
            </div>
        )
    }
}

export default TabletObjectTypeList
