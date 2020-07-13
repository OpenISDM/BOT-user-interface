/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

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

import React, { Component } from 'react';
import { 
    Modal, 
    Image, 
    Button,
} from 'react-bootstrap';
import config from '../../config';
import LocaleContext from '../../context/LocaleContext';
import AuthContext from '../../context/AuthenticationContext';
import { 
    Formik, 
    Field, 
    Form, 
    ErrorMessage 
} from 'formik';
import * as Yup from 'yup';
import {
    CenterContainer
} from '../BOTComponent/styleComponent';
import styleConfig from '../../config/styleConfig';
import FormikFormGroup from '../presentational/FormikFormGroup';
import { 
    Link, 
    useHistory
} from 'react-router-dom';
import { set } from 'js-cookie';
import apiHelper from '../../helper/apiHelper';



const imageLength = 80;

const handleClick = (e) => {
    console.log(e.target)
    let {
        name
    } = e.target
    // switch(name) {
    //     case 'forget password'
    // }
}

const ForgetPassword = () => {

    let locale = React.useContext(LocaleContext);
    let auth = React.useContext(AuthContext);
    let history = useHistory();
    return (
        <CenterContainer>
            <div className='d-flex justify-content-center'>
                <Image 
                    src={config.LOGO} 
                    rounded 
                    width={imageLength} 
                    height={imageLength} 
                />
            </div>
            <div className='d-flex justify-content-center'>
                <div className="title mt-1 mb-4">
                    {locale.texts.SLOGAN}
                </div>
            </div>
            <Formik
                initialValues = {{
                    email: '',
                }}

                validationSchema = {
                    Yup.object().shape({
 
                })}

                onSubmit={(values, {setStatus} ) => {
                    console.log(values)
                    const {
                        email
                    } = values

                    apiHelper.userApiAgent.sentResetPwdInstruction({
                        email
                    })
                    .then(res => {
                        console.log(res)
                    })
                    .catch(err => {
                        console.log(err)
                    })
                }}

                render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                    <Form>
                        {status &&
                            <div 
                                className='alert alert-danger mb-2 warning'
                            >
                                <i className="fas fa-times-circle mr-2"/>
                                {locale.texts[status.toUpperCase().replace(/ /g, "_")]}
                            </div>
                        }
                        <FormikFormGroup 
                            type="text"
                            name="email"
                            className="mb-4"
                            label={locale.texts.EMAIL}    
                        />  
                        <div className='d-flex justify-content-start'>
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

export default ForgetPassword;