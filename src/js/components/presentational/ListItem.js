/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        ListItem.js

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
import BOTLogo from '../../../img/BOTLogo.png'

const ListItem = (props) => {
    const { itemName } = props

    return (
        <div className="listItem list-group-item list-group-item-action d-flex w-100 justify-content-between">
            <div>
                <div className="d-flex w-100 justify-content-between">
                    <h4 className="mb-1">{itemName}</h4>
                    <small></small>
                </div>
                <p className="mb-1"> </p>
                <small></small>
            </div>
            <div>
                <span className="pull-left ">
                    <img
                        src={BOTLogo}
                        width={100}
                        className="img-reponsive img-rounded"
                    />
                </span>
            </div>
        </div>
    )
}

export default ListItem
