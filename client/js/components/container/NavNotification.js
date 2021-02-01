import React from 'react'
import { isEmpty } from 'lodash'
import NotificationBadge, { Effect } from 'react-notification-badge'
import { Row, Dropdown, Button } from 'react-bootstrap'
import { AppContext } from '../../context/AppContext'
import config from '../../config'
import { getDescription } from '../../helper/descriptionGenerator'
import apiHelper from '../../helper/apiHelper'
import { setSuccessMessage } from '../../helper/messageGenerator'
import { withRouter } from 'react-router-dom'
import { SET_OPENED_NOTIFICATION } from '../../reducer/action'
import moment from 'moment'
import PropTypes from 'prop-types'

class NavNotification extends React.Component {
	static contextType = AppContext

	state = {
		emergency: [],
		lowBattery: [],
		locale: this.context.locale.abbr,
	}

	componentWillUnmount = () => {
		clearInterval(this.interval)
	}

	componentDidMount = () => {
		this.getTrackingData()
		this.interval = setInterval(
			this.getTrackingData,
			config.mapConfig.intervalTime
		)
	}

	getTrackingData = async () => {
		const [{ area, openedNotification }, dispatch] = this.context.stateReducer
		const res = await apiHelper.notificationApiAgent.getAllNotifications({
			areaId: area.id,
		})

		if (res) {
			this.setState({
				emergency: res.data.emergency,
				lowBattery: res.data.lowBattery,
				locale: this.context.locale.abbr,
			})

			if (!isEmpty(openedNotification) && res.data.emergency.length === 0) {
				dispatch({
					type: SET_OPENED_NOTIFICATION,
					value: {},
				})
			}
		}
	}

	handleSubmit = async () => {
		const [{ openedNotification }, dispatch] = this.context.stateReducer
		const { notificaiton } = openedNotification

		const res = await apiHelper.notificationApiAgent.turnOffNotification({
			notificationId: notificaiton.id,
		})

		if (res) {
			await setSuccessMessage('save success')
			dispatch({
				type: SET_OPENED_NOTIFICATION,
				value: {},
			})
		}
	}

	render() {
		const { history } = this.props
		const { emergency, lowBattery } = this.state
		const { locale, stateReducer } = this.context
		const [, dispatch] = stateReducer
		const style = {
			list: {
				height: '40px',
				width: '600px',
				justifyContent: 'space-between',
			},
			title: {
				background: '#8080801a',
				fontSize: '1rem',
				minWidth: 300,
			},
			icon: {
				fontSize: '15px',
			},
		}

		return (
			<>
				<Dropdown>
					<Dropdown.Toggle
						variant="light"
						id="battery-notice-btn"
						bsPrefix="bot-dropdown-toggle"
					>
						<i className="fas fa-bell" style={style.icon}>
							<NotificationBadge
								count={emergency.length}
								effect={Effect.SCALE}
								style={{
									top: '-28px',
									right: '-10px',
								}}
							/>
						</i>
					</Dropdown.Toggle>
					<Dropdown.Menu
						flip={false}
						bsPrefix="bot-dropdown-menu-right dropdown-menu"
					>
						<div className="px-5 py-2" style={style.title}>
							<Row>
								<div className="d-inline-flex justify-content-start">
									{locale.texts.EMERGENCY_ALERT}
								</div>
							</Row>
						</div>
						<div className="overflow-hidden-scroll custom-scrollbar">
							{emergency.length !== 0 ? (
								emergency.map(({ object, notificaiton }, index) => {
									let monitorTypeString = ''
									if (
										parseInt(notificaiton.monitor_type) ===
										config.MONITOR_TYPE.GEO_FENCE
									) {
										monitorTypeString = locale.texts.GEOFENCE_ALERT
									} else if (
										parseInt(notificaiton.monitor_type) ===
										config.MONITOR_TYPE.EMERGENCY
									) {
										monitorTypeString = locale.texts.EMERGENCY_ALERT
									}

									const violationTimestamp = moment(
										notificaiton.violation_timestamp
									)
										.locale(locale.abbr)
										.format('HH:mm:ss')

									return (
										<Dropdown.Item
											key={index}
											style={{ color: 'black' }}
											onMouseEnter={() => {
												dispatch({
													type: SET_OPENED_NOTIFICATION,
													value: {
														monitorTypeString,
														object,
														notificaiton,
													},
												})

												history.push('/')
											}}
										>
											<Row style={style.list}>
												<Button variant="light" disabled={true}>
													&#8729;{monitorTypeString}:{' '}
													{`${object.areaName}, ${object.name} ${violationTimestamp}`}
												</Button>
												<Button variant="primary" onClick={this.handleSubmit}>
													{locale.texts.CLOSE_ALERT}
												</Button>
											</Row>
										</Dropdown.Item>
									)
								})
							) : (
								<Dropdown.Item disabled>{locale.texts.NO_ALERT}</Dropdown.Item>
							)}
						</div>
					</Dropdown.Menu>
				</Dropdown>

				<Dropdown style={{ marginLeft: '1px' }}>
					<Dropdown.Toggle
						variant="light"
						id="battery-notice-btn"
						bsPrefix="bot-dropdown-toggle"
					>
						<i className="fas fa-battery-quarter" style={{ color: '#ff6600' }}>
							<NotificationBadge
								count={lowBattery.length}
								effect={Effect.SCALE}
								style={{
									top: '-28px',
									right: '-10px',
								}}
							/>
						</i>
					</Dropdown.Toggle>
					<Dropdown.Menu
						alignRight
						bsPrefix="bot-dropdown-menu-right dropdown-menu "
					>
						<div className="px-5 py-2" style={style.title}>
							<Row>
								<div className="d-inline-flex justify-content-start">
									{locale.texts.BATTERY_NOTIFICATION}
								</div>
							</Row>
						</div>
						<div className="overflow-hidden-scroll custom-scrollbar">
							{lowBattery.length !== 0 ? (
								lowBattery.map(({ object }) => {
									return (
										<Dropdown.Item
											disabled
											key={object.mac_address}
											style={{ color: 'black' }}
										>
											<div style={style.list}>
												<p className="d-inline-block mx-2">&#8729;</p>
												{`${object.areaName}, `}
												{getDescription({
													item: object,
													locale,
													keywordType: config,
												})}
												{`${locale.texts.BATTERY_VOLTAGE}: ${(
													object['extend.battery_voltage'] / 10
												).toFixed(1)}`}
											</div>
										</Dropdown.Item>
									)
								})
							) : (
								<Dropdown.Item disabled>
									{locale.texts.NO_NOTIFICATION}
								</Dropdown.Item>
							)}
						</div>
					</Dropdown.Menu>
				</Dropdown>
			</>
		)
	}
}

NavNotification.propTypes = {
	history: PropTypes.func,
}

export default withRouter(NavNotification)
