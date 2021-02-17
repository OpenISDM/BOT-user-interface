import React from 'react'
import { AppContext } from '../context/AppContext'
import { Row, Col } from 'react-bootstrap'
import BOTButton from '../components/BOTButton'
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
