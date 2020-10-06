/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        DataTimePicker.js

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
import Select from 'react-select'
import { AppContext } from '../../context/AppContext'
import styleConfig from '../../config/styleConfig'

let style = {
    error: {
        color: '#dc3545',
    },
}

class DateTimePicker extends React.Component {
    static contextType = AppContext

    state = {
        length: 24,
    }

    onChange = (value) => {
        let id = this.props.id
        this.props.getValue(value, this.props.name, id)
    }

    render() {
        let { locale } = this.context

        let { value, error, error_tip } = this.props

        let options = Array.from(Array(this.state.length + 1).keys())
            .filter((index) => {
                return (
                    index >= parseInt(this.props.start) &&
                    index <= parseInt(this.props.end)
                )
            })
            .map((index) => {
                return {
                    value: `${index}:00`,
                    label: `${index}:00`,
                }
            })
        let defaultValue = value
            ? {
                  value: value,
                  label: value,
              }
            : ''

        return (
            <div>
                <Select
                    name="timepicker"
                    placeholder={locale.texts.SELECT_TIME}
                    value={defaultValue}
                    onChange={(value) => this.onChange(value)}
                    options={options}
                    isSearchable={false}
                    styles={styleConfig.reactSelect}
                    controlHeigh={20}
                    components={{
                        IndicatorSeparator: () => null,
                    }}
                />
                {error && (
                    <small
                        className="form-text text-capitaliz"
                        style={style.error}
                    >
                        {error_tip}
                    </small>
                )}
            </div>
        )
    }
}

export default DateTimePicker
