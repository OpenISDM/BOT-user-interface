/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        Entry.js

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
import { BrowserRouter as Router,Switch, Route,  } from 'react-router-dom';
import NavbarContainer from './js/components/container/NavbarContainer'
import { renderRoutes } from 'react-router-config';
import routes from './js/config/routes';
import { ToastContainer } from 'react-toastify';
import config from './js/config';
import AccessControl from './js/components/presentational/AccessControl';
import SigninPage from './js/components/presentational/SigninPage';

const Entry = () => {
    
    return (
        <Router>          
            <AccessControl
                renderNoAccess={() => <SigninPage/>}
            >
                <NavbarContainer/>
                <Switch>
                    {renderRoutes(routes)}
                </Switch>
            </AccessControl>
            <ToastContainer {...config.TOAST_PROPS} />
        </Router>

    );
};

export default Entry;



