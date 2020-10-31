/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        ShiftChangeRecord.js

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

import React, { Fragment } from 'react'
import { ButtonToolbar } from 'react-bootstrap'
import { AppContext } from '../../../context/AppContext'
import AccessControl from '../../authentication/AccessControl'
import { PrimaryButton } from '../../BOTComponent/styleComponent'
import apiHelper from '../../../helper/apiHelper'
import config from '../../../config'
import { formatTime } from '../../../helper/utilities'
import ShiftChange from '../ShiftChange'
import Select from 'react-select'
import Cookies from 'js-cookie'
import messageGenerator from '../../../helper/messageGenerator'
import { SAVE_SUCCESS } from '../../../config/wordMap'

class ShiftChangeRecord extends React.Component {
	static contextType = AppContext

	state = {
		data: [],
		deviceGroupListOptions: [],
		devicelist: null,
		showShiftChange: false,
		locale: this.context.locale.abbr,
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (this.context.locale.abbr !== prevState.locale) {
			this.getData()
		}
	}

	componentDidMount = () => {
		this.getData()
		this.getDeviceGroup()
	}

	getData = async (callback) => {
		const { locale } = this.context

		try {
			const res = await apiHelper.record.getRecord(
				config.RECORD_TYPE.SHIFT_CHANGE,
				locale.abbr
			)

			res.data.rows.forEach((item) => {
				item.shift =
					item.shift &&
					locale.texts[item.shift.toUpperCase().replace(/ /g, '_')]
				item.submit_timestamp =
					item.submit_timestamp && formatTime(item.submit_timestamp)
			})
			this.setState(
				{
					data: res.data.rows,
					locale: locale.abbr,
				},
				callback
			)
		} catch (e) {
			console.log(`get shift change record failed ${e}`)
		}
	}

	handleClose = () => {
		this.setState({
			showShiftChange: false,
		})
	}

	getDeviceGroup = () => {
		apiHelper.deviceGroupListApis
			.getDeviceGroupList()
			.then((res) => {
				const listId =
					Cookies.get('user') && JSON.parse(Cookies.get('user')).list_id
						? JSON.parse(Cookies.get('user')).list_id
						: null

				let devicelist = null

				const deviceGroupListOptions = res.data.map((item) => {
					const option = {
						label: item.name,
						value: item,
					}
					if (item.id === listId) {
						devicelist = option
					}
					return option
				})

				this.setState({
					deviceGroupListOptions,
					devicelist,
				})
			})
			.catch((err) => {
				console.log('err when get device group ', err)
			})
	}

	selectDeviceGroup = (devicelist) => {
		const { auth } = this.context
		const callback = async () => {
			const user = {
				...JSON.parse(Cookies.get('user')),
				list_id: devicelist.value.id,
			}
			await Cookies.set('user', user)
			auth.setListId(devicelist.value.id)
		}
		this.setState(
			{
				devicelist,
			},
			callback
		)
	}

	render() {
		const { locale } = this.context
		const { devicelist } = this.state

		return (
			<Fragment>
				<div className="mb-">
					<div className="color-black mb-2">
						{locale.texts.SELECT_DEVICE_LIST}
					</div>
					<Select
						className="w-50"
						isClearable
						onChange={this.selectDeviceGroup}
						options={this.state.deviceGroupListOptions}
						value={this.state.devicelist}
					/>
				</div>
				<hr />
				<AccessControl
					renderNoAccess={() => null}
					platform={['browser', 'tablet']}
				>
					<ButtonToolbar>
						<PrimaryButton
							disabled={!devicelist}
							onClick={() => {
								this.setState({
									showShiftChange: true,
								})
							}}
						>
							{locale.texts.GENERATE_RECORD}
						</PrimaryButton>
					</ButtonToolbar>
				</AccessControl>
				<ShiftChange
					show={this.state.showShiftChange}
					handleClose={this.handleClose}
					listName={this.state.devicelist ? this.state.devicelist.label : null}
				/>
			</Fragment>
		)
	}
}

export default ShiftChangeRecord
