/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        MobileMapContainer.js

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
import QRcodeContainer from '../../container/QRcode'
import { AppContext } from '../../../context/AppContext'
import InfoPrompt from '../../presentational/InfoPrompt'
import config from '../../../config'
import { Nav, Button } from 'react-bootstrap'
import AccessControl from '../../authentication/AccessControl'
import Map from '../../presentational/Map'

export default class TabletMapContainer extends React.Component {
	static contextType = AppContext

	render() {
		const { locale, stateReducer, auth } = this.context

		const {
			locationMonitorConfig,
			proccessedTrackingData,
			showPdfDownloadForm,
			handleClickButton,
			authenticated,
			searchObjectArray,
			pinColorArray,
			searchKey,
			handleClick,
			getSearchKey,
		} = this.props

		const [{ area }] = stateReducer

		const style = {
			mapForMobile: {
				// width: '90vw',
				border: 'solid 2px rgba(227, 222, 222, 0.619)',
				padding: '5px',
			},
			mapBlock: {
				border: 'solid 2px rgba(227, 222, 222, 0.619)',
				padding: '5px',
			},
		}

		return (
			<div style={style.mapForMobile}>
				<Map
					pathMacAddress={this.props.pathMacAddress}
					colorPanel={this.props.colorPanel}
					proccessedTrackingData={proccessedTrackingData}
					lbeaconPosition={this.props.lbeaconPosition}
					locationMonitorConfig={this.props.locationMonitorConfig}
					getSearchKey={this.props.getSearchKey}
					mapConfig={config.mapConfig}
					handleClosePath={this.props.handleClosePath}
					handleShowPath={this.props.handleShowPath}
					showPath={this.props.showPath}
					searchObjectArray={searchObjectArray}
					pinColorArray={pinColorArray}
					searchKey={searchKey}
					getSearchKey={getSearchKey}
				/>
			</div>
		)
	}
}
