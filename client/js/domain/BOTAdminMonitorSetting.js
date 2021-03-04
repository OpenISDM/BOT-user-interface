import React from 'react'
import { AppContext } from '../context/AppContext'
import { Row, Col } from 'react-bootstrap'
import Button from '../components/Button'
import BOTAdminGeoFenceSetting from './BOTAdminGeoFenceSetting'
import BOTAdminVitalSignSetting from './BOTAdminVitalSignSetting'

const pages = {
	GEO_FENCE: 0,
	MOVEMENT_MONITOR: 1,
	PATIENT_SAFETY_NOTIFICATION: 2,
	VITAL_SIGN_ALERT: 2,
	EMERGENCY_ALERT: 3,
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
			case pages.GEO_FENCE:
				subPage = <BOTAdminGeoFenceSetting />
				break
			case pages.MOVEMENT_MONITOR:
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
			case pages.PATIENT_SAFETY_NOTIFICATION:
				subPage = <BOTAdminVitalSignSetting />
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
			<Col>
				<Row>
					<Button
						pressed={this.checkButtonIsPressed(pages.GEO_FENCE)}
						style={style.pageButtons}
						onClick={() => {
							this.setCurrentPage(pages.GEO_FENCE)
						}}
						text={locale.texts.GEOFENCE}
					/>
					<Button
						pressed={this.checkButtonIsPressed(pages.MOVEMENT_MONITOR)}
						style={style.pageButtons}
						onClick={() => {
							this.setCurrentPage(pages.MOVEMENT_MONITOR)
						}}
						text={locale.texts.MOVEMENT_MONITOR}
					/>
					<Button
						pressed={this.checkButtonIsPressed(pages.EMERGENCY_ALERT)}
						style={style.pageButtons}
						onClick={() => {
							this.setCurrentPage(pages.EMERGENCY_ALERT)
						}}
						text={locale.texts.EMERGENCY_ALERT}
					/>
					<Button
						pressed={this.checkButtonIsPressed(
							pages.PATIENT_SAFETY_NOTIFICATION
						)}
						style={style.pageButtons}
						onClick={() => {
							this.setCurrentPage(pages.PATIENT_SAFETY_NOTIFICATION)
						}}
						text={locale.texts.PATIENT_SAFETY_NOTIFICATION}
					/>
				</Row>
				<Row>
					<Col
						style={{
							backgroundColor: 'rgb(229,229,229)',
							height: '1px',
							marginTop: '10px',
							marginBottom: '10px',
						}}
					></Col>
				</Row>
				{this.checkToRenderSubPage(locale)}
			</Col>
		)
	}
}

export default BOTAdminMonitorSetting
