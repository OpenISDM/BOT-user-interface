/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        SystemAdminMonitorSetting.js

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
import { Row, Col, Form, Tabs, Tab } from 'react-bootstrap'
import BOTButton from '../BOTComponent/BOTButton'
import Map from '../presentational/Map'
import config from '../../config'
import PropTypes from 'prop-types'
import { MapContainer, ImageOverlay } from 'react-leaflet'
import { CRS, getBounds } from 'leaflet'

const pages = {
	GEO_FENCES: 0,
	MOVEMENT_MONITORS: 1,
	EMERGENCY_ALERT: 2,
}

class SystemAdminMonitorSetting extends React.Component {
	static contextType = AppContext

	state = {
		buttonSelected: pages.GEO_FENCES,
	}

	componentDidMount = () => {}

	componentDidUpdate = (prevProps, prevState) => {
		if (this.state.exIndex !== this.props.nowIndex) {
			this.setState({
				exIndex: this.props.nowIndex,
			})
		}
		if (this.context.locale.abbr !== prevState.locale) {
			this.setState({
				locale: this.context.locale.abbr,
			})
		}
	}

	checkButtonIsPressed = (identity) => this.state.buttonSelected === identity

	setCurrentPage = (identity) => {
		this.setState({
			buttonSelected: identity,
		})
	}

	checkToRenderSubPage = (locale) => {
		let subPage

		const mapConfig = {
			crs: CRS.Simple,
			zoom: -5.5,
			minZoom: -5.46,
			maxZoom: -1,
			zoomDelta: 0.25,
			zoomSnap: 0,
			zoomControl: true,
			attributionControl: false,
			dragging: true,
			doubleClickZoom: false,
			scrollWheelZoom: false,
			maxBoundsOffset: [-10000, 10000],
			maxBoundsViscosity: 0.0,
			bounds: [
				[0, 0],
				[9042, 6302],
			],
		}

		switch (this.state.buttonSelected) {
			case pages.GEO_FENCES:
				subPage = (
					<Col>
						<Row>
							<BOTButton pressed={true} text={'畢迪科技'} />
							<BOTButton text={'公共區域'} />
						</Row>
						<hr />
						<Row>
							<Col xs={12} sm={12} md={6} lg={6} xl={6}>
								<MapContainer
									{...mapConfig}
									style={{
										height: '100%',
										width: '100%',
										backgroundColor: 'white',
									}}
								>
									<ImageOverlay
										bounds={mapConfig.bounds}
										url="../../../../site_module/img/map/bidae_tech.png"
									/>
								</MapContainer>
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

SystemAdminMonitorSetting.propTypes = {}

export default SystemAdminMonitorSetting
