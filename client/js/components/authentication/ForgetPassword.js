/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        ForgetPassword.js

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
import { object, string } from 'yup'
import {
    CenterContainer,
    Title,
    Paragraph,
} from '../BOTComponent/styleComponent'
import FormikFormGroup from '../presentational/FormikFormGroup'
import { Link, useHistory } from 'react-router-dom'
import apiHelper from '../../helper/apiHelper'
import { emailValidation } from '../../helper/validation'
import ImageWebp from '../utils/ImageWebp'

const imageLength = 80

const ForgetPassword = () => {
    const locale = React.useContext(LocaleContext)
    const auth = React.useContext(AuthContext)
    const history = useHistory()

    return (
        <CenterContainer>
            <div className="d-flex justify-content-center">
                <ImageWebp
                    alt="logo"
                    src={config.LOGO}
                    srcWebp={config.LOGO_WEBP}
                    width={imageLength}
                />
            </div>
            <div className="d-flex justify-content-center">
                <div className="title mt-1 mb-4">{locale.texts.SLOGAN}</div>
            </div>
            <Formik
                initialValues={{
                    email: '',
                }}
                validationSchema={object().shape({
                    email: string()
                        .required(locale.texts.REQUIRED)
                        .test(
                            'email',
                            locale.texts.EMAIL_ADDRESS_FORMAT_IS_INCORRECT,
                            emailValidation
                        ),
                })}
                onSubmit={(values, { setStatus }) => {
                    const { email } = values
                    setStatus('verifying')
                    apiHelper.authApiAgent
                        .sentResetPwdInstruction({
                            email,
                        })
                        .then((res) => {
                            history.push('/resetpassword/instruction')
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }}
                render={({
                    values,
                    errors,
                    status,
                    touched,
                    isSubmitting,
                    setFieldValue,
                }) => (
                    <Form>
                        {errors.email && touched.email && (
                            <div className="alert alert-danger mb-2 warning">
                                <i className="fas fa-times-circle mr-2" />
                                {errors.email}
                            </div>
                        )}
                        <Title page>{locale.texts.FORGET_PASSWORD}</Title>
                        <Paragraph>
                            {locale.texts.REQUEST_EMAIL_INSTRUCTION}
                        </Paragraph>

                        <FormikFormGroup
                            type="text"
                            name="email"
                            className="my-4"
                            label={locale.texts.EMAIL}
                        />
                        <div className="d-flex justify-content-start">
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isSubmitting}
                            >
                                {locale.texts.SEND_RESET_INSTRUCTION}
                            </Button>
                        </div>
                    </Form>
                )}
            />
        </CenterContainer>
    )
}

export default ForgetPassword
