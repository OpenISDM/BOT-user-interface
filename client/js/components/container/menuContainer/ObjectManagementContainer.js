/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        ObjectManagementContainer.js

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
import { ObjectManagementModule } from '../../../config/pageModules'
import {
	isMobileOnly,
	isTablet,
	MobileOnlyView,
	BrowserView,
	TabletView,
} from 'react-device-detect'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import MobilePageComponent from '../../platform/mobile/mobilePageComponent'
import BrowserPageComponent from '../../platform/browser/BrowserPageComponent'
import TabletPageComponent from '../../platform/tablet/TabletPageComponent'

class ObjectManagementContainer extends React.Component {
	containerModule = ObjectManagementModule

	componentDidMount = () => {
		/** set the scrollability in body disabled */
		if (isMobileOnly || isTablet) {
			const targetElement = document.querySelector('body')
			enableBodyScroll(targetElement)
		}
	}

	componentWillUnmount = () => {
		const targetElement = document.querySelector('body')
		disableBodyScroll(targetElement)
	}

	render() {
		const { location } = this.props

		this.containerModule.defaultActiveKey = location.state
			? location.state.key
			: this.containerModule.defaultActiveKey

		return (
			<Fragment>
				<BrowserView>
					<BrowserPageComponent containerModule={this.containerModule} />
				</BrowserView>
				<TabletView>
					<TabletPageComponent containerModule={this.containerModule} />
				</TabletView>
				<MobileOnlyView>
					<MobilePageComponent containerModule={this.containerModule} />
				</MobileOnlyView>
			</Fragment>
		)
	}
}

export default ObjectManagementContainer
