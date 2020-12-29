/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        BOTAdminGeoFenceSetting.js

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

import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { Row, Col, Form } from 'react-bootstrap'
import BOTButton from '../BOTComponent/BOTButton'
import BOTMap from '../BOTComponent/BOTMap'
import config from '../../config'
import apiHelper from '../../helper/apiHelper'
import NoticiationTypeConfig from '../container/NoticiationTypeConfig'
import PropTypes from 'prop-types'

const AREAS = {
	CURRENT_COVERED_AREA: 0,
	GLOBAL_AREA: 1,
}

const SHIFT_NAME = {
	DAY_SHIFT: 'DAY_SHIFT',
	SWING_SHIFT: 'SWING_SHIFT',
	NIGHT_SHIFT: 'NIGHT_SHIFT',
}

class BOTAdminGeoFenceSetting extends React.Component {
	static contextType = AppContext

	state = {
		buttonSelected: AREAS.CURRENT_COVERED_AREA,
	}

	checkButtonIsPressed = (identity) => this.state.buttonSelected === identity

	setCurrentPressedButton = (identity) => {
		this.setState({
			buttonSelected: identity,
		})
	}

	submit = async () => {
		const areaConfig = {
			area_id: 3,
			monitorDeviceNameListids: [4, 3, 2],
			monitorPatientNameListids: [12, 23, 65],
			montiorObjectTypes: ['Patient', 'Vistor', 'Staff'],
			dayShift: {
				name: SHIFT_NAME.DAY_SHIFT,
				alert_last_sec: 0,
				active_alert_types: 1,
				enable: 1,
				start_time: '00:00:00',
				end_time: '10:00:00',
			},
			swingShift: {
				name: SHIFT_NAME.SWING_SHIFT,
				alert_last_sec: 0,
				active_alert_types: 3,
				enable: 1,
				start_time: '10:00:00',
				end_time: '16:00:00',
			},
			nightShift: {
				name: SHIFT_NAME.NIGHT_SHIFT,
				alert_last_sec: 0,
				active_alert_types: 7,
				enable: 1,
				start_time: '16:00:00',
				end_time: '23:59:59',
			},
		}

		const res = await apiHelper.geofenceApis.setGeofenceAreaConfig({
			areaConfig,
		})
	}

	render() {
		const { locale, stateReducer } = this.context
		const [{ area }] = stateReducer
		const currentAreaModule = Object.values(config.mapConfig.AREA_MODULES).find(
			(module) => parseInt(module.id) === parseInt(area.id)
		)

		const style = {}

		return (
			<Col>
				<Row>
					<BOTButton
						pressed={this.checkButtonIsPressed(AREAS.CURRENT_COVERED_AREA)}
						onClick={() => {
							this.setCurrentPressedButton(AREAS.CURRENT_COVERED_AREA)
						}}
						text={locale.texts[currentAreaModule.name]}
					/>
					<BOTButton
						pressed={this.checkButtonIsPressed(AREAS.GLOBAL_AREA)}
						onClick={() => {
							this.setCurrentPressedButton(AREAS.GLOBAL_AREA)
							this.submit()
						}}
						text={locale.texts.WHOLE_SITE}
					/>
				</Row>
				<hr />
				<Row style={{ height: '350px' }}>
					<BOTMap showGeoFence={true} />
				</Row>
				<hr />
				<div
					className="font-size-120-percent color-black d-flex justify-content-center"
					style={{ paddingBottom: '5px' }}
				>
					Monitored Objects
				</div>
				<Form.Row>
					<Form.Group as={Col} controlId="exampleForm.ControlSelect1">
						<Form.Label> Devices</Form.Label>
						<Form.Control as="select">
							<option>All Devices</option>
						</Form.Control>
					</Form.Group>
					<Form.Group as={Col} controlId="exampleForm.ControlSelect2">
						<Form.Label> Patients</Form.Label>
						<Form.Control as="select">
							<option>All Patinets</option>
						</Form.Control>
					</Form.Group>
					<Form.Group as={Col} controlId="exampleForm.ControlSelect3">
						<Form.Label>Other </Form.Label>
						<Form.Control as="select">
							<option>Contractors</option>
						</Form.Control>
					</Form.Group>
				</Form.Row>
				<hr />
				<div
					className="font-size-120-percent color-black d-flex justify-content-center"
					style={{ paddingBottom: '5px' }}
				>
					Alert
				</div>
				<Row>
					<NoticiationTypeConfig name={locale.texts.DAY_SHIFT} />
					<NoticiationTypeConfig name={locale.texts.SWING_SHIFT} />
					<NoticiationTypeConfig name={locale.texts.NIGHT_SHIFT} />
				</Row>
			</Col>
		)
	}
}

BOTAdminGeoFenceSetting.propTypes = {}

export default BOTAdminGeoFenceSetting
