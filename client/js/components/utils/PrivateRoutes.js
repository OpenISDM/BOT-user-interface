/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        PrivateRoutes.js

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

import React, { Fragment } from 'react'
import { Redirect, Route } from 'react-router-dom'
import NavbarContainer from '../container/NavbarContainer'
import privateRoutes from '../../config/routes/privateRoutesConfig'
import { AppContext } from '../../context/AppContext'
import routes from '../../config/routes/routes'

const PrivateRoutes = () => {
	const { auth } = React.useContext(AppContext)

	const { pathname } = window.location

	if (auth.authenticated && auth.user) {
		return (
			<Fragment>
				<NavbarContainer />
				{privateRoutes.map((route) => {
					return <Route path={route.path} exact component={route.component} />
				})}
			</Fragment>
		)
	} else if (pathname != routes.HOME && pathname.split('/')[1] != 'page') {
		return <Redirect to={{ pathname: window.location.pathname, state: {} }} />
	}

	return <Redirect to={{ pathname: routes.LOGIN, state: {} }} />
}

export default PrivateRoutes
