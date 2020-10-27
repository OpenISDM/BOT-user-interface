/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        GetAssignments.js

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
import { ButtonToolbar, Row, Col } from 'react-bootstrap'
import _ from 'lodash'
import { AppContext } from '../../context/AppContext'
import { PrimaryButton } from '../BOTComponent/styleComponent'
import apiHelper from '../../helper/apiHelper'
import messageGenerator from '../../helper/messageGenerator'
import { SAVE_SUCCESS } from '../../config/wordMap'
import CheckboxOverlayTrigger from '../presentational/CheckboxOverlayTrigger'

const ASSIGNMENT_TYPE = {
	DEVICE: 0,
	PATIENT: 1,
}

const ASSIGNMENT_STATUS = {
	ON_GOING: 0,
	COMPLETED: 1,
}

class GetAssignments extends React.Component {
	static contextType = AppContext

	state = {
		currentAssignmentType: ASSIGNMENT_TYPE.DEVICE,
		deviceGroupMap: {},
		patientGroupMap: {},
		objectMap: {},
		submitGroupListIds: [],
		assignedDeviceGroupListids: [],
		assignedPatientGroupListids: [],
	}

	componentDidMount = () => {
		this.reload()
	}

	reload = () => {
		this.getPatientGroupList()
		this.getDeviceGroupListDetail()
		this.getAssignments()
	}

	getAssignments = async () => {
		const { stateReducer, auth } = this.context
		const [{ areaId }] = stateReducer
		const userId = auth.user.id

		try {
			const res = await apiHelper.userAssignmentsApiAgent.getByUserId({
				areaId,
				userId,
			})

			const assignedDeviceGroupListids = []
			const assignedPatientGroupListids = []
			res.data
				.filter((item) => item.status === ASSIGNMENT_STATUS.ON_GOING)
				.forEach((item) => {
					switch (item.assignment_type) {
						case ASSIGNMENT_TYPE.DEVICE:
							assignedDeviceGroupListids.push(parseInt(item.group_list_id))
							break
						case ASSIGNMENT_TYPE.PATIENT:
							assignedPatientGroupListids.push(parseInt(item.group_list_id))
							break
					}
				})

			this.setState({
				assignedDeviceGroupListids,
				assignedPatientGroupListids,
				submitGroupListIds: [],
			})
		} catch (e) {
			console.log('get patient group failed', e)
		}
	}

	acceptAssignments = async (submitGroupListIds) => {
		const { auth } = this.context
		const userId = auth.user.id

		try {
			await apiHelper.userAssignmentsApiAgent.accept({
				userId,
				groupListIds: submitGroupListIds,
				assignmentType: this.state.currentAssignmentType,
			})
			await messageGenerator.setSuccessMessage(SAVE_SUCCESS)
			this.reload()
		} catch (e) {
			console.log('get patient group failed', e)
		}
	}

	cancelAssignments = async (assignedGroupListids) => {
		const { auth } = this.context
		const userId = auth.user.id

		try {
			await apiHelper.userAssignmentsApiAgent.cancel({
				userId,
				groupListIds: assignedGroupListids,
				assignmentType: this.state.currentAssignmentType,
			})
			await messageGenerator.setSuccessMessage(SAVE_SUCCESS)
			this.reload()
		} catch (e) {
			console.log('get patient group failed', e)
		}
	}

	getPatientGroupList = async () => {
		const { stateReducer } = this.context
		const [{ areaId }] = stateReducer

		try {
			const res = await apiHelper.patientGroupListApis.getDetailByAreaId(areaId)
			const patientGroupMap = _.keyBy(res.data.gruopList, 'id')
			const patientObjectMap = _.keyBy(res.data.objectList, 'id')
			this.setState({
				patientGroupMap,
				objectMap: { ...this.state.objectMap, ...patientObjectMap },
			})
			console.log(patientObjectMap)
		} catch (e) {
			console.log('get patient group failed', e)
		}
	}

	getDeviceGroupListDetail = async () => {
		const { stateReducer } = this.context
		const [{ areaId }] = stateReducer

		try {
			const res = await apiHelper.deviceGroupListApis.getDetailByAreaId(areaId)
			const deviceGroupMap = _.keyBy(res.data.gruopList, 'id')
			const deviceObjectMap = _.keyBy(res.data.objectList, 'id')
			this.setState({
				deviceGroupMap,
				objectMap: { ...this.state.objectMap, ...deviceObjectMap },
			})
			console.log(deviceObjectMap)
		} catch (e) {
			console.log('get device group failed', e)
		}
	}

	handleClose = () => {
		this.setState({
			showShiftChange: false,
		})
	}

	handleChange = (e) => {
		const groupId = parseInt(e.target.id)
		let submitGroupListIds = []
		if (this.state.submitGroupListIds.includes(groupId)) {
			// remove id
			submitGroupListIds = this.state.submitGroupListIds.filter(
				(id) => id !== groupId
			)
		} else {
			// add id
			submitGroupListIds = [...this.state.submitGroupListIds, groupId]
		}
		console.log(submitGroupListIds)
		this.setState({
			submitGroupListIds: [...new Set(submitGroupListIds)],
		})
	}

	generateAssisments = (groupMap, assignedGroupListids) => {
		return Object.values(groupMap).map((group) => {
			const { id, name } = group
			const checked =
				this.state.submitGroupListIds.includes(id) ||
				assignedGroupListids.includes(id)
			return (
				<Row style={{ marginTop: '5px', marginBottom: '5px' }} key={id}>
					<CheckboxOverlayTrigger
						popoverTitle={name}
						popoverBody={this.generateAssismentsDetails(group)}
						id={id}
						name={name}
						checked={checked}
						placement={'right'}
						onChange={this.handleChange}
						label={name}
						disabled={assignedGroupListids.includes(id)}
						trigger={'hover'}
					/>
				</Row>
			)
		})
	}

	generateAssismentsDetails = (gruop) => {
		// TODO: Johnson will implement Jane's requirement
		const { items } = gruop
		let itemsNameString = ''
		if (items) {
			items.forEach((id) => {
				itemsNameString =
					itemsNameString +
					this.state.objectMap[id].name +
					String.fromCharCode(13, 10)
			})
		}

		return itemsNameString
	}

	handleAssigmentTypeChange = (e) => {
		const type = parseInt(e.target.id)
		this.setState({ currentAssignmentType: type })
	}

	generateActionButtons = (locale, assignedGroupListids) => {
		const { submitGroupListIds } = this.state
		let buttons = null

		if (submitGroupListIds.length > 0) {
			buttons = (
				<ButtonToolbar>
					<PrimaryButton
						onClick={() => {
							this.acceptAssignments(submitGroupListIds)
						}}
					>
						{locale.texts.CONFIRM}
					</PrimaryButton>
					<PrimaryButton
						onClick={() => {
							this.setState({ submitGroupListIds: [] })
						}}
					>
						{locale.texts.CANCEL}
					</PrimaryButton>
				</ButtonToolbar>
			)
		} else if (assignedGroupListids.length > 0) {
			buttons = (
				<ButtonToolbar>
					<PrimaryButton
						onClick={() => {
							this.cancelAssignments(assignedGroupListids)
						}}
					>
						{locale.texts.CANCEL_ALL}
					</PrimaryButton>
				</ButtonToolbar>
			)
		}

		return buttons
	}

	render() {
		const { locale } = this.context

		const gruopMap =
			this.state.currentAssignmentType === ASSIGNMENT_TYPE.DEVICE
				? this.state.deviceGroupMap
				: this.state.patientGroupMap

		const assignedGroupListids =
			this.state.currentAssignmentType === ASSIGNMENT_TYPE.DEVICE
				? this.state.assignedDeviceGroupListids
				: this.state.assignedPatientGroupListids

		return (
			<>
				<ButtonToolbar>
					<PrimaryButton
						disabled={
							this.state.currentAssignmentType === ASSIGNMENT_TYPE.DEVICE
						}
						id={ASSIGNMENT_TYPE.DEVICE}
						onClick={this.handleAssigmentTypeChange}
					>
						{locale.texts.DEVICE}
					</PrimaryButton>
					<PrimaryButton
						disabled={
							this.state.currentAssignmentType === ASSIGNMENT_TYPE.PATIENT
						}
						id={ASSIGNMENT_TYPE.PATIENT}
						onClick={this.handleAssigmentTypeChange}
					>
						{locale.texts.PATIENT}
					</PrimaryButton>
				</ButtonToolbar>
				<hr />
				<Col>{this.generateAssisments(gruopMap, assignedGroupListids)}</Col>
				<hr />
				{this.generateActionButtons(locale, assignedGroupListids)}
			</>
		)
	}
}

export default GetAssignments
