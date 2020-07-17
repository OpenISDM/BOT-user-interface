/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        App.js

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

import React from 'react';
import AppContext from './js/context/AppContext';
import PrivateRoutes from '../src/js/PrivateRoutes';
import { ToastContainer } from 'react-toastify';
import config from './js/config';
import { 
    BrowserRouter,
    Route,  
    Switch
} from 'react-router-dom';
import SigninPage from './js/components/authentication/SigninPage';
import ForgetPassword from './js/components/authentication/ForgetPassword';
import ResetPassword from './js/components/authentication/ResetPassword';
import ResetPasswordResult from './js/components/authentication/ResetPasswordResult';

const App = () => {
    return (
        <AppContext>
            <BrowserRouter>     
                <Switch>
                    <Route path='/login' exact component={SigninPage} />
                    <Route path='/resetpassword' exact component={ForgetPassword} />
                    <Route path='/resetpassword/new/:token' exact component={ResetPassword} />
                    <Route path='/resetpassword/success' exact component={ResetPasswordResult} />
                    <PrivateRoutes />
                </Switch>
            </BrowserRouter>
            <ToastContainer {...config.TOAST_PROPS} />
        </AppContext>
    );
};

export default App;



