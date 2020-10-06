/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        RemoveUserConfirmForm.js

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
import { Col, Row, ListGroup, Modal, Button } from 'react-bootstrap'

import axios from 'axios'
import Cookies from 'js-cookie'
import LocaleContext from '../../../context/LocaleContext'
import dataSrc from '../../../dataSrc'
import AddableList from './AddableList'

const Fragment = React.Fragment

class RemoveUserConfirm extends React.Component {
    constructor() {
        super()
        this.state = {
            userInfo: null,
            show: false,
        }
        this.staticParameter = {
            userRole: null,
        }
        this.API = {
            openUserInfo: (userInfo) => {
                this.state.userInfo = userInfo
                this.setState({})
            },
            closeUserInfo: () => {
                // this.staticParameter.userRole = null
                this.state.userInfo = null
                this.setState({})
            },
        }
        this.closeModifyUserInfo = this.closeModifyUserInfo.bind(this)
        this.submitModifyUserInfo = this.submitModifyUserInfo.bind(this)
    }

    closeModifyUserInfo() {
        this.props.onClose()
    }
    submitModifyUserInfo() {
        this.props.onSubmit()
    }

    render() {
        const locale = this.context

        return (
            <Modal show={this.props.show} onHide={this.closeModifyUserInfo}>
                <Modal.Header closeButton className="font-weight-bold">
                    {locale.REMOVE_USER_CONFIRM}
                </Modal.Header>
                <Modal.Body className="d-block d-flex justify-content-center">
                    <h2>{'Remove User ' + this.props.user}</h2>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        className="bg-light text-primary"
                        onClick={this.closeModifyUserInfo}
                    >
                        Cancel
                    </Button>
                    <Button onClick={this.submitModifyUserInfo}>Submit</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}
RemoveUserConfirm.contextType = LocaleContext

export default RemoveUserConfirm
