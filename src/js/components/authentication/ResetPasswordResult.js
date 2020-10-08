/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        ResetPasswordResult.js

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

import React, { Component } from 'react'
import { Modal, Image, Button } from 'react-bootstrap'
import config from '../../config'
import LocaleContext from '../../context/LocaleContext'
import AuthContext from '../../context/AuthenticationContext'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { CenterContainer , PageTitle, Title } from '../BOTComponent/styleComponent'
import styleConfig from '../../config/styleConfig'
import FormikFormGroup from '../presentational/FormikFormGroup'
import { Link, useHistory } from 'react-router-dom'
import { set } from 'js-cookie'
import apiHelper from '../../helper/apiHelper'

import styleSheet from '../../config/styleSheet'

const imageLength = 160

const ResetPasswordResult = ({ match }) => {
    const locale = React.useContext(LocaleContext)
    const auth = React.useContext(AuthContext)
    const history = useHistory()
    return (
        <CenterContainer
            style={{
                textAlign: 'center',
            }}
        >
            <div className="mb-2">
                <i
                    className="fa fa-check-circle"
                    aria-hidden="true"
                    style={{
                        fontSize: imageLength,
                        color: styleSheet.theme,
                    }}
                />
            </div>
            <div className="mb-2">{locale.texts.PASSWORD_RESET_SUCCESSFUL}</div>
            <Link to={'/login'}>{locale.texts.SIGN_IN}</Link>
        </CenterContainer>
    )
}

export default ResetPasswordResult
