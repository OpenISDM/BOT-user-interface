import React, { useState, useContext } from 'react'
import { Row, Dropdown, Button } from 'react-bootstrap'
import NotificationBadge, { Effect } from 'react-notification-badge'
import { withRouter } from 'react-router-dom'
import { isEmpty } from 'lodash'
import moment from 'moment'
import { AppContext } from '../context/AppContext'
import config from '../config'
import API from '../api'
import { getDescription } from '../helper/descriptionGenerator'
import { setSuccessMessage } from '../helper/messageGenerator'
import { SET_OPENED_NOTIFICATION } from '../reducer/action'
import PropTypes from 'prop-types'

class NavNotification extends React.Component {
	static contextType = AppContext

	state = {
		notificationMap: {},
		notificationList: [],
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
			config.notificationIntervalTime
		)
	}

	getAllNotifications = async () => {
		const [{ area, openedNotification }, dispatch] = this.context.stateReducer
		const res = await API.Notification.getAllNotifications({
			areaId: area.id,
		})

		if (res) {
			const notificationList = res.data.notificationList
			const lowBatteryList = res.data.lowBatteryList
			const notificationMap = {}

			notificationList.forEach(({ notification }) => {
				notificationMap[notification.id] = notification
			})

			this.setState({
				notificationMap,
				notificationList,
				lowBatteryList,
				locale: this.context.locale.abbr,
			})

			if (
				!isEmpty(openedNotification) &&
				res.data.notificationList.length === 0
			) {
				dispatch({
					type: SET_OPENED_NOTIFICATION,
					value: null,
				})
			}
		}
	}

	handleSubmit = async (e) => {
		const notificationId = e.target.getAttribute('notificationId')
		const [, dispatch] = this.context.stateReducer
		const { notificationMap } = this.state

		const res = await API.Notification.turnOffNotification({
			notificationId,
			macAddress: notificationMap[notificationId].mac_address,
			monitorType: notificationMap[notificationId].monitor_type,
		})

		if (res) {
			await setSuccessMessage('save success')
			await this.getAllNotifications()
			dispatch({
				type: SET_OPENED_NOTIFICATION,
				value: null,
			})
		}
	}

	getMonitorTypeText = (monitorType, locale) => {
		return locale.texts[config.MONITOR_TYPE_TEXT[monitorType]]
	}

	render() {
		const { history } = this.props
		const { notificationList, lowBatteryList } = this.state
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
								count={notificationList.length}
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
							{notificationList.length !== 0 ? (
								notificationList.map(({ notification, object }, index) => {
									const monitorTypeString = this.getMonitorTypeText(
										notification.monitor_type,
										locale
									)

									const violationTimestamp = moment(
										notification.violation_timestamp
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
																value: { notification, object },
															})

															history.push('/')
														}}
														style={{ marginRight: '5px' }}
													>
														{locale.texts.LOCATE}
													</Button>
													<Button
														notificationId={notification.id}
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

				<DropdownPersist style={{ marginLeft: '1px' }}>
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
						flip={false}
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
								lowBatteryList.map((object, index) => {
									return (
										<Dropdown.Item key={index} style={{ color: 'black' }}>
											<Row style={style.list}>
												<Button variant="light" disabled={true}>
													{`${object.areaName}, `}
													{getDescription({
														item: object,
														locale,
														keywordType: config,
													})}
													{`, ${locale.texts.BATTERY_VOLTAGE}: ${(
														object.extend.battery_voltage / 10
													).toFixed(1)}`}
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
																value: { object },
															})

															history.push('/')
														}}
														style={{ marginRight: '5px' }}
													>
														{locale.texts.LOCATE}
													</Button>
												</Row>
											</Row>
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
				</DropdownPersist>
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
				value: null,
			})
		}
	}

	return <Dropdown show={open} onToggle={onToggle} {...props}></Dropdown>
}

NavNotification.propTypes = {
	history: PropTypes.func,
}

export default withRouter(NavNotification)
