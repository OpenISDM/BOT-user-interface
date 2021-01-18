/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        SystemStatus.js

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
import { Container } from 'react-bootstrap'
import { AppContext } from '../../context/AppContext'
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs'
import { trackingTableColumn } from '../../config/tables'
import apiHelper from '../../helper/apiHelper'
import { toast } from 'react-toastify'
import LBeaconTable from './LBeaconTable'
import GatewayTable from './GatewayTable'
import messageGenerator from '../../helper/messageGenerator'
import BOTTable from '../BOTComponent/BOTTable'
class SystemStatus extends React.Component {
	static contextType = AppContext

	state = {
		trackingData: [],
		tabIndex: 0,
		locale: this.context.locale.lang,
	}

	toastId = null

	componentDidUpdate = (prevProps, prevState) => {
		const { locale } = this.context
		if (locale.lang !== prevState.locale) {
			this.getTrackingData()
			this.setState({
				locale: locale.lang,
			})
		}
	}

	componentDidMount = () => {
		this.getTrackingData()
	}

	componentWillUnmount = () => {
		toast.dismiss(this.toastId)
	}

	getTrackingData = async () => {
		const { locale, auth, stateReducer } = this.context
		const [{ area }] = stateReducer

		const res = await apiHelper.trackingDataApiAgent.getTrackingData({
			locale: locale.abbr,
			user: auth.user,
			areaId: area.id,
		})
		if (res) {
			this.setMessage('clear')
			res.data.forEach((item) => {
				item.status = locale.texts[item.status.toUpperCase()]
				item.transferred_location = ''
			})
			this.setState({
				trackingData: res.data,
			})
		} else {
			this.setMessage('error', 'connect to database failed', true)
		}
	}

	setMessage = (type, msg, isSetting) => {
		switch (type) {
			case 'success':
				this.toastId = messageGenerator.setSuccessMessage(msg)
				break
			case 'error':
				if (isSetting && !this.toastId) {
					this.toastId = messageGenerator.setErrorMessage(msg)
				}
				break
			case 'clear':
				this.toastId = null
				toast.dismiss(this.toastId)
				break
		}
	}

	render() {
		const { locale } = this.context

		return (
			<Container className="py-2 text-capitalize" fluid>
				<br />
				<Tabs
					variant="pills"
					onSelect={(tabIndex) => {
						if (!this.toastId) {
							toast.dismiss(this.toastId)
						}
						this.setState({
							tabIndex,
						})
					}}
					className="mb-1"
				>
					<TabList>
						<Tab>{'LBeacon'}</Tab>
						<Tab>{'Gateway'}</Tab>
						<Tab>{locale.texts.TRACKING}</Tab>
					</TabList>
					<TabPanel>
						<LBeaconTable
							lbeaconData={this.state.lbeaconData}
							lbeaconColumn={this.state.lbeaconColumn}
							refreshData={this.refreshData}
							setMessage={this.setMessage}
						/>
					</TabPanel>
					<TabPanel>
						<GatewayTable
							gatewayData={this.state.gatewayData}
							gatewayColunm={this.state.gatewayColunm}
							refreshData={this.refreshData}
							setMessage={this.setMessage}
						/>
					</TabPanel>
					<TabPanel>
						<BOTTable
							style={{ height: '75vh' }}
							data={this.state.trackingData}
							columns={trackingTableColumn}
						/>
					</TabPanel>
				</Tabs>
			</Container>
		)
	}
}

export default SystemStatus
