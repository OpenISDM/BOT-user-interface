/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        BOTInput.js

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
import { Form, Button } from 'react-bootstrap'

class BOTInput extends React.Component {
    state = {
        value: '',
    }

    componentDidUpdate = (prepProps) => {
        if (
            prepProps.clearSearchResult !== this.props.clearSearchResult &&
            !prepProps.clearSearchResult
        ) {
            this.setState({
                value: '',
            })
        }
    }

    handleChange = (e) => {
        this.setState({
            value: e.target.value,
        })
        this.props.getSearchKey(e.target.value)
    }

    handleKeyPress = (e) => {
        /* Disable key press 'Enter' event */
        if (e.which == 13) {
            e.preventDefault()
        }
    }

    render() {
        const { value } = this.state
        const { placeholder, error, example, name } = this.props

        return (
            <Form>
                <div className="d-flex">
                    <Form.Group
                        className="d-flex align-items-center bg-white border-grey height-regular min-height-regular"
                        style={{
                            padding: '.275rem .75rem',
                        }}
                    >
                        <i className="fas fa-search color-black" />
                        <Form.Control
                            type="text color-grey bg-unset letter-spacing-1"
                            name={name}
                            value={value}
                            onChange={this.handleChange}
                            placeholder={placeholder}
                            onKeyPress={this.handleKeyPress}
                            style={{
                                border: 'none',
                                // letterSpacing: '1.5px',
                            }}
                        />
                    </Form.Group>
                </div>
                {example && (
                    <small className="form-text color-grey">{example}</small>
                )}
                {error && (
                    <small className="form-text text-capitalize color-red">
                        {error}
                    </small>
                )}
            </Form>
        )
    }
}

export default BOTInput
