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
import _, { debounce } from 'lodash'
import { AppContext } from '../../../context/AppContext'
import AccessControl from '../../authentication/AccessControl'
import { PrimaryButton } from '../../BOTComponent/styleComponent'
import apiHelper from '../../../helper/apiHelper'
import config from '../../../config'
import ShiftChange from '../ShiftChange'
import AssignmentItems from '../AssignmentItems'

const { ASSIGNMENT } = config

class ShiftChangeRecord extends React.Component {
	static contextType = AppContext

	state = {
		objectMap: {},
		groupMap: {},
		assignedDeviceGroupListids: [],
		assignedPatientGroupListids: [],
		showShiftChange: false,
		locale: this.context.locale.abbr,
		prevIndex: null,
	}

	componentDidUpdate = (prevProps, prevState) => {
		const { prevIndex } = prevProps
		if (prevIndex !== prevState.prevIndex) {
			this.debounceReload({ prevIndex, prevState: prevState.prevIndex })
		}
	}

	debounceReload = debounce(
		(object) => {
			console.log('ShiftChangeRecord', object)
			this.setState(object)
			this.reload()
		},
		10,
		{
			leading: true,
			trailing: false,
		}
	)

	reload = () => {
		this.getAssignments()
		this.getPatientGroupList()
		this.getDeviceGroupListDetail()
	}

	handleClose = () => {
		this.setState({
			showShiftChange: false,
		})
	}

	getAssignments = async () => {
		const { stateReducer, auth } = this.context
		const [{ areaId }] = stateReducer
		const userId = auth.user.id
		const assignedDeviceGroupListids = []
		const assignedPatientGroupListids = []

		const res = await apiHelper.userAssignmentsApiAgent.getByUserId({
			areaId,
			userId,
		})

		if (res) {
			res.data
				.filter((item) => item.status === ASSIGNMENT.STATUS.ON_GOING)
				.forEach((item) => {
					switch (item.assignment_type) {
						case ASSIGNMENT.TYPE.DEVICE:
							assignedDeviceGroupListids.push(parseInt(item.group_list_id))
							break
						case ASSIGNMENT.TYPE.PATIENT:
							assignedPatientGroupListids.push(parseInt(item.group_list_id))
							break
					}
				})
		}

		this.setState({
			assignedDeviceGroupListids,
			assignedPatientGroupListids,
		})
	}

	getPatientGroupList = async () => {
		const { stateReducer } = this.context
		const [{ areaId }] = stateReducer

		try {
			const res = await apiHelper.patientGroupListApis.getDetailByAreaId(areaId)
			const patientGruopMap = _.keyBy(res.data.gruopList, 'id')
			const patientObjectMap = _.keyBy(res.data.objectList, 'id')
			this.setState({
				groupMap: { ...this.state.groupMap, ...patientGruopMap },
				objectMap: { ...this.state.objectMap, ...patientObjectMap },
			})
		} catch (e) {
			console.log('get patient group failed', e)
		}
	}

	getDeviceGroupListDetail = async () => {
		const { stateReducer } = this.context
		const [{ areaId }] = stateReducer

		try {
			const res = await apiHelper.deviceGroupListApis.getDetailByAreaId(areaId)
			const deviceGruopMap = _.keyBy(res.data.gruopList, 'id')
			const deviceObjectMap = _.keyBy(res.data.objectList, 'id')
			this.setState({
				groupMap: { ...this.state.groupMap, ...deviceGruopMap },
				objectMap: { ...this.state.objectMap, ...deviceObjectMap },
			})
		} catch (e) {
			console.log('get device group failed', e)
		}
	}

	generateAssignmentItems = (
		objectMap,
		groupMap,
		assignedDeviceGroupListids,
		assignedPatientGroupListids
	) => {
		const renderAssignmentItems = [
			...assignedDeviceGroupListids,
			...assignedPatientGroupListids,
		]

		if (renderAssignmentItems.length > 0) {
			return (
				<>
					<hr />
					<AssignmentItems
						objectMap={objectMap}
						gruopMap={groupMap}
						submitGroupListIds={[]}
						assignedGroupListids={renderAssignmentItems}
						showOnlyAssigned={true}
					/>
					<hr />
				</>
			)
		}
		return null
	}

	render() {
		const { locale } = this.context
		const {
			objectMap,
			groupMap,
			assignedDeviceGroupListids,
			assignedPatientGroupListids,
			showShiftChange,
		} = this.state

		const disabled = !(
			assignedDeviceGroupListids.length > 0 ||
			assignedPatientGroupListids.length > 0
		)

		let allAssignmentsName = ''
		if (groupMap) {
			allAssignmentsName = Object.values(groupMap)
				.map((item) => item.name)
				.toString()
		}

		return (
			<Fragment>
				<AccessControl
					renderNoAccess={() => null}
					platform={['browser', 'tablet']}
				>
					<ButtonToolbar>
						<PrimaryButton
							disabled={disabled}
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

				{this.generateAssignmentItems(
					objectMap,
					groupMap,
					assignedDeviceGroupListids,
					assignedPatientGroupListids
				)}

				<ShiftChange
					show={showShiftChange}
					handleClose={this.handleClose}
					handleSubmit={this.reload}
					assignedDeviceGroupListids={assignedDeviceGroupListids}
					assignedPatientGroupListids={assignedPatientGroupListids}
					listName={allAssignmentsName}
				/>
			</Fragment>
		)
	}
}

export default ShiftChangeRecord
