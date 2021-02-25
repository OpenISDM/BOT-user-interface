import React, { useState, useContext } from 'react'
import { isEmpty } from 'lodash'
import NotificationBadge, { Effect } from 'react-notification-badge'
import { Row, Dropdown, Button } from 'react-bootstrap'
import { AppContext } from '../context/AppContext'
import config from '../config'
import { getDescription } from '../helper/descriptionGenerator'
import API from '../api'
import { setSuccessMessage } from '../helper/messageGenerator'
import { withRouter } from 'react-router-dom'
import { SET_OPENED_NOTIFICATION } from '../reducer/action'
import moment from 'moment'
import PropTypes from 'prop-types'

class NavNotification extends React.Component {
	static contextType = AppContext

	state = {
		notificaitonList: [],
		lowBatteryList: [],
		locale: this.context.locale.abbr,
	}

	componentWillUnmount = () => {
		clearInterval(this.interval)
	}

	componentDidMount = () => {
		this.getAllNotifications()
		this.interval = setInterval(
			this.getAllNotifications,
			config.mapConfig.intervalTime
		)
	}

	getAllNotifications = async () => {
		const [{ area, openedNotification }, dispatch] = this.context.stateReducer
		const res = await API.Notification.getAllNotifications({
			areaId: area.id,
		})

		if (res) {
			this.setState({
				notificaitonList: res.data.notificaitonList,
				lowBatteryList: res.data.lowBatteryList,
				locale: this.context.locale.abbr,
			})

			if (
				!isEmpty(openedNotification) &&
				res.data.notificaitonList.length === 0
			) {
				dispatch({
					type: SET_OPENED_NOTIFICATION,
					value: {},
				})
			}
		}
	}

	handleSubmit = async (e) => {
		const notificationId = e.target.getAttribute('notificationId')
		const [, dispatch] = this.context.stateReducer
		const res = await API.Notification.turnOffNotification({
			notificationId,
		})

		if (res) {
			await setSuccessMessage('save success')
			dispatch({
				type: SET_OPENED_NOTIFICATION,
				value: {},
			})
		}
	}

	getMonitorTypeText = (monitorType, locale) => {
		return locale.texts[config.MONITOR_TYPE_TEXT[monitorType]]
	}

	render() {
		const { history } = this.props
		const { notificaitonList, lowBatteryList } = this.state
		const { locale, stateReducer } = this.context
		const [, dispatch] = stateReducer
		const style = {
			list: {
				height: '40px',
				width: '800px',
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
			dropdownList: { maxHeight: '30vh', overflowY: 'auto' },
		}

		return (
			<>
				<DropdownPersist>
					<Dropdown.Toggle
						variant="light"
						id="battery-notice-btn"
						bsPrefix="bot-dropdown-toggle"
					>
						<i className="fas fa-bell" style={style.icon}>
							<NotificationBadge
								count={notificaitonList.length}
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
						<div
							className="overflow-hidden-scroll custom-scrollbar"
							style={style.dropdownList}
						>
							{notificaitonList.length !== 0 ? (
								notificaitonList.map(({ object, notificaiton }, index) => {
									const monitorTypeString = this.getMonitorTypeText(
										notificaiton.monitor_type,
										locale
									)

									const violationTimestamp = moment(
										notificaiton.violation_timestamp
									)
										.locale(locale.abbr)
										.format('HH:mm:ss')

									return (
										<Dropdown.Item key={index} style={{ color: 'black' }}>
											<Row style={style.list}>
												<Button variant="light" disabled={true}>
													&#8729;{monitorTypeString}:{' '}
													{`${object.areaName}, ${object.name} ${violationTimestamp}`}
												</Button>
												<Row
													style={{
														paddingLeft: '5px',
														paddingRight: '20px',
													}}
												>
													<Button
														variant="primary"
														onClick={() => {
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
														style={{ marginRight: '5px' }}
													>
														{locale.texts.LOCATE}
													</Button>
													<Button
														notificationId={notificaiton.id}
														variant="primary"
														onClick={this.handleSubmit}
													>
														{locale.texts.CLOSE_ALERT}
													</Button>
												</Row>
											</Row>
										</Dropdown.Item>
									)
								})
							) : (
								<Dropdown.Item disabled>{locale.texts.NO_ALERT}</Dropdown.Item>
							)}
						</div>
					</Dropdown.Menu>
				</DropdownPersist>

				<Dropdown style={{ marginLeft: '1px' }}>
					<Dropdown.Toggle
						variant="light"
						id="battery-notice-btn"
						bsPrefix="bot-dropdown-toggle"
					>
						<i className="fas fa-battery-quarter" style={{ color: '#ff6600' }}>
							<NotificationBadge
								count={lowBatteryList.length}
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
						bsPrefix="bot-dropdown-menu-right dropdown-menu"
					>
						<div className="px-5 py-2" style={style.title}>
							<Row>
								<div className="d-inline-flex justify-content-start">
									{locale.texts.BATTERY_NOTIFICATION}
								</div>
							</Row>
						</div>
						<div
							className="overflow-hidden-scroll custom-scrollbar"
							style={style.dropdownList}
						>
							{lowBatteryList.length !== 0 ? (
								lowBatteryList.map((object) => {
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
												{`, ${locale.texts.BATTERY_VOLTAGE}: ${(
													object.extend.battery_voltage / 10
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

const DropdownPersist = (props) => {
	const { stateReducer } = useContext(AppContext)
	const [, dispatch] = stateReducer
	const [open, setOpen] = useState(false)
	const onToggle = (isOpen, ev, metadata) => {
		if (metadata.source === 'select') {
			setOpen(true)
			return
		}
		setOpen(isOpen)
		if (!isOpen) {
			dispatch({
				type: SET_OPENED_NOTIFICATION,
				value: {},
			})
		}
	}

	return <Dropdown show={open} onToggle={onToggle} {...props}></Dropdown>
}

NavNotification.propTypes = {
	history: PropTypes.func,
}

export default withRouter(NavNotification)
