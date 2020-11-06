/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        MyDeviceManager.js

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
import { Col, Row } from 'react-bootstrap'
import AddableList from './AddableList'
import { AppContext } from '../../../context/AppContext'
import { getName, getType, getACN } from '../../../helper/descriptionGenerator'
import apiHelper from '../../../helper/apiHelper'

const style = {
	list: {
		// wordBreak: 'keep-all',
		zIndex: 1,
	},
	item: {
		minWidth: 35,
	},
}

class MyDeviceManager extends React.Component {
	static contextType = AppContext

	state = {
		dataMap: null,
		myDeviceList: null,
		myDevices: {},
		notMyDevices: {},
	}

	APIforAddableList_1 = null
	APIforAddableList_2 = null

	API = {
		setAllDevice: (deviceList) => {
			this.allDevices = deviceList
		},

		setMyDevice: (myList) => {
			this.myDevices = myList
		},

		switchDevice: (acn) => {
			const { auth } = this.context
			let userInfo = auth.user
			let myDevice = userInfo.myDevice || []

			const { myDevices, notMyDevices } = this.state

			if (acn in myDevices) {
				notMyDevices[acn] = myDevices[acn]
				delete myDevices[acn]
				const index = myDevice.indexOf(acn)
				myDevice = [...myDevice.slice(0, index), ...myDevice.slice(index + 1)]
				this.API.postMyDeviceChange('remove', acn)
			} else if (acn in notMyDevices) {
				myDevices[acn] = notMyDevices[acn]
				delete notMyDevices[acn]
				myDevice.push(acn)
				this.API.postMyDeviceChange('add', acn)
			} else {
				console.error('acn is not in device list')
			}

			userInfo = {
				...userInfo,
				myDevice,
			}

			auth.setCookies('user', userInfo)
			auth.setUserInfo('myDevice', myDevice)

			this.setState({
				myDevices,
				notMyDevices,
			})

			this.APIforAddableList_1.setList(myDevices)
			this.APIforAddableList_2.setList(notMyDevices)
		},

		postMyDeviceChange: (mode, acn) => {
			const { auth } = this.context
			const username = auth.user.name

			apiHelper.userApiAgent
				.editMyDevice({
					username,
					mode,
					acn,
				})
				.catch((err) => {
					console.log(err)
				})
		},
	}

	functionForAddableList = {
		onClick: (e) => {
			const acn = e.target.getAttribute('name')
			this.API.switchDevice(acn)
		},

		validation: (string) => {
			const re = /^\s*(?<acn>\d{4}-\d{4}-\d{4})\s*$/
			const match = string.match(re)
			if (match) {
				return match.groups.acn
			}
			return null
		},

		itemLayout: (item, index) => {
			const { locale } = this.context
			return (
				<div
					className="d-flex justify-content-start text-left py-1 text-left justify-content-start"
					style={style.list}
					name={item.asset_control_number}
					key={index}
				>
					<div
						style={style.item}
						name={item.asset_control_number}
						className="d-flex justify-content-center"
					>
						<div name={item.asset_control_number} className="d-inline-block">
							&bull;
						</div>
					</div>
					<div name={item.asset_control_number}>
						{getName(item, locale)}
						{getType(item, locale)}
						{getACN(item, locale).replace(/,/, '')}
					</div>
				</div>
			)
		},
	}

	componentDidMount = () => {
		this.getObjectData()
	}

	getAPIfromAddableList_1 = (API) => {
		const { itemLayout, validation, onClick } = this.functionForAddableList
		this.APIforAddableList_1 = API
		this.APIforAddableList_1.setValidation(validation)
		this.APIforAddableList_1.setItemLayout(itemLayout)
		this.APIforAddableList_1.setOnClick(onClick)
	}

	getAPIfromAddableList_2 = (API) => {
		const { itemLayout, validation, onClick } = this.functionForAddableList
		this.APIforAddableList_2 = API
		this.APIforAddableList_2.setValidation(validation)
		this.APIforAddableList_2.setItemLayout(itemLayout)
		this.APIforAddableList_2.setOnClick(onClick)
	}

	getObjectData = async () => {
		const { locale, auth } = this.context

		const res = apiHelper.objectApiAgent.getObjectTable({
			locale: locale.abbr,
			areas_id: auth.user.areas_id,
			objectType: [0],
		})
		if (res) {
			const myDevices = {}
			const notMyDevices = {}

			res.data.rows.forEach((item) => {
				if (auth.user.myDevice.includes(item.asset_control_number)) {
					myDevices[item.asset_control_number] = item
				} else {
					notMyDevices[item.asset_control_number] = item
				}
			})

			this.setState({
				myDevices,
				notMyDevices,
			})

			this.APIforAddableList_1.setList(myDevices)
			this.APIforAddableList_2.setList(notMyDevices)
		}
	}

	render() {
		const { locale } = this.context

		const style = {
			AddableListStyle: {
				height: '35vh',
				overflow: 'scroll',
			},
		}

		return (
			<div className="text-capitalize">
				<Row className="w-100 d-flex bg-white">
					<Col>
						<div className="title">{locale.texts.MY_DEVICES_LIST}</div>
						<div style={style.AddableListStyle}>
							<AddableList getAPI={this.getAPIfromAddableList_1} />
						</div>
					</Col>
				</Row>
				<br />
				<Row className="w-100 d-flex bg-white">
					<Col>
						<div className="title">{locale.texts.NOT_MY_DEVICES_LIST}</div>
						<div style={style.AddableListStyle}>
							<AddableList getAPI={this.getAPIfromAddableList_2} />
						</div>
					</Col>
				</Row>
			</div>
		)
	}
}

export default MyDeviceManager
