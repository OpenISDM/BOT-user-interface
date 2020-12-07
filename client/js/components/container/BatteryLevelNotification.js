/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        BatteryLevelNotification.js

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
import NotificationBadge, { Effect } from 'react-notification-badge'
import { Row, Dropdown } from 'react-bootstrap'
import { AppContext } from '../../context/AppContext'
import config from '../../config'
import { getDescription } from '../../helper/descriptionGenerator'
import apiHelper from '../../helper/apiHelper'

class BatteryLevelNotification extends React.Component {
	static contextType = AppContext

	state = {
		data: [],
		locale: this.context.locale.abbr,
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (this.context.locale.abbr !== prevState.locale) {
			this.getTrackingData()
		}
	}

	componentDidMount = () => {
		this.getTrackingData()
	}

	getTrackingData = async () => {
		const { auth, locale, stateReducer } = this.context

		const [{ area }] = stateReducer
		const res = await apiHelper.trackingDataApiAgent.getTrackingData({
			locale: locale.abbr,
			user: auth.user,
			areaId: area.id,
		})
		this.setState({
			data: res.data.filter((item) => item.battery_indicator === 2),
			locale: this.context.locale.abbr,
		})
	}

	render() {
		const { data } = this.state
		const { locale } = this.context
		const style = {
			list: {
				wordBreak: 'keep-all',
				zIndex: 1,
				overFlow: 'hidden scroll',
			},
			dropdown: {
				maxHeight: '300px',
				marginBottom: 5,
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
			<Dropdown>
				<Dropdown.Toggle
					variant="light"
					id="battery-notice-btn"
					bsPrefix="bot-dropdown-toggle"
				>
					<i className="fas fa-bell" style={style.icon}>
						<NotificationBadge
							count={data.length}
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
					<div
						className="overflow-hidden-scroll custom-scrollbar"
						style={style.dropdown}
					>
						{data.length !== 0 ? (
							data.map((item) => {
								return (
									<Dropdown.Item
										key={item.mac_address}
										disabled
										style={{ color: 'black' }}
									>
										<div
											className={
												null
												// 'd-inline-flex justify-content-start text-left'
											}
											style={style.list}
										>
											<p className="d-inline-block mx-2">&#8729;</p>
											{getDescription({ item, locale, keywordType: config })}
											{locale.texts.BATTERY_VOLTAGE}:
											{(item.battery_voltage / 10).toFixed(1)}
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
		)
	}
}

export default BatteryLevelNotification
