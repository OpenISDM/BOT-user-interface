/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        ObjectTypeList.js

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
import { Button } from 'react-bootstrap'
import { AppContext } from '../../context/AppContext'
import apiHelper from '../../helper/apiHelper'
import { OBJECT_TYPE } from '../../config/wordMap'
import { Title } from '../BOTComponent/styleComponent'

class ObjectTypeList extends React.Component {
    static contextType = AppContext

    state = {
        searchKey: '',
    }

    componentDidUpdate = (prepProps) => {
        if (
            prepProps.clearSearchResult != this.props.clearSearchResult &&
            !prepProps.clearSearchResult
        ) {
            this.setState({
                searchKey: '',
            })
        }
        if (
            prepProps.hasGridButton != this.props.hasGridButton &&
            this.props.hasGridButton
        ) {
            this.setState({
                searchKey: '',
            })
        }
    }

    handleClick = (e) => {
        const itemName = e.target.name

        const searchKey = {
            type: OBJECT_TYPE,
            value: itemName,
        }

        this.props.getSearchKey(searchKey)

        this.addSearchHistory(searchKey)

        this.checkInSearchHistory(itemName)
    }

    /** Set search history to auth */
    addSearchHistory = (searchKey) => {
        let { auth } = this.context

        if (!auth.authenticated) return

        let searchHistory = [...auth.user.searchHistory] || []

        const itemIndex = searchHistory.indexOf(searchKey.value)

        if (itemIndex > -1) {
            searchHistory = [
                ...searchHistory.slice(0, itemIndex),
                ...searchHistory.slice(itemIndex + 1),
            ]
        }

        searchHistory.unshift(searchKey.value)

        auth.setSearchHistory(searchHistory)

        this.checkInSearchHistory(searchKey.value)
    }

    /** Sort the user search history and limit the history number */
    sortSearchHistory(history) {
        let toReturn = history.sort((a, b) => {
            return b.value - a.value
        })
        return toReturn
    }

    /** Insert search history to database */
    checkInSearchHistory = (itemName) => {
        let { auth } = this.context

        apiHelper.userApiAgent
            .addSearchHistory({
                username: auth.user.name,
                keyType: 'object type search',
                keyWord: itemName,
            })
            .then((res) => {
                this.setState({
                    searchKey: itemName,
                })
            })
            .catch((err) => {
                console.log(`check in search history failed ${err}`)
            })
    }

    render() {
        const { searchObjectArray, pinColorArray } = this.props

        const { locale } = this.context

        return (
            <div>
                <Title list className="text-center">
                    {locale.texts.OBJECT_TYPE}
                </Title>
                <div className="d-inline-flex flex-column overflow-hidden-scroll custom-scrollbar text-center max-height-30">
                    <div className="text-center">
                        {this.props.objectTypeList.map((item, index) => {
                            let pinColorIndex = searchObjectArray.indexOf(item)

                            return (
                                <Button
                                    variant="outline-custom"
                                    className="text-none"
                                    onClick={this.handleClick}
                                    // active={this.state.searchKey == item.toLowerCase()}
                                    style={{
                                        color:
                                            pinColorIndex > -1
                                                ? pinColorArray[pinColorIndex]
                                                : null,
                                    }}
                                    key={index}
                                    name={item}
                                >
                                    {item}
                                </Button>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

export default ObjectTypeList
