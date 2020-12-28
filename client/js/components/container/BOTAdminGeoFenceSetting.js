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

import React from 'react'
import { AppContext } from '../../context/AppContext'
import { Row, Col, Form } from 'react-bootstrap'
import BOTButton from '../BOTComponent/BOTButton'
import BOTMap from '../BOTComponent/BOTMap'
import config from '../../config'
import PropTypes from 'prop-types'

const AREAS = {
	CURRENT_COVERED_AREA: 0,
	GLOBAL_AREA: 1,
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
						}}
						text={locale.texts.WHOLE_SITE}
					/>
				</Row>
				<hr />
				<Row>
					<Col xs={12} sm={12} md={6} lg={6} xl={6}>
						<BOTMap showGeoFence={true} />
					</Col>
					<Col xs={12} sm={12} md={6} lg={6} xl={6}>
						<Form>
							<Form.Group controlId="exampleForm.ControlSelect1">
								<Form.Label>Monitored Devices</Form.Label>
								<Form.Control as="select">
									<option>All Devices</option>
								</Form.Control>
							</Form.Group>
							<Form.Group controlId="exampleForm.ControlSelect2">
								<Form.Label>Monitored Patients</Form.Label>
								<Form.Control as="select">
									<option>All Patinets</option>
								</Form.Control>
							</Form.Group>
							<Form.Group controlId="exampleForm.ControlSelect3">
								<Form.Label>Other Monitored Objects</Form.Label>
								<Form.Control as="select">
									<option>Contractors</option>
								</Form.Control>
							</Form.Group>
						</Form>
						<Form>
							<Form.Group controlId="exampleForm.ControlSelect1">
								<Form.Label>On Time</Form.Label>
								<Form.Control as="select">
									<option>Always</option>
								</Form.Control>
							</Form.Group>
							<Form.Label>Alerts</Form.Label>
							<Form.Group controlId="exampleForm.ControlSelect2">
								<Form.Label>Clear/Reset</Form.Label>
								<Form.Control as="select">
									<option>Manually</option>
								</Form.Control>
							</Form.Group>
							<Form.Group controlId="exampleForm.ControlSelect3">
								<Form.Label>Other Monitored Objects</Form.Label>
								<Form.Control as="select">
									<option>1</option>
									<option>2</option>
									<option>3</option>
								</Form.Control>
							</Form.Group>
						</Form>
						<Col>
							<Row>
								<Col>
									<Form>
										<Form.Label>Day Shift</Form.Label>
										<Form>
											<Form.Check
												custom
												type={'switch'}
												id={'day-shift-1'}
												label={'Message on GUI'}
											/>
											<Form.Check
												custom
												type={'switch'}
												id={'day-shift-2'}
												label={'Flashing Lights'}
											/>
											<Form.Check
												custom
												type={'switch'}
												id={'day-shift-3'}
												label={'Alert bells'}
											/>
											<Form.Check
												custom
												type={'switch'}
												id={'day-shift-4'}
												label={'Others'}
											/>
										</Form>
									</Form>
								</Col>
								<Col>
									<Form>
										<Form.Label>Swing Shift</Form.Label>
										<Form>
											<Form.Check
												custom
												type={'switch'}
												id={'swing-shift-1'}
												label={'Message on GUI'}
											/>
											<Form.Check
												custom
												type={'switch'}
												id={'swing-shift-2'}
												label={'Flashing Lights'}
											/>
											<Form.Check
												custom
												type={'switch'}
												id={'swing-shift-3'}
												label={'Alert bells'}
											/>
											<Form.Check
												custom
												type={'switch'}
												id={'swing-shift-4'}
												label={'Others'}
											/>
										</Form>
									</Form>
								</Col>
								<Col>
									<Form>
										<Form.Label>Night Shift</Form.Label>
										<Form>
											<Form.Check
												custom
												type={'switch'}
												id={'night-shift-1'}
												label={'Message on GUI'}
											/>
											<Form.Check
												custom
												type={'switch'}
												id={'night-shift-2'}
												label={'Flashing Lights'}
											/>
											<Form.Check
												custom
												type={'switch'}
												id={'night-shift-3'}
												label={'Alert bells'}
											/>
											<Form.Check
												custom
												type={'switch'}
												id={'night-shift-4'}
												label={'Others'}
											/>
										</Form>
									</Form>
								</Col>
							</Row>
						</Col>
					</Col>
				</Row>
			</Col>
		)
	}
}

BOTAdminGeoFenceSetting.propTypes = {}

export default BOTAdminGeoFenceSetting
