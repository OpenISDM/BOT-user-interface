/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        BOTAdminMonitorSetting.js

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
import { AppContext } from '../../context/AppContext'
import { Row, Col } from 'react-bootstrap'
import BOTButton from '../BOTComponent/BOTButton'
import BOTAdminGeoFenceSetting from './BOTAdminGeoFenceSetting'

const pages = {
	GEO_FENCES: 0,
	MOVEMENT_MONITORS: 1,
	EMERGENCY_ALERT: 2,
}

class BOTAdminMonitorSetting extends React.Component {
	static contextType = AppContext

	state = {
		buttonSelected: pages.GEO_FENCES,
	}

	checkButtonIsPressed = (identity) => this.state.buttonSelected === identity

	setCurrentPage = (identity) => {
		this.setState({
			buttonSelected: identity,
		})
	}

	checkToRenderSubPage = (locale) => {
		let subPage

		switch (this.state.buttonSelected) {
			case pages.GEO_FENCES:
				subPage = <BOTAdminGeoFenceSetting />
				break
			case pages.MOVEMENT_MONITORS:
				subPage = (
					<>
						<div className="color-black mb-2 font-size-120-percent">
							{/* <ButtonToolbar>
								<PrimaryButton name={'SAVE'} onClick={this.updateDeviceAliases}>
									{locale.texts.SAVE}
								</PrimaryButton>
							</ButtonToolbar> */}
						</div>
					</>
				)
				break
			case pages.EMERGENCY_ALERT:
				subPage = (
					<>
						<div className="color-black mb-2 font-size-120-percent">
							{locale.texts.EMERGENCY_ALERT}
						</div>
						<div className="color-black mb-2 font-size-120-percent">
							{/* <ButtonToolbar>
								<PrimaryButton
									name={'SAVE'}
									onClick={this.updatePatientNickname}
								>
									{locale.texts.SAVE}
								</PrimaryButton>
							</ButtonToolbar> */}
						</div>
					</>
				)
				break

			default:
				break
		}

		return subPage
	}

	render() {
		const { locale } = this.context

		const style = {
			pageButtons: {
				width: '200px',
			},
		}

		return (
			<>
				<Col>
					<Row>
						<BOTButton
							pressed={this.checkButtonIsPressed(pages.GEO_FENCES)}
							style={style.pageButtons}
							onClick={() => {
								this.setCurrentPage(pages.GEO_FENCES)
							}}
							text={locale.texts.GEOFENCE}
						/>
						<BOTButton
							pressed={this.checkButtonIsPressed(pages.MOVEMENT_MONITORS)}
							style={style.pageButtons}
							onClick={() => {
								this.setCurrentPage(pages.MOVEMENT_MONITORS)
							}}
							text={locale.texts.MOVEMENT_MONITOR}
						/>
						<BOTButton
							pressed={this.checkButtonIsPressed(pages.EMERGENCY_ALERT)}
							style={style.pageButtons}
							onClick={() => {
								this.setCurrentPage(pages.EMERGENCY_ALERT)
							}}
							text={locale.texts.EMERGENCY_ALERT}
						/>
					</Row>
					<hr />
					{this.checkToRenderSubPage(locale)}
				</Col>
			</>
		)
	}
}

export default BOTAdminMonitorSetting
