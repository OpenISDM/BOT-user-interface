/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        Switcher.js

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
import { AppContext } from '../../context/AppContext'

const Switcher = ({ leftLabel, rightLabel, status, type, onChange, subId }) => {
    const context = React.useContext(AppContext)

    let { locale } = context

    return (
        <div className="switch-field text-capitalize">
            <input
                type="radio"
                id={type.replace(/ /g, '_') + '_left' + ':' + subId}
                name="switch"
                value={1}
                onChange={onChange}
                checked={status == 1}
            />
            <label htmlFor={type.replace(/ /g, '_') + '_left' + ':' + subId}>
                {locale.texts[leftLabel.toUpperCase()]}
            </label>

            <input
                type="radio"
                id={type.replace(/ /g, '_') + '_right' + ':' + subId}
                name="switch"
                value={0}
                onChange={onChange}
                checked={status == 0}
            />
            <label htmlFor={type.replace(/ /g, '_') + '_right' + ':' + subId}>
                {locale.texts[rightLabel.toUpperCase()]}
            </label>
        </div>
    )
}

export default Switcher
